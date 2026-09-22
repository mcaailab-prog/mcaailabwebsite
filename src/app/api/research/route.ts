import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { ResearchArea } from '@/app/api/models/ResearchArea';

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
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const researchAreas = await getResearchAreasHandler(filter);
    return NextResponse.json(researchAreas);
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
    const researchArea = await createResearchAreaHandler(body);
    return NextResponse.json(researchArea, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Handler functions
async function getResearchAreasHandler(filter: Record<string, unknown>) {
  const researchAreas = await ResearchArea.find(filter)
    .sort({ order: 1, title: 1 });
  return JSON.parse(JSON.stringify(researchAreas));
}

async function createResearchAreaHandler(body: Record<string, unknown>) {
  const researchArea = new ResearchArea(body);
  await researchArea.save();
  return JSON.parse(JSON.stringify(researchArea));
}