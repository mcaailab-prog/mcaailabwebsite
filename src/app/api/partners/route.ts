import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Partner } from '@/app/api/models/Partner';

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
    const partner_type = searchParams.get('partner_type');

    const filter: Record<string, unknown> = {};
    if (partner_type) filter.partner_type = partner_type;

    const partners = await Partner.find(filter)
      .sort({ order: 1, name: 1 });
    return NextResponse.json(JSON.parse(JSON.stringify(partners)));
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
    const partner = new Partner(body);
    await partner.save();
    await partner.populate('associated_project');
    return NextResponse.json(JSON.parse(JSON.stringify(partner)), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}