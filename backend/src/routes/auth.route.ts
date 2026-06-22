import crypto from 'crypto';
import { Router, Request, Response, CookieOptions } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';
import { normalizePhone, isValidPhone } from '../lib/phone';
import { sendOtp } from '../lib/sms';
import {
  AUTH_COOKIE,
  hashPassword,
  signJwt,
  verifyPassword,
} from '../lib/auth';
import { logAudit } from '../lib/audit';
import { AuthedRequest, requireAuth } from '../middleware/auth.middleware';

const router = Router();

const isProd = process.env.NODE_ENV === 'production';
function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
    path: '/',
  };
}

// Throttle login attempts to slow down brute-force / credential stuffing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts', message: 'Too many login attempts. Try again later.' },
});

const loginSchema = z.object({
  // The login form labels this "username"; we treat it as the account email.
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request', message: 'Username and password are required' });
  }

  const identifier = parsed.data.username.trim();
  const { password } = parsed.data;

  // Accept either an email (case-insensitive) or an institutional ID
  // (e.g. VA-FAC-0001, stored uppercase).
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier.toLowerCase() }, { idNumber: identifier.toUpperCase() }],
    },
  });

  // Generic error to avoid leaking which accounts exist.
  const invalid = () =>
    res.status(401).json({ error: 'Invalid credentials', message: 'Username or password is incorrect' });

  if (!user || !user.isActive) return invalid();

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    await logAudit({ userId: user.id, action: 'LOGIN_FAILED', entity: 'User', entityId: user.id, req });
    return invalid();
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const token = signJwt({ sub: user.id, role: user.role, email: user.email });
  res.cookie(AUTH_COOKIE, token, cookieOptions());

  await logAudit({ userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, req });

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    },
  });
});

router.post('/logout', (req: AuthedRequest, res: Response) => {
  res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ success: true });
});

router.get('/me', requireAuth, async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      mustChangePassword: true,
      isActive: true,
    },
  });
  if (!user || !user.isActive) {
    res.clearCookie(AUTH_COOKIE, { ...cookieOptions(), maxAge: undefined });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ user });
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

router.post('/change-password', requireAuth, async (req: AuthedRequest, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Invalid request', message: parsed.error.issues[0]?.message || 'Invalid input' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ error: 'Invalid password', message: 'Current password is incorrect' });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, mustChangePassword: false },
  });

  await logAudit({ userId: user.id, action: 'PASSWORD_CHANGED', entity: 'User', entityId: user.id, req });

  res.json({ success: true });
});

// ---- Parent OTP login -------------------------------------------------------
// Parents authenticate with their phone number + a 6-digit OTP. The OTP proves
// they own the number; they then see EVERY student whose parentPhone matches.
// No signup, no password, no admin approval.

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', message: 'Too many OTP requests. Please try again later.' },
});
const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts', message: 'Too many attempts. Please try again later.' },
});

// POST /auth/parent/request-otp — send a code if some student has this number
router.post('/parent/request-otp', otpRequestLimiter, async (req: Request, res: Response) => {
  const phone = normalizePhone(String(req.body?.phone || ''));
  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: 'Invalid request', message: 'Enter a valid 10-digit phone number' });
  }

  const generic: any = { success: true, message: 'If your number is registered, an OTP has been sent.' };

  // Only issue a code if at least one student carries this parent phone.
  const match = await prisma.student.findFirst({ where: { parentPhone: phone }, select: { id: true } });
  if (!match) return res.json(generic);

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  const codeHash = await hashPassword(code);
  await prisma.otpChallenge.create({
    data: { phone, codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
  });

  const result = await sendOtp(phone, code);
  await logAudit({ action: 'PARENT_OTP_REQUESTED', entity: 'Otp', entityId: phone, req });
  if (result.devCode) generic.devCode = result.devCode; // dev-only convenience
  res.json(generic);
});

// POST /auth/parent/verify-otp — verify code, then log the parent in
router.post('/parent/verify-otp', otpVerifyLimiter, async (req: Request, res: Response) => {
  const phone = normalizePhone(String(req.body?.phone || ''));
  const code = String(req.body?.code || '').trim();
  if (!isValidPhone(phone) || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid request', message: 'Enter the 6-digit code sent to your phone' });
  }

  const challenge = await prisma.otpChallenge.findFirst({
    where: { phone, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  const invalid = () => res.status(400).json({ error: 'Invalid code', message: 'The code is incorrect or has expired.' });
  if (!challenge) return invalid();
  if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true } });
    return invalid();
  }

  const ok = await verifyPassword(code, challenge.codeHash);
  if (!ok) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    return invalid();
  }
  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true } });

  // Must still have at least one matching ward.
  const wardCount = await prisma.student.count({ where: { parentPhone: phone } });
  if (wardCount === 0) {
    return res.status(404).json({ error: 'No wards', message: 'No students are linked to this number.' });
  }

  // Upsert a lightweight PARENT user keyed by phone (random unused password).
  const email = `parent-${phone}@parent.vertex`;
  const randomHash = await hashPassword(crypto.randomBytes(16).toString('hex'));
  const user = await prisma.user.upsert({
    where: { email },
    update: { isActive: true, lastLoginAt: new Date(), phone },
    create: { email, fullName: `Parent ••${phone.slice(-4)}`, phone, passwordHash: randomHash, role: Role.PARENT },
  });

  const token = signJwt({ sub: user.id, role: user.role, email: user.email });
  res.cookie(AUTH_COOKIE, token, cookieOptions());
  await logAudit({ userId: user.id, action: 'PARENT_LOGIN', entity: 'User', entityId: user.id, req });

  res.json({
    success: true,
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, mustChangePassword: false },
  });
});

export default router;
