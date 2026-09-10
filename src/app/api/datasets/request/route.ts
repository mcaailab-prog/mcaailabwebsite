import { NextRequest, NextResponse } from 'next/server';
import { getDatasetAccessRequests, createDatasetAccessRequest } from '@/app/api/controllers/datasetAccessRequestController';
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
    const requests = await getDatasetAccessRequestsHandler();
    return NextResponse.json(requests);
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
    const requestObj = await createDatasetAccessRequestHandler(body);
    return NextResponse.json(requestObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Handler functions
async function getDatasetAccessRequestsHandler() {
  const DatasetAccessRequest = require('@/app/api/models/DatasetAccessRequest').DatasetAccessRequest;
  const requests = await DatasetAccessRequest.find()
    .sort({ submittedAt: -1 })
    .populate('dataset');

  return JSON.parse(JSON.stringify(requests));
}

async function createDatasetAccessRequestHandler(body: any) {
  const DatasetAccessRequest = require('@/app/api/models/DatasetAccessRequest').DatasetAccessRequest;
  const request = new DatasetAccessRequest(body);
  await request.save();

  // Populate dataset for return
  await request.populate('dataset');

  return JSON.parse(JSON.stringify(request));
}