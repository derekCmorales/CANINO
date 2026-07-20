import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/register'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p);
}

function getRoleHome(role: string, adminSubtype?: string): string {
  if (role === 'veterinarian') return '/vet';
  if (role === 'admin') {
    if (adminSubtype === 'catalog_manager') return '/admin/catalogs';
    if (adminSubtype === 'operations') return '/admin/users';
    return '/admin/overview';
  }
  return '/dashboard';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('pc_auth')?.value === '1';
  const role = request.cookies.get('pc_role')?.value;
  const adminSubtype = request.cookies.get('pc_admin_subtype')?.value;

  if (isPublicPath(pathname)) {
    if (isAuthenticated && role && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL(getRoleHome(role, adminSubtype), request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const ownerRoutes =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/dogs') ||
    pathname.startsWith('/notifications');

  const vetRoutes = pathname.startsWith('/vet');
  const adminRoutes = pathname.startsWith('/admin');

  if (ownerRoutes && role !== 'owner') {
    return NextResponse.redirect(new URL(getRoleHome(role ?? 'owner', adminSubtype), request.url));
  }

  if (vetRoutes && role !== 'veterinarian' && role !== 'admin') {
    return NextResponse.redirect(new URL(getRoleHome(role ?? 'owner', adminSubtype), request.url));
  }

  if (adminRoutes && role !== 'admin') {
    return NextResponse.redirect(new URL(getRoleHome(role ?? 'owner', adminSubtype), request.url));
  }

  if (pathname === '/admin') {
    return NextResponse.redirect(new URL(getRoleHome('admin', adminSubtype), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
