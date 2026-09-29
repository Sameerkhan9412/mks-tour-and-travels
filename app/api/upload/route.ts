import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer;
    let folder = 'msk_holidays/categories';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const customFolder = formData.get('folder') as string | null;
      if (customFolder) folder = customFolder;

      if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 });
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ message: 'File size exceeds 10MB limit' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } else {
      const body = await req.json();
      const { image, folder: customFolder } = body;
      if (customFolder) folder = customFolder;
      if (!image) {
        return NextResponse.json({ message: 'No image data provided' }, { status: 400 });
      }
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }

    // Upload to Cloudinary via upload_stream
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { message: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
