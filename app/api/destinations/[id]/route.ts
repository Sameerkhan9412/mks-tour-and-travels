import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Destination from '@/models/Destination';
import { getSessionUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id.toLowerCase() };
    }

    const destination = await Destination.findOne(query);
    if (!destination) {
      return NextResponse.json({ message: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, destination });
  } catch (error: any) {
    console.error('Destination fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    const { name, overview, attractions, activities, bestTimeToVisit, travelTips, isDomestic, featured, image } = data;

    await connectToDatabase();

    const slug = name
      ? name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : undefined;

    const updatedData: any = {
      overview,
      attractions,
      activities,
      bestTimeToVisit,
      travelTips,
      isDomestic,
      featured,
      image,
    };

    if (name) {
      updatedData.name = name;
      updatedData.slug = slug;
    }

    const updatedDest = await Destination.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedDest) {
      return NextResponse.json({ message: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, destination: updatedDest });
  } catch (error: any) {
    console.error('Destination update error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const deletedDest = await Destination.findByIdAndDelete(id);

    if (!deletedDest) {
      return NextResponse.json({ message: 'Destination not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error: any) {
    console.error('Destination deletion error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
