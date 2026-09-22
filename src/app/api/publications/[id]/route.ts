import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Publication } from '@/app/api/models/Publication';

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
    const publication = await Publication.findById(id)
      .populate('research_areas')
      .populate('projects');

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(publication)));
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
    const publication = await Publication.findByIdAndUpdate(id, body, { new: true, runValidators: true })
      .populate('research_areas')
      .populate('projects');

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(publication)));
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
    const publication = await Publication.findByIdAndDelete(id)
      .populate('research_areas')
      .populate('projects');

    if (!publication) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Publication deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}