import { Router, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { AuthedRequest, requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();
router.use(requireAuth, requireRole(Role.ADMIN));

// GET /api/audit?limit= — recent audit-log entries with the acting user
router.get('/', async (req: AuthedRequest, res: Response) => {
  const limit = Math.min(parseInt(String(req.query.limit || '100'), 10) || 100, 500);
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { fullName: true, email: true, role: true } } },
  });
  res.json({ logs });
});

export default router;
