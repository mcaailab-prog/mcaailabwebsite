import { NextRequest } from 'next/server';
import { createDocument, listDocuments } from '@/app/api/_lib/crud';

export async function GET(request: NextRequest) {
  return listDocuments(request, 'Innovation', {
    sort: { order: 1, createdAt: -1 },
    publishedField: 'is_published',
  });
}

export async function POST(request: NextRequest) {
  return createDocument(request, 'Innovation');
}
