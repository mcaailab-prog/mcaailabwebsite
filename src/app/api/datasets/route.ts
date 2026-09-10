import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Dataset } from '@/app/api/models/Dataset';

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
    const language = searchParams.get('language');
    const requires_request = searchParams.get('requires_request');

    const filter: { language?: string; requires_request?: boolean } = {};

    if (language) filter.language = language;
    if (requires_request !== null) filter.requires_request = requires_request === 'true';

    const datasets = await Dataset.find(filter)
      .sort({ name: 1 })
      .populate('associated_project');

    return NextResponse.json(JSON.parse(JSON.stringify(datasets)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
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
    const dataset = new Dataset(body);
    await dataset.save();
    await dataset.populate('associated_project');
    return NextResponse.json(JSON.parse(JSON.stringify(dataset)), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}