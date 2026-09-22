import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { getAdminSession } from '@/lib/admin-request';
import { News } from '@/app/api/models/News';

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
    const category = searchParams.get('category');
    const admin = await getAdminSession(request);

    const filter: Record<string, unknown> = {};

    if (category) filter.category = category;
    if (!admin) filter.is_published = true;

    const posts = await News.find(filter).sort({ published_date: -1 });
    return NextResponse.json(JSON.parse(JSON.stringify(posts)));
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
    if (!body.published_date) body.published_date = new Date();
    if (!body.slug && body.title) {
      body.slug = String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const post = new News(body);
    await post.save();

    return NextResponse.json(JSON.parse(JSON.stringify(post)), { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

