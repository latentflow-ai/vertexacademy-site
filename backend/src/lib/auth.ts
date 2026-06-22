import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
export const AUTH_COOKIE = 'va_token';

if (!JWT_SECRET) {
  // Fail loudly at startup rather than silently signing with an empty secret.
  console.error('❌ JWT_SECRET is not set. Authentication cannot work securely.');
}

export interface JwtPayload {
  sub: string; // user id
  role: Role;
  email: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// Generate a readable but strong temporary password for newly created
// teacher/student accounts (admin hands it to the user; they reset on login).
export function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  // Guarantee complexity with a fixed special-char + digit suffix.
  return `${out}@${Math.floor(10 + Math.random() * 89)}`;
}
