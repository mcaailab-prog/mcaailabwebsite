import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, createSessionToken, findAdminUser } from '@/lib/admin-session';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '');
    const password = String(body.password || '');
    const user = findAdminUser(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSessionToken({ email: user.email, name: user.name });
    const response = NextResponse.json({ email: user.email, name: user.name });
    response.cookies.set(ADMIN_COOKIE, token, cookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 400 },
    );
  }
}
