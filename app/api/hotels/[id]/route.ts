import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Hotel from '@/models/Hotel';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel });
  } catch (error: any) {
    console.error('Hotel fetch error:', error);
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
    const { name, location, rating, description, images, amenities } = data;

    await connectToDatabase();
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        name,
        location,
        rating: rating ? Number(rating) : undefined,
        description,
        images,
        amenities,
      },
      { new: true, runValidators: true }
    );

    if (!updatedHotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hotel: updatedHotel });
  } catch (error: any) {
    console.error('Hotel update error:', error);
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
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return NextResponse.json({ message: 'Hotel not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error: any) {
    console.error('Hotel deletion error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
