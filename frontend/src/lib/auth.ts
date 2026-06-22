import { apiFetch } from './api';

export type Role = 'ADMIN' | 'FACULTY' | 'STUDENT' | 'PARENT';

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  mustChangePassword: boolean;
}

export const LOGIN_PATHS: Record<Role, string> = {
  ADMIN: '/admin',
  FACULTY: '/facultylogin',
  STUDENT: '/studentlogin',
  PARENT: '/parentlogin',
};

export const DASHBOARD_PATHS: Record<Role, string> = {
  ADMIN: '/admin/dashboard',
  FACULTY: '/faculty/dashboard',
  STUDENT: '/student/dashboard',
  PARENT: '/parent/dashboard',
};

export async function login(username: string, password: string): Promise<CurrentUser> {
  const data = await apiFetch<{ user: CurrentUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return data.user;
}

export async function fetchMe(): Promise<CurrentUser> {
  const data = await apiFetch<{ user: CurrentUser }>('/auth/me');
  return data.user;
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST' });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ---- Parent OTP login -------------------------------------------------------

export async function requestParentOtp(phone: string): Promise<{ message: string; devCode?: string }> {
  return apiFetch('/auth/parent/request-otp', { method: 'POST', body: JSON.stringify({ phone }) });
}

export async function verifyParentOtp(phone: string, code: string): Promise<CurrentUser> {
  const data = await apiFetch<{ user: CurrentUser }>('/auth/parent/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
  return data.user;
}
