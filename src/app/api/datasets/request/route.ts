import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { DatasetAccessRequest } from '@/app/api/models/DatasetAccessRequest';

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
    const requests = await getDatasetAccessRequestsHandler();
    return NextResponse.json(requests);
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
    const requestObj = await createDatasetAccessRequestHandler(body);
    return NextResponse.json(requestObj, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Handler functions
async function getDatasetAccessRequestsHandler() {
  const requests = await DatasetAccessRequest.find()
    .sort({ submittedAt: -1 })
    .populate('dataset');

  return JSON.parse(JSON.stringify(requests));
}

async function createDatasetAccessRequestHandler(body: Record<string, unknown>) {
  const request = new DatasetAccessRequest(body);
  await request.save();

  // Populate dataset for return
  await request.populate('dataset');

  return JSON.parse(JSON.stringify(request));
}