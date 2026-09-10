import { NextRequest } from 'next/server';
import { deleteDocument, getDocument, updateDocument } from '@/app/api/_lib/crud';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return getDocument(id, 'CareerTrack');
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return updateDocument(request, id, 'CareerTrack');
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return deleteDocument(id, 'CareerTrack');
}
