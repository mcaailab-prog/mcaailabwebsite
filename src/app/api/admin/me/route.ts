import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-request';

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ email: session.email, name: session.name });
}
