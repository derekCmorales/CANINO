import type { User, UserRole, AdminSubtype } from '@/types';

const TOKEN_KEY = 'pc_access_token';
const ROLE_KEY = 'pc_role';
const ADMIN_SUBTYPE_KEY = 'pc_admin_subtype';
const AUTH_COOKIE = 'pc_auth';
const ROLE_COOKIE = 'pc_role';
const ADMIN_SUBTYPE_COOKIE = 'pc_admin_subtype';

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(accessToken: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(ROLE_KEY, user.role);
  if (user.adminSubtype) {
    localStorage.setItem(ADMIN_SUBTYPE_KEY, user.adminSubtype);
  } else {
    localStorage.removeItem(ADMIN_SUBTYPE_KEY);
  }
  setCookie(AUTH_COOKIE, '1');
  setCookie(ROLE_COOKIE, user.role);
  if (user.adminSubtype) {
    setCookie(ADMIN_SUBTYPE_COOKIE, user.adminSubtype);
  } else {
    deleteCookie(ADMIN_SUBTYPE_COOKIE);
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(ADMIN_SUBTYPE_KEY);
  deleteCookie(AUTH_COOKIE);
  deleteCookie(ROLE_COOKIE);
  deleteCookie(ADMIN_SUBTYPE_COOKIE);
}

export function getStoredRole(): UserRole | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ROLE_KEY) as UserRole | null;
}

export function getStoredAdminSubtype(): AdminSubtype | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_SUBTYPE_KEY) as AdminSubtype | null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getDashboardPath(role: UserRole, adminSubtype?: AdminSubtype | null): string {
  switch (role) {
    case 'veterinarian':
      return '/vet';
    case 'admin':
      if (adminSubtype === 'catalog_manager') return '/admin/catalogs';
      if (adminSubtype === 'operations') return '/admin/users';
      return '/admin/overview';
    default:
      return '/dashboard';
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as User;
    }
    clearAuth();
    return null;
  } catch {
    return null;
  }
}
