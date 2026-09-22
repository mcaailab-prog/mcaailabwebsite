import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { QuarterlyReport } from '@/app/api/models/QuarterlyReport';

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
    const quarter = searchParams.get('quarter');

    const filter: Record<string, unknown> = {};

    if (year) filter.year = parseInt(year);
    if (quarter) filter.quarter = parseInt(quarter);

    const reports = await getReportsHandler(filter);
    return NextResponse.json(reports);
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
    const rpt = await createReportHandler(body);
    return NextResponse.json(rpt, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function getReportsHandler(filter: Record<string, unknown>) {
  const docs = await QuarterlyReport.find(filter).sort({ year: -1, quarter: -1 });
  return JSON.parse(JSON.stringify(docs));
}

async function createReportHandler(body: Record<string, unknown>) {
  const rpt = new QuarterlyReport(body);
  await rpt.save();
  return JSON.parse(JSON.stringify(rpt));
}