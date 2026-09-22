import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { News } from '@/app/api/models/News';

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
    const news = await News.findById(id);

    if (!news) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(news)));
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
    const news = await News.findByIdAndUpdate(id, body, { new: true });

    if (!news) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(news)));
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
    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}