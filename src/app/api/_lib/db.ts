import { NextResponse } from 'next/server';
import { checkDBConnection, connectDB } from '@/app/api/utils/connectDB';

export async function ensureDb() {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const ok = await connectDB();
    if (!ok) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }
  return null;
}

export function asJson(data: unknown, status = 200) {
  return NextResponse.json(JSON.parse(JSON.stringify(data)), { status });
}
