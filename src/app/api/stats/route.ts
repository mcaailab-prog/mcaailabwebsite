import { NextRequest, NextResponse } from 'next/server';
import { getSiteStats, createSiteStat } from '@/app/api/controllers/siteStatController';
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
    const siteStats = await getSiteStatsHandler();
    return NextResponse.json(siteStats);
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
    const siteStat = await createSiteStatHandler(body);
    return NextResponse.json(siteStat, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handler functions
async function getSiteStatsHandler() {
  const SiteStat = require('@/app/api/models/SiteStat').SiteStat;
  const siteStats = await SiteStat.find()
    .sort({ order: 1, label: 1 });

  return JSON.parse(JSON.stringify(siteStats));
}

async function createSiteStatHandler(body: any) {
  const SiteStat = require('@/app/api/models/SiteStat').SiteStat;
  const siteStat = new SiteStat(body);
  await siteStat.save();
  return JSON.parse(JSON.stringify(siteStat));
}