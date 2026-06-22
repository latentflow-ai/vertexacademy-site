import { Router, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';
import { facultyIdForUser, facultyTeachesClass, studentIdForUser } from '../lib/access';

const router = Router();
router.use(requireAuth);

// Can the current user view this class's timetable?
async function canViewClass(user: { sub: string; role: string }, classId: string): Promise<boolean> {
  if (user.role === 'ADMIN') return true;
  if (user.role === 'FACULTY') {
    const fid = await facultyIdForUser(user.sub);
    return !!fid && facultyTeachesClass(fid, classId);
  }
  if (user.role === 'STUDENT') {
    const sid = await studentIdForUser(user.sub);
    if (!sid) return false;
    const s = await prisma.student.findUnique({ where: { id: sid }, select: { classId: true } });
    return s?.classId === classId;
  }
  if (user.role === 'PARENT') {
    const parent = await prisma.user.findUnique({ where: { id: user.sub }, select: { phone: true } });
    if (!parent?.phone) return false;
    const ward = await prisma.student.findFirst({ where: { parentPhone: parent.phone, classId } });
    return !!ward;
  }
  return false;
}

// GET /api/timetable?classId= — weekly slots for a class (all roles, scoped)
router.get('/', async (req: AuthedRequest, res: Response) => {
  const classId = String(req.query.classId || '');
  if (!classId) return res.status(400).json({ error: 'Invalid request', message: 'classId is required' });
  if (!(await canViewClass(req.user!, classId))) return res.status(403).json({ error: 'Forbidden' });

  const slots = await prisma.timetableSlot.findMany({
    where: { classId },
    orderBy: [{ dayOfWeek: 'asc' }, { period: 'asc' }],
    include: {
      subject: { select: { name: true } },
      faculty: { select: { user: { select: { fullName: true } } } },
    },
  });
  res.json({ slots });
});

const slotSchema = z.object({
  classId: z.string().min(1),
  dayOfWeek: z.number().int().min(1).max(7),
  period: z.number().int().min(1).max(12),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  subjectId: z.string().optional().nullable(),
  facultyId: z.string().optional().nullable(),
});

// POST /api/timetable — admin creates/updates a slot (unique class+day+period)
router.post('/', requireRole(Role.ADMIN), async (req: AuthedRequest, res: Response) => {
  const parsed = slotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request', message: 'Invalid input' });
  const d = parsed.data;
  const slot = await prisma.timetableSlot.upsert({
    where: { classId_dayOfWeek_period: { classId: d.classId, dayOfWeek: d.dayOfWeek, period: d.period } },
    create: {
      classId: d.classId,
      dayOfWeek: d.dayOfWeek,
      period: d.period,
      startTime: d.startTime,
      endTime: d.endTime,
      subjectId: d.subjectId || null,
      facultyId: d.facultyId || null,
    },
    update: { startTime: d.startTime, endTime: d.endTime, subjectId: d.subjectId || null, facultyId: d.facultyId || null },
  });
  await logAudit({ userId: req.user!.sub, action: 'TIMETABLE_UPDATED', entity: 'Class', entityId: d.classId, req });
  res.json({ slot });
});

// DELETE /api/timetable/:id — admin removes a slot
router.delete('/:id', requireRole(Role.ADMIN), async (req: AuthedRequest, res: Response) => {
  const slot = await prisma.timetableSlot.findUnique({ where: { id: req.params.id } });
  if (!slot) return res.status(404).json({ error: 'Not found' });
  await prisma.timetableSlot.delete({ where: { id: slot.id } });
  res.json({ success: true });
});

export default router;
