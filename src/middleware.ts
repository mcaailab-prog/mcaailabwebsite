import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session';

const PUBLIC_API_POST = new Set([
  '/api/admin/login',
  '/api/contact',
  '/api/datasets/request',
  '/api/careers/apply',
]);

const ADMIN_ONLY_GET_PREFIXES = [
  '/api/contact',
  '/api/datasets/request',
  '/api/careers/applications',
  '/api/admin/',
];

function isAdminOnlyGet(pathname: string) {
  if (pathname === '/api/admin/login') return false;
  return ADMIN_ONLY_GET_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();
  const session = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }
    if (!session) {
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

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
