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

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDB();
    const { id } = await context.params;
    const user = await AdminUser.findById(id).select('-passwordHash').lean();

    if (!user) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(user)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDB();
    const { id } = await context.params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    if (body.email) update.email = String(body.email).trim().toLowerCase();
    if (body.name) update.name = String(body.name).trim();
    if (typeof body.isActive === 'boolean') update.isActive = body.isActive;
    // A blank/omitted password means "keep the current one" - only hash and
    // write a new passwordHash when a real value was actually submitted.
    if (typeof body.password === 'string' && body.password.length > 0) {
      update.passwordHash = await hashPassword(body.password);
    }

    if (update.email) {
      const existing = await AdminUser.findOne({ email: update.email, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: 'An admin with that email already exists' }, { status: 409 });
      }
    }

    const user = await AdminUser.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');

    if (!user) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(user)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDB();
    const { id } = await context.params;

    const activeCount = await AdminUser.countDocuments({ isActive: { $ne: false } });
    const target = await AdminUser.findById(id);
    if (!target) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    if (target.isActive !== false && activeCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last remaining admin account' },
        { status: 400 },
      );
    }

    await AdminUser.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
