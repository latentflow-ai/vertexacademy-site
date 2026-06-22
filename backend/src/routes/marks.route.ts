import { Router, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';
import { canViewStudent, facultyAssignedTo, facultyIdForUser } from '../lib/access';

const router = Router();
router.use(requireAuth);

// GET /api/marks?classId=&subjectId=&assessment= — roster + existing scores
router.get('/', requireRole(Role.FACULTY, Role.ADMIN), async (req: AuthedRequest, res: Response) => {
  const classId = String(req.query.classId || '');
  const subjectId = String(req.query.subjectId || '');
  const assessment = String(req.query.assessment || '');
  if (!classId || !subjectId) return res.status(400).json({ error: 'Invalid request', message: 'classId and subjectId required' });

  if (req.user!.role === Role.FACULTY) {
    const fid = await facultyIdForUser(req.user!.sub);
    if (!fid || !(await facultyAssignedTo(fid, classId, subjectId))) {
      return res.status(403).json({ error: 'Forbidden', message: 'You are not assigned to this subject' });
    }
  }

  const students = await prisma.student.findMany({
    where: { classId, subjects: { some: { id: subjectId } } },
    orderBy: { user: { idNumber: 'asc' } },
    select: { id: true, user: { select: { fullName: true, idNumber: true } } },
  });
  const existing = assessment
    ? await prisma.mark.findMany({ where: { subjectId, assessment }, select: { studentId: true, score: true, maxScore: true } })
    : [];
  const map = new Map(existing.map((m) => [m.studentId, m]));
  res.json({
    roster: students.map((s) => ({
      studentId: s.id,
      name: s.user.fullName,
      idNumber: s.user.idNumber,
      score: map.get(s.id)?.score ?? null,
      maxScore: map.get(s.id)?.maxScore ?? null,
    })),
  });
});

const enterSchema = z.object({
  classId: z.string().min(1),
  subjectId: z.string().min(1),
  assessment: z.string().min(1),
  maxScore: z.number().positive(),
  entries: z.array(z.object({ studentId: z.string(), score: z.number().min(0) })).min(1),
});

// POST /api/marks — faculty enters/updates marks for an assessment
router.post('/', requireRole(Role.FACULTY), async (req: AuthedRequest, res: Response) => {
  const parsed = enterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', message: parsed.error.issues[0]?.message || 'Invalid input' });
  const { classId, subjectId, assessment, maxScore, entries } = parsed.data;

  const fid = await facultyIdForUser(req.user!.sub);
  if (!fid || !(await facultyAssignedTo(fid, classId, subjectId))) {
    return res.status(403).json({ error: 'Forbidden', message: 'You are not assigned to this subject' });
  }
  if (entries.some((e) => e.score > maxScore)) {
    return res.status(400).json({ error: 'Invalid request', message: 'A score exceeds the maximum' });
  }

  await prisma.$transaction(
    entries.map((e) =>
      prisma.mark.upsert({
        where: { studentId_subjectId_assessment: { studentId: e.studentId, subjectId, assessment } },
        create: { studentId: e.studentId, subjectId, assessment, score: e.score, maxScore, enteredById: fid },
        update: { score: e.score, maxScore, enteredById: fid },
      })
    )
  );

  await logAudit({ userId: req.user!.sub, action: 'MARKS_ENTERED', entity: 'Subject', entityId: subjectId, req });
  res.json({ success: true, count: entries.length });
});

// GET /api/marks/report/:studentId — report card grouped by subject
router.get('/report/:studentId', async (req: AuthedRequest, res: Response) => {
  if (!(await canViewStudent(req.user!, req.params.studentId))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const marks = await prisma.mark.findMany({
    where: { studentId: req.params.studentId },
    orderBy: [{ subjectId: 'asc' }, { date: 'asc' }],
    include: { subject: { select: { name: true } } },
  });
  const bySubject = new Map<string, { subject: string; items: any[]; score: number; max: number }>();
  for (const m of marks) {
    const e = bySubject.get(m.subjectId) || { subject: m.subject.name, items: [], score: 0, max: 0 };
    e.items.push({ assessment: m.assessment, score: m.score, maxScore: m.maxScore });
    e.score += m.score;
    e.max += m.maxScore;
    bySubject.set(m.subjectId, e);
  }
  const subjects = [...bySubject.values()].map((e) => ({
    subject: e.subject,
    items: e.items,
    total: e.score,
    max: e.max,
    percentage: e.max ? Math.round((e.score / e.max) * 100) : 0,
  }));
  const totalScore = subjects.reduce((a, s) => a + s.total, 0);
  const totalMax = subjects.reduce((a, s) => a + s.max, 0);
  res.json({ subjects, overall: totalMax ? Math.round((totalScore / totalMax) * 100) : 0 });
});

export default router;
