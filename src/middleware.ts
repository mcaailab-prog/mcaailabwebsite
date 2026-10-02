import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-session';

const PUBLIC_API_POST = new Set([
  '/api/admin/login',
  '/api/contact',
  '/api/newsletter',
  '/api/datasets/request',
  '/api/careers/apply',
]);

const ADMIN_ONLY_GET_PREFIXES = [
  '/api/contact',
  '/api/newsletter',
  '/api/datasets/request',
  '/api/careers/applications',
  '/api/admin/',
  '/api/admin-users',
];

function isAdminOnlyGet(pathname: string) {
  if (pathname === '/api/admin/login') return false;
  return ADMIN_ONLY_GET_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();
  const hasSessionCookie = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (hasSessionCookie) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }
    if (!hasSessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const isWrite = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  const needsAuth = (isWrite && !PUBLIC_API_POST.has(pathname)) || (method === 'GET' && isAdminOnlyGet(pathname));

  if (!needsAuth) {
    return NextResponse.next();
  }

  if (!hasSessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
