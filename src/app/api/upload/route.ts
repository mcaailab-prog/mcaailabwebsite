import { NextRequest, NextResponse } from 'next/server';
import { assertCloudinaryConfigured, uploadImage } from '@/app/api/utils/cloudinary';
import { getAdminSession } from '@/lib/admin-request';

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    assertCloudinaryConfigured();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image must be 10MB or smaller.' }, { status: 400 });
    }

    const secureUrl = await uploadImage(file);

    return NextResponse.json({ secure_url: secureUrl, folder: 'mcaai' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
