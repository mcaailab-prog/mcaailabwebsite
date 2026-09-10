import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { getAdminSession } from '@/lib/admin-request';

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

    const filter: any = {};

    if (category) filter.category = category;
    if (!admin) filter.is_published = true;

    const News = require('@/app/api/models/News').News;
    const posts = await News.find(filter).sort({ published_date: -1 });
    return NextResponse.json(JSON.parse(JSON.stringify(posts)));
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
    if (!body.published_date) body.published_date = new Date();
    if (!body.slug && body.title) {
      body.slug = String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const News = require('@/app/api/models/News').News;
    const post = new News(body);
    await post.save();

    return NextResponse.json(JSON.parse(JSON.stringify(post)), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

