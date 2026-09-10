import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { ContactSubmission } from '@/app/api/models/ContactSubmission';

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
    const { id } = params;
    const submission = await ContactSubmission.findById(id);

    if (!submission) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(submission)) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// Add PUT method for updating contact submissions (though typically not needed for contact forms)
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // For contact submissions, we typically don't allow updates via API for security reasons
  // But if needed, we can implement it here with proper validation
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

// Add DELETE method for deleting contact submissions
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
    const { id } = params;
    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return NextResponse.json({ error: 'Contact submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}