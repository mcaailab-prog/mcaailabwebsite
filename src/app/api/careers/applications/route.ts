import { NextRequest } from 'next/server';
import { listDocuments } from '@/app/api/_lib/crud';

export async function GET(request: NextRequest) {
  return listDocuments(request, 'CareerApplication', { sort: { createdAt: -1 } });
}
