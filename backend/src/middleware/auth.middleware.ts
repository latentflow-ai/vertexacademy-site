import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AUTH_COOKIE, JwtPayload, verifyJwt } from '../lib/auth';

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

function extractToken(req: Request): string | null {
  // Prefer the httpOnly cookie; fall back to a Bearer header for API clients.
  const cookieToken = (req as any).cookies?.[AUTH_COOKIE];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired session' });
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
    }
    next();
  };
}
