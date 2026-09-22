import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { SiteStat } from '@/app/api/models/SiteStat';

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
    const siteStat = await SiteStat.findById(id);

    if (!siteStat) {
      return NextResponse.json({ error: 'Site stat not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(siteStat)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Add PUT method for updating a site stat
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
    const siteStat = await SiteStat.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!siteStat) {
      return NextResponse.json({ error: 'Site stat not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(siteStat)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Add DELETE method for deleting a site stat
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
    const siteStat = await SiteStat.findByIdAndDelete(id);

    if (!siteStat) {
      return NextResponse.json({ error: 'Site stat not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Site stat deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}