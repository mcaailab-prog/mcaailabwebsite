import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { DatasetAccessRequest } from '@/app/api/models/DatasetAccessRequest';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    const params = await context.params;
    const request = await DatasetAccessRequest.findById(params?.id).populate('dataset');

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(request)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Add PUT method for updating request status
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    const params = await context.params;
    const requestObj = await DatasetAccessRequest.findByIdAndUpdate(params?.id, body, { new: true, runValidators: true }).populate('dataset');

    if (!requestObj) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(requestObj)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Add DELETE method for deleting requests
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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
    const params = await context.params;
    const requestObj = await DatasetAccessRequest.findByIdAndDelete(params?.id).populate('dataset');

    if (!requestObj) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}