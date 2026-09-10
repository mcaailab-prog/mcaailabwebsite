import { NextRequest, NextResponse } from 'next/server';
import { getResearchAreas, createResearchArea } from '@/app/api/controllers/researchController';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';

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

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const researchAreas = await getResearchAreasHandler(filter);
    return NextResponse.json(researchAreas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handler functions
async function getResearchAreasHandler(filter: any) {
  const ResearchArea = require('@/app/api/models/ResearchArea').ResearchArea;
  const researchAreas = await ResearchArea.find(filter)
    .sort({ order: 1, title: 1 });
  return JSON.parse(JSON.stringify(researchAreas));
}

async function createResearchAreaHandler(body: any) {
  const ResearchArea = require('@/app/api/models/ResearchArea').ResearchArea;
  const researchArea = new ResearchArea(body);
  await researchArea.save();
  return JSON.parse(JSON.stringify(researchArea));
}