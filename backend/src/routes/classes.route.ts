import { Router, Response } from 'express';
import { z } from 'zod';
import { BoardOfEducation, Role, Stream } from '@prisma/client';
import prisma from '../lib/prisma';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth, requireRole(Role.ADMIN));

const classInclude = {
  classTeacher: { select: { id: true, user: { select: { fullName: true } } } },
  subjects: {
    orderBy: { name: 'asc' as const },
    include: {
      assignments: {
        include: { faculty: { select: { id: true, user: { select: { fullName: true } } } } },
      },
    },
  },
  _count: { select: { students: true } },
};

// GET /api/classes — classes with board/stream, subjects + their faculty, counts
router.get('/', async (_req: AuthedRequest, res: Response) => {
  const classes = await prisma.class.findMany({
    orderBy: [{ academicYear: 'desc' }, { name: 'asc' }],
    include: classInclude,
  });
  res.json({ classes });
});

const subjectRow = z.object({ name: z.string().min(1), facultyId: z.string().min(1) });

const createSchema = z.object({
  name: z.string().min(1),
  board: z.nativeEnum(BoardOfEducation),
  stream: z.nativeEnum(Stream).optional().nullable(),
  academicYear: z.string().min(4),
  classTeacherFacultyId: z.string().optional().nullable(),
  subjects: z.array(subjectRow).min(1, 'Add at least one subject with a faculty'),
});

// POST /api/classes — create class + subjects + auto faculty assignments
router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', message: parsed.error.issues[0]?.message || 'Invalid input' });
  }
  const d = parsed.data;
  const stream = d.stream ?? null;

  // App-level uniqueness (name + board + stream + year).
  const dup = await prisma.class.findFirst({
    where: { name: d.name, board: d.board, stream, academicYear: d.academicYear },
  });
  if (dup) return res.status(409).json({ error: 'Conflict', message: 'That class already exists for this board/stream/year' });

  // Validate referenced faculty exist.
  const facultyIds = Array.from(new Set([...d.subjects.map((s) => s.facultyId), ...(d.classTeacherFacultyId ? [d.classTeacherFacultyId] : [])]));
  const found = await prisma.faculty.findMany({ where: { id: { in: facultyIds } }, select: { id: true } });
  if (found.length !== facultyIds.length) {
    return res.status(400).json({ error: 'Invalid request', message: 'One or more selected faculty no longer exist' });
  }

  const created = await prisma.$transaction(async (tx) => {
    const cls = await tx.class.create({
      data: {
        name: d.name,
        board: d.board,
        stream,
        academicYear: d.academicYear,
        classTeacherId: d.classTeacherFacultyId || null,
      },
    });
    // Each subject → a Subject row + a FacultyAssignment linking its faculty.
    for (const s of d.subjects) {
      const subject = await tx.subject.create({ data: { name: s.name.trim(), classId: cls.id } });
      await tx.facultyAssignment.create({
        data: {
          facultyId: s.facultyId,
          classId: cls.id,
          subjectId: subject.id,
          isClassTeacher: s.facultyId === d.classTeacherFacultyId,
        },
      });
    }
    return tx.class.findUnique({ where: { id: cls.id }, include: classInclude });
  });

  await logAudit({ userId: req.user!.sub, action: 'CLASS_CREATED', entity: 'Class', entityId: created!.id, req });
  res.status(201).json({ class: created });
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  board: z.nativeEnum(BoardOfEducation).optional(),
  stream: z.nativeEnum(Stream).optional().nullable(),
  academicYear: z.string().min(4).optional(),
  classTeacherFacultyId: z.string().optional().nullable(),
  addSubjects: z.array(subjectRow).optional(),
  // Rename a subject and/or reassign its faculty.
  updateSubjects: z
    .array(z.object({ subjectId: z.string().min(1), name: z.string().min(1).optional(), facultyId: z.string().min(1).optional() }))
    .optional(),
  // Delete subjects (cascades the subject's marks/attendance/assignment/timetable/notes).
  removeSubjectIds: z.array(z.string()).optional(),
});

// PATCH /api/classes/:id — edit details / class teacher / add, edit, remove subjects
router.patch('/:id', async (req: AuthedRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', message: 'Invalid input' });
  const d = parsed.data;

  const cls = await prisma.class.findUnique({ where: { id: req.params.id } });
  if (!cls) return res.status(404).json({ error: 'Not found' });

  // Validate every referenced faculty exists.
  const facultyIds = Array.from(
    new Set([
      ...(d.addSubjects || []).map((s) => s.facultyId),
      ...(d.updateSubjects || []).map((s) => s.facultyId).filter(Boolean) as string[],
      ...(d.classTeacherFacultyId ? [d.classTeacherFacultyId] : []),
    ])
  );
  if (facultyIds.length) {
    const found = await prisma.faculty.findMany({ where: { id: { in: facultyIds } }, select: { id: true } });
    if (found.length !== facultyIds.length) {
      return res.status(400).json({ error: 'Invalid request', message: 'One or more selected faculty no longer exist' });
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.class.update({
      where: { id: cls.id },
      data: {
        ...(d.name !== undefined ? { name: d.name } : {}),
        ...(d.board !== undefined ? { board: d.board } : {}),
        ...(d.stream !== undefined ? { stream: d.stream } : {}),
        ...(d.academicYear !== undefined ? { academicYear: d.academicYear } : {}),
        ...(d.classTeacherFacultyId !== undefined ? { classTeacherId: d.classTeacherFacultyId || null } : {}),
      },
    });

    // Remove subjects (only those belonging to this class).
    if (d.removeSubjectIds?.length) {
      await tx.subject.deleteMany({ where: { id: { in: d.removeSubjectIds }, classId: cls.id } });
    }

    // Rename / reassign existing subjects.
    for (const u of d.updateSubjects || []) {
      const subject = await tx.subject.findFirst({ where: { id: u.subjectId, classId: cls.id } });
      if (!subject) continue;
      if (u.name !== undefined) {
        await tx.subject.update({ where: { id: subject.id }, data: { name: u.name.trim() } });
      }
      if (u.facultyId) {
        const existing = await tx.facultyAssignment.findFirst({ where: { classId: cls.id, subjectId: subject.id } });
        if (existing) {
          if (existing.facultyId !== u.facultyId) {
            await tx.facultyAssignment.update({ where: { id: existing.id }, data: { facultyId: u.facultyId } });
          }
        } else {
          await tx.facultyAssignment.create({ data: { facultyId: u.facultyId, classId: cls.id, subjectId: subject.id } });
        }
      }
    }

    // Add new subjects with their faculty.
    for (const s of d.addSubjects || []) {
      const subject = await tx.subject.create({ data: { name: s.name.trim(), classId: cls.id } });
      await tx.facultyAssignment.create({
        data: { facultyId: s.facultyId, classId: cls.id, subjectId: subject.id },
      });
    }
    return tx.class.findUnique({ where: { id: cls.id }, include: classInclude });
  });

  await logAudit({ userId: req.user!.sub, action: 'CLASS_UPDATED', entity: 'Class', entityId: cls.id, req });
  res.json({ class: updated });
});

// DELETE /api/classes/:id — remove a class (students detached, not deleted)
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const cls = await prisma.class.findUnique({ where: { id: req.params.id } });
  if (!cls) return res.status(404).json({ error: 'Not found' });
  await prisma.class.delete({ where: { id: cls.id } });
  await logAudit({ userId: req.user!.sub, action: 'CLASS_DELETED', entity: 'Class', entityId: cls.id, req });
  res.json({ success: true });
});

export default router;
