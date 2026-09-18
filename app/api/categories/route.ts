import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured');

    const query: any = {};
    if (featuredOnly === 'true') {
      query.featured = true;
    }

    const categories = await Category.find(query).sort({ order: 1, name: 1 }).lean();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();
    const { name, image, description, order, featured } = data;

    if (!name || !image) {
      return NextResponse.json({ message: 'Category Name and Image are required' }, { status: 400 });
    }

    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
      : name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: 'A category with this name/slug already exists' }, { status: 400 });
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      image: image.trim(),
      description: description ? description.trim() : '',
      order: order !== undefined ? Number(order) : 0,
      featured: featured !== undefined ? Boolean(featured) : true,
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error('Category creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
