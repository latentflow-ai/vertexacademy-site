import { Router, Response } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { generateTempPassword, hashPassword } from '../lib/auth';
import { nextFacultyId, withIdRetry } from '../lib/ids';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Every route here is admin-only.
router.use(requireAuth, requireRole(Role.ADMIN));

// GET /api/faculty — list all faculty with their account info
router.get('/', async (_req: AuthedRequest, res: Response) => {
  const faculty = await prisma.faculty.findMany({
    orderBy: { joinedAt: 'desc' },
    include: {
      user: {
        select: { id: true, email: true, idNumber: true, fullName: true, phone: true, isActive: true, lastLoginAt: true },
      },
      _count: { select: { assignments: true } },
    },
  });
  res.json({ faculty });
});

// Login identifier. Accepts the academy's "name@vertex" convention as well as
// regular email addresses; just requires a non-empty, space-free string.
const loginId = z
  .string()
  .trim()
  .min(3, 'Login must be at least 3 characters')
  .regex(/^\S+$/, 'Login must not contain spaces');

const createSchema = z.object({
  fullName: z.string().min(2),
  email: loginId,
  phone: z.string().optional(),
  employeeId: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

// POST /api/faculty — create a faculty account; returns a one-time temp password
router.post('/', async (req: AuthedRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Invalid request', message: parsed.error.issues[0]?.message || 'Invalid input' });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Conflict', message: 'An account with this email already exists' });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const faculty = await withIdRetry(() => prisma.$transaction(async (tx) => {
    const idNumber = await nextFacultyId(tx);
    return tx.faculty.create({
      data: {
        employeeId: parsed.data.employeeId || undefined,
        subjects: parsed.data.subjects || [],
        user: {
          create: {
            email,
            idNumber,
            fullName: parsed.data.fullName,
            phone: parsed.data.phone || undefined,
            passwordHash,
            role: Role.FACULTY,
            mustChangePassword: true,
          },
        },
      },
      include: { user: { select: { id: true, email: true, idNumber: true, fullName: true, phone: true } } },
    });
  }));

  await logAudit({ userId: req.user!.sub, action: 'FACULTY_CREATED', entity: 'Faculty', entityId: faculty.id, req });

  res.status(201).json({ faculty, tempPassword, loginId: faculty.user.idNumber });
});

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  employeeId: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// PATCH /api/faculty/:id — update profile or activate/deactivate the account
router.patch('/:id', async (req: AuthedRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', message: 'Invalid input' });
  }

  const faculty = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const { fullName, phone, isActive, ...facultyFields } = parsed.data;

  const updated = await prisma.faculty.update({
    where: { id: faculty.id },
    data: {
      employeeId: facultyFields.employeeId,
      subjects: facultyFields.subjects,
      user: {
        update: {
          ...(fullName !== undefined ? { fullName } : {}),
          ...(phone !== undefined ? { phone } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      },
    },
    include: {
      user: { select: { id: true, email: true, idNumber: true, fullName: true, phone: true, isActive: true } },
    },
  });

  await logAudit({ userId: req.user!.sub, action: 'FACULTY_UPDATED', entity: 'Faculty', entityId: faculty.id, req });
  res.json({ faculty: updated });
});

// POST /api/faculty/:id/reset-password — issue a new one-time temp password
router.post('/:id/reset-password', async (req: AuthedRequest, res: Response) => {
  const faculty = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);
  await prisma.user.update({
    where: { id: faculty.userId },
    data: { passwordHash, mustChangePassword: true },
  });

  await logAudit({ userId: req.user!.sub, action: 'FACULTY_PASSWORD_RESET', entity: 'Faculty', entityId: faculty.id, req });
  res.json({ tempPassword });
});

// DELETE /api/faculty/:id — permanently remove the faculty and their account
router.delete('/:id', async (req: AuthedRequest, res: Response) => {
  const faculty = await prisma.faculty.findUnique({ where: { id: req.params.id } });
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  // Deleting the user cascades to the Faculty row.
  await prisma.user.delete({ where: { id: faculty.userId } });

  await logAudit({ userId: req.user!.sub, action: 'FACULTY_DELETED', entity: 'Faculty', entityId: faculty.id, req });
  res.json({ success: true });
});

export default router;
