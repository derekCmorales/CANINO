import { getToken, clearAuth } from '@/lib/auth';
import type { ApiResponse } from '@/types';

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function resolveFileUrl(urlOrFilename: string | null | undefined): string {
  if (!urlOrFilename) return '/placeholder-dog.svg';
  if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://')) {
    return urlOrFilename;
  }
  if (urlOrFilename.startsWith('/uploads/')) {
    const filename = urlOrFilename.split('/').pop()!;
    return `${API_BASE}/files/${filename}`;
  }
  if (urlOrFilename.startsWith('/')) {
    return `${API_BASE.replace('/api/v1', '')}${urlOrFilename}`;
  }
  return `${API_BASE}/files/${urlOrFilename}`;
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    credentials: 'include',
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Sesión expirada', 401);
  }

  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('Error en la solicitud', res.status);
    }
    return undefined as T;
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.error ?? 'Error desconocido', res.status);
  }

  return json.data as T;
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const result = await apiFetch<{ filename: string; path: string }>('/files/upload', {
    method: 'POST',
    body: formData,
  });

  return result.path;
}
