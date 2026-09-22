import { NextRequest, NextResponse } from 'next/server';
import { connectDB, checkDBConnection } from '@/app/api/utils/connectDB';
import { TeamMember } from '@/app/api/models/TeamMember';

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
    const teamMembers = await getTeamMembersHandler();
    return NextResponse.json(teamMembers);
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
    const teamMember = await createTeamMemberHandler(body);
    return NextResponse.json(teamMember, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// Handler functions
async function getTeamMembersHandler() {
  const teamMembers = await TeamMember.find()
    .sort({ order: 1, name: 1 });

  return JSON.parse(JSON.stringify(teamMembers));
}

async function createTeamMemberHandler(body: Record<string, unknown>) {
  const teamMember = new TeamMember(body);
  await teamMember.save();
  return JSON.parse(JSON.stringify(teamMember));
}