import { Router, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';
import { facultyIdForUser, studentIdForUser } from '../lib/access';

const router = Router();
router.use(requireAuth);

// GET /api/me/faculty/classes — classes (with the subjects this faculty teaches)
router.get('/faculty/classes', requireRole(Role.FACULTY), async (req: AuthedRequest, res: Response) => {
  const fid = await facultyIdForUser(req.user!.sub);
  if (!fid) return res.status(404).json({ error: 'Not found' });

  const assignments = await prisma.facultyAssignment.findMany({
    where: { facultyId: fid },
    include: {
      class: { select: { id: true, name: true, board: true, stream: true, academicYear: true, classTeacherId: true } },
      subject: { select: { id: true, name: true } },
    },
  });

  const byClass = new Map<string, any>();
  for (const a of assignments) {
    if (!a.class) continue;
    const e = byClass.get(a.classId) || {
      classId: a.class.id,
      name: a.class.name,
      board: a.class.board,
      stream: a.class.stream,
      academicYear: a.class.academicYear,
      isClassTeacher: a.class.classTeacherId === fid,
      subjects: [],
    };
    if (a.subject) e.subjects.push({ subjectId: a.subject.id, name: a.subject.name });
    byClass.set(a.classId, e);
  }
  res.json({ classes: [...byClass.values()] });
});

// GET /api/me/student/summary — the logged-in student's own profile + class
router.get('/student/summary', requireRole(Role.STUDENT), async (req: AuthedRequest, res: Response) => {
  const sid = await studentIdForUser(req.user!.sub);
  if (!sid) return res.status(404).json({ error: 'Not found' });
  const student = await prisma.student.findUnique({
    where: { id: sid },
    include: {
      user: { select: { fullName: true, idNumber: true } },
      class: {
        select: {
          id: true, name: true, board: true, stream: true, academicYear: true,
          subjects: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
        },
      },
    },
  });
  res.json({ student });
});

// GET /api/me/parent/wards — the parent's APPROVED wards
router.get('/parent/wards', requireRole(Role.PARENT), async (req: AuthedRequest, res: Response) => {
  const parent = await prisma.user.findUnique({ where: { id: req.user!.sub }, select: { phone: true } });
  if (!parent?.phone) return res.json({ wards: [] });
  // Wards = every student whose parentPhone matches this parent's verified number.
  const wards = await prisma.student.findMany({
    where: { parentPhone: parent.phone },
    orderBy: { admissionDate: 'asc' },
    select: {
      id: true,
      user: { select: { fullName: true, idNumber: true } },
      class: { select: { id: true, name: true, board: true, stream: true, academicYear: true } },
    },
  });
  res.json({ wards });
});

export default router;
