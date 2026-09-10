import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';

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
    const ResearchArea = require('@/app/api/models/ResearchArea').ResearchArea;
    const params = await context.params;
    const { id } = params;
    const researchArea = await ResearchArea.findById(id);

    if (!researchArea) {
      return NextResponse.json({ error: 'Research area not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(researchArea)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Add PUT method for updating research areas
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
    const ResearchArea = require('@/app/api/models/ResearchArea').ResearchArea;
    const params = await context.params;
    const { id } = params;
    const researchArea = await ResearchArea.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!researchArea) {
      return NextResponse.json({ error: 'Research area not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(researchArea)));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Add DELETE method for deleting research areas
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
    const ResearchArea = require('@/app/api/models/ResearchArea').ResearchArea;
    const params = await context.params;
    const { id } = params;
    const researchArea = await ResearchArea.findByIdAndDelete(id);

    if (!researchArea) {
      return NextResponse.json({ error: 'Research area not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}