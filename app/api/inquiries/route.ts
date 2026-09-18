import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { getSessionUser } from '@/lib/auth';

// Public submission of travel inquiries
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const { name, email, phoneNumber, destination, travelDate, budget, travelersCount } = data;

    if (!name || !email || !phoneNumber || !destination || !travelDate || budget === undefined || !travelersCount) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newInquiry = await Inquiry.create({
      name,
      email,
      phoneNumber,
      destination,
      travelDate,
      budget: Number(budget),
      travelersCount: Number(travelersCount),
      status: 'new',
      notes: '',
    });

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Admin get list of inquiries
export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
