import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Category from '@/models/Category';
import { getSessionUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Prevent tree-shaking of imported models
  const _registerModels = [Destination.modelName, Hotel.modelName, Category.modelName];

  try {
    const { id } = await params;
    await connectToDatabase();

    let query: any = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id.toLowerCase() };
    }

    const pkg = await Package.findOne(query)
      .populate('destination')
      .populate('hotels')
      .populate('categoryRef');

    if (!pkg) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: pkg });
  } catch (error: any) {
    console.error('Package fetch error:', error);
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
    const {
      name,
      destination,
      description,
      duration,
      durationDays,
      price,
      regularPrice,
      rating,
      images,
      highlights,
      placesYouWillSee,
      itineraryIntro,
      itinerary,
      included,
      excluded,
      hotels,
      featured,
      category,
      categoryRef,
      mapUrl,
      mapEmbedUrl,
      isDomestic,
    } = data;

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
      destination: destination || undefined,
      description,
      duration,
      durationDays: durationDays !== undefined ? Number(durationDays) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      regularPrice: regularPrice !== undefined ? Number(regularPrice) : undefined,
      rating: rating !== undefined ? Number(rating) : undefined,
      images,
      highlights,
      placesYouWillSee,
      itineraryIntro,
      itinerary,
      included,
      excluded,
      hotels,
      featured,
      category: category ? category.toLowerCase().trim() : undefined,
      categoryRef: categoryRef || undefined,
      mapUrl,
      mapEmbedUrl,
      isDomestic,
    };

    // Remove undefined keys
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    if (name) {
      updatedData.name = name;
      if (slug) updatedData.slug = slug;
    }

    const updatedPkg = await Package.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedPkg) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: updatedPkg });
  } catch (error: any) {
    console.error('Package update error:', error);
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
    const deletedPkg = await Package.findByIdAndDelete(id);

    if (!deletedPkg) {
      return NextResponse.json({ message: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    console.error('Package deletion error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
