// Central API helper. Always sends the auth cookie (credentials: 'include')
// so the httpOnly JWT set by the backend is included on every request.

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    throw new ApiError(data?.message || data?.error || 'Request failed', res.status);
  }

  return data as T;
}
