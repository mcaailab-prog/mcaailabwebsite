import { NextRequest, NextResponse } from 'next/server';
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
    const year = searchParams.get('year');
    const quarter = searchParams.get('quarter');

    const filter: any = {};

    if (year) filter.year = parseInt(year);
    if (quarter) filter.quarter = parseInt(quarter);

    const reports = await getReportsHandler(filter);
    return NextResponse.json(reports);
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
    const rpt = await createReportHandler(body);
    return NextResponse.json(rpt, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function getReportsHandler(filter: any) {
  const QuarterlyReport = require('@/app/api/models/QuarterlyReport').QuarterlyReport;
  const docs = await QuarterlyReport.find(filter).sort({ year: -1, quarter: -1 });
  return JSON.parse(JSON.stringify(docs));
}

async function createReportHandler(body: any) {
  const QuarterlyReport = require('@/app/api/models/QuarterlyReport').QuarterlyReport;
  const rpt = new QuarterlyReport(body);
  await rpt.save();
  return JSON.parse(JSON.stringify(rpt));
}