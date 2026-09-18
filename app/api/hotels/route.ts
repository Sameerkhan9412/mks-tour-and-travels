import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Hotel from '@/models/Hotel';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const hotels = await Hotel.find().sort({ name: 1 });
    return NextResponse.json({ success: true, hotels });
  } catch (error: any) {
    console.error('Hotels fetch error:', error);
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
    const { name, location, rating, description, images, amenities } = data;

    if (!name || !location || !description) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newHotel = await Hotel.create({
      name,
      location,
      rating: rating ? Number(rating) : 3,
      description,
      images: images || [],
      amenities: amenities || [],
    });

    return NextResponse.json({ success: true, hotel: newHotel }, { status: 201 });
  } catch (error: any) {
    console.error('Hotel creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
