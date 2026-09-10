import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/app/api/utils/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const secureUrl = await uploadImage(file);

    return NextResponse.json({ secure_url: secureUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
