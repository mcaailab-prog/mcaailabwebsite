import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Award } from '@/app/api/models/Award';

export async function GET() {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }

  try {
    const awards = await Award.find().sort({ published_date: -1 });
    return NextResponse.json(JSON.parse(JSON.stringify(awards)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }

  try {
    const body = await request.json();
    const award = new Award(body);
    await award.save();
    return NextResponse.json(JSON.parse(JSON.stringify(award)), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}