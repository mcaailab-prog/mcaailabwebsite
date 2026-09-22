import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Publication } from '@/app/api/models/Publication';

export async function GET(request: NextRequest) {
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
    const url = new URL(request.url, `http://${request.headers.get('host')}`);
    const searchParams = url.searchParams;
    const year = searchParams.get('year');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = {};

    if (year && !isNaN(parseInt(year))) filter.year = parseInt(year);
    if (search && search.trim() !== '') filter.$text = { $search: search };

    const publications = await Publication.find(filter)
      .sort({ year: -1, createdAt: -1 })
      .populate('research_areas')
      .populate('projects');

    return NextResponse.json(JSON.parse(JSON.stringify(publications)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
    const publication = new Publication(body);
    await publication.save();
    await publication.populate('research_areas');
    await publication.populate('projects');
    return NextResponse.json(JSON.parse(JSON.stringify(publication)), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}