import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { AdminUser } from '@/app/api/models/AdminUser';
import { hashPassword } from '@/lib/admin-session';

async function ensureDB() {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      throw new Error('Database connection failed');
    }
  }
}

export async function GET() {
  try {
    await ensureDB();
    const users = await AdminUser.find().select('-passwordHash').sort({ createdAt: 1 }).lean();
    return NextResponse.json(JSON.parse(JSON.stringify(users)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const password = String(body.password || '');

    if (!email || !name || !password) {
      return NextResponse.json({ error: 'Name, email and password are all required' }, { status: 400 });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'An admin with that email already exists' }, { status: 409 });
    }

    const user = await AdminUser.create({
      email,
      name,
      passwordHash: await hashPassword(password),
      isActive: true,
    });

    const plain = JSON.parse(JSON.stringify(user));
    delete plain.passwordHash;
    return NextResponse.json(plain, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
