import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { SiteStat } from '@/app/api/models/SiteStat';

export async function GET() {
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
    const siteStats = await getSiteStatsHandler();
    return NextResponse.json(siteStats);
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
    const siteStat = await createSiteStatHandler(body);
    return NextResponse.json(siteStat, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Handler functions
async function getSiteStatsHandler() {
  const siteStats = await SiteStat.find()
    .sort({ order: 1, label: 1 });

  return JSON.parse(JSON.stringify(siteStats));
}

async function createSiteStatHandler(body: Record<string, unknown>) {
  const siteStat = new SiteStat(body);
  await siteStat.save();
  return JSON.parse(JSON.stringify(siteStat));
}