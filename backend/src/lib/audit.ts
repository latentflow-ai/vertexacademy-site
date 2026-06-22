import { Request } from 'express';
import prisma from './prisma';

// Best-effort audit logging. Never throws — a logging failure must not break
// the request it is recording.
export async function logAudit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  req?: Request;
}): Promise<void> {
  try {
    const ip =
      params.req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      params.req?.socket.remoteAddress ||
      null;

    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        ip,
      },
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}
