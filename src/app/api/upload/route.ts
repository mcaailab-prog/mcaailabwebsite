import { NextRequest, NextResponse } from 'next/server';
import { assertCloudinaryConfigured, uploadImage } from '@/app/api/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    assertCloudinaryConfigured();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const secureUrl = await uploadImage(file);

    return NextResponse.json({ secure_url: secureUrl, folder: 'mcaai' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
