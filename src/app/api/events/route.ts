import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';

export async function GET(request: NextRequest) {
  const isConnected = await checkDBConnection();
  if (!isConnected) {
    const connectSuccess = await connectDB();
    if (!connectSuccess) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
  }

  try {
    const url = new URL(request.url, `http://${request.headers.get('host')}`);
    const when = url.searchParams.get('when'); // upcoming|past|featured|all
    const filter: any = {};
    const now = new Date();
    if (when === 'upcoming') {
      filter.start_date = { $gte: now };
    } else if (when === 'past') {
      filter.end_date = { $lt: now };
    } else if (when === 'featured') {
      // Support either a dedicated 'featured' status or the boolean flag `is_featured`.
      filter.$or = [{ status: 'featured' }, { is_featured: true }];
    }

    const Event = require('@/app/api/models/Event').Event;
    const events = await Event.find(filter).sort({ start_date: 1 });
    return NextResponse.json(JSON.parse(JSON.stringify(events)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    if (!body.category) body.category = 'event';
    const Event = require('@/app/api/models/Event').Event;
    const ev = new Event(body);
    await ev.save();

    return NextResponse.json(JSON.parse(JSON.stringify(ev)), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}