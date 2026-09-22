import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { TeamMember } from '@/app/api/models/TeamMember';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Check database connection
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
  }

  try {
    const params = await context.params;
    const { id } = params;
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return NextResponse.json({ error: 'Team Member not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(teamMember)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Check database connection
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
  }

  try {
    const body = await request.json();
    const params = await context.params;
    const { id } = params;
    const teamMember = await TeamMember.findByIdAndUpdate(id, body, { new: true });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team Member not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(teamMember)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Check database connection
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
  }

  try {
    const params = await context.params;
    const { id } = params;
    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return NextResponse.json({ error: 'Team Member not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Team Member deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}