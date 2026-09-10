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
    const sector = searchParams.get('sector');
    const status = searchParams.get('status');
    const admin = await getAdminSession(request);

    const filter: any = {};

    if (sector) filter.sector = sector;
    if (status) filter.status = status;
    if (!admin) filter.is_published = true;

    const Project = require('@/app/api/models/Project').Project;
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(projects)));
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
    const Project = require('@/app/api/models/Project').Project;
    const project = new Project(body);
    await project.save();
    await project.populate('research_areas');
    await project.populate('team_members');
    await project.populate('partners');
    return NextResponse.json(JSON.parse(JSON.stringify(project)), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}