import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, testimonials });
  } catch (error: any) {
    console.error('Testimonials fetch error:', error);
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
    const { name, review, rating, photo, destination } = data;

    if (!name || !review || !destination || !photo) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newTestimonial = await Testimonial.create({
      name,
      review,
      rating: rating ? Number(rating) : 5,
      photo,
      destination,
    });

    return NextResponse.json({ success: true, testimonial: newTestimonial }, { status: 201 });
  } catch (error: any) {
    console.error('Testimonial creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
