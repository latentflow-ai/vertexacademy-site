import { Router, Response } from 'express';
import { z } from 'zod';
import { AttendanceStatus, Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';
import { canViewStudent, facultyAssignedTo, facultyIdForUser } from '../lib/access';

const router = Router();
router.use(requireAuth);

// GET /api/attendance?classId=&subjectId=&date= — roster + existing marks
// (faculty assigned to the subject, or admin)
router.get('/', requireRole(Role.FACULTY, Role.ADMIN), async (req: AuthedRequest, res: Response) => {
  const classId = String(req.query.classId || '');
  const subjectId = String(req.query.subjectId || '');
  const date = String(req.query.date || '');
  if (!classId || !subjectId || !date) {
    return res.status(400).json({ error: 'Invalid request', message: 'classId, subjectId and date are required' });
  }

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
  const existing = await prisma.attendance.findMany({
    where: { classId, subjectId, date: new Date(date) },
    select: { studentId: true, status: true },
  });
  const map = new Map(existing.map((e) => [e.studentId, e.status]));
  res.json({
    roster: students.map((s) => ({
      studentId: s.id,
      name: s.user.fullName,
      idNumber: s.user.idNumber,
      status: map.get(s.id) || null,
    })),
  });
});

const markSchema = z.object({
  classId: z.string().min(1),
  subjectId: z.string().min(1),
  date: z.string().min(1),
  entries: z.array(z.object({ studentId: z.string(), status: z.nativeEnum(AttendanceStatus) })).min(1),
});

// POST /api/attendance — faculty marks per-subject attendance for a date
router.post('/', requireRole(Role.FACULTY), async (req: AuthedRequest, res: Response) => {
  const parsed = markSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', message: 'Invalid input' });
  const { classId, subjectId, entries } = parsed.data;
  const date = new Date(parsed.data.date);
  if (date.getTime() > Date.now()) {
    return res.status(400).json({ error: 'Invalid request', message: 'Cannot mark attendance for a future date' });
  }

  const fid = await facultyIdForUser(req.user!.sub);
  if (!fid || !(await facultyAssignedTo(fid, classId, subjectId))) {
    return res.status(403).json({ error: 'Forbidden', message: 'You are not assigned to this subject' });
  }

  await prisma.$transaction(
    entries.map((e) =>
      prisma.attendance.upsert({
        where: { studentId_subjectId_date: { studentId: e.studentId, subjectId, date } },
        create: { studentId: e.studentId, classId, subjectId, date, status: e.status, markedById: fid },
        update: { status: e.status, markedById: fid },
      })
    )
  );

  await logAudit({ userId: req.user!.sub, action: 'ATTENDANCE_MARKED', entity: 'Subject', entityId: subjectId, req });
  res.json({ success: true, count: entries.length });
});

// GET /api/attendance/summary/:studentId — per-subject attendance % for a student
router.get('/summary/:studentId', async (req: AuthedRequest, res: Response) => {
  if (!(await canViewStudent(req.user!, req.params.studentId))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const records = await prisma.attendance.findMany({
    where: { studentId: req.params.studentId },
    include: { subject: { select: { id: true, name: true } } },
  });
  const bySubject = new Map<string, { subject: string; total: number; present: number }>();
  for (const r of records) {
    const key = r.subjectId;
    const e = bySubject.get(key) || { subject: r.subject.name, total: 0, present: 0 };
    e.total += 1;
    if (r.status === 'PRESENT' || r.status === 'LATE') e.present += 1;
    bySubject.set(key, e);
  }
  const subjects = [...bySubject.values()].map((e) => ({
    subject: e.subject,
    total: e.total,
    present: e.present,
    percentage: e.total ? Math.round((e.present / e.total) * 100) : 0,
  }));
  const total = subjects.reduce((a, s) => a + s.total, 0);
  const present = subjects.reduce((a, s) => a + s.present, 0);
  res.json({ subjects, overall: total ? Math.round((present / total) * 100) : 0 });
});

export default router;
