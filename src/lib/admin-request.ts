import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken, type AdminSession } from '@/lib/admin-session';

export async function getAdminSession(request: NextRequest): Promise<AdminSession | null> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return {
      session: null as AdminSession | null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { session, error: null };
}
