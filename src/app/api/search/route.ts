import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { Project } from '@/app/api/models/Project';
import { News } from '@/app/api/models/News';
import { Publication } from '@/app/api/models/Publication';

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
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const projects = await Project.find({ $text: { $search: query } });
    const news = await News.find({ $text: { $search: query } });
    const publications = await Publication.find({ $text: { $search: query } });

    const results = [
      ...projects.map(p => ({ type: 'Project', title: p.title, url: `/projects/${p.slug}` })),
      ...news.map(n => ({ type: 'News', title: n.title, url: `/news/${n.slug}` })),
      ...publications.map(p => ({ type: 'Publication', title: p.title, url: `/publications/${p.id}` })),
    ];

    return NextResponse.json(JSON.parse(JSON.stringify(results)));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
