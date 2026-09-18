import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Destination from '@/models/Destination';
import { getSessionUser } from '@/lib/auth';

// Public GET destinations + Admin POST destination
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured');
    const isDomestic = searchParams.get('domestic');

    const query: any = {};
    if (featured !== null) {
      query.featured = featured === 'true';
    }
    if (isDomestic !== null) {
      query.isDomestic = isDomestic === 'true';
    }

    const destinations = await Destination.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, destinations });
  } catch (error: any) {
    console.error('Destinations fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
    const { name, overview, attractions, activities, bestTimeToVisit, travelTips, isDomestic, featured, image } = data;

    if (!name || !overview || !bestTimeToVisit || !image) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingDest = await Destination.findOne({ slug });
    if (existingDest) {
      return NextResponse.json({ message: 'A destination with this name/slug already exists' }, { status: 400 });
    }

    const newDestination = await Destination.create({
      name,
      slug,
      image,
      overview,
      attractions: attractions || [],
      activities: activities || [],
      bestTimeToVisit,
      travelTips: travelTips || [],
      isDomestic: isDomestic === true,
      featured: featured === true,
    });

    return NextResponse.json({ success: true, destination: newDestination }, { status: 201 });
  } catch (error: any) {
    console.error('Destination creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
