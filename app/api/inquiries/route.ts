import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { getSessionUser } from '@/lib/auth';
import { sendQuoteEmails } from '@/lib/email';

// Public submission of travel inquiries and quotations
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const {
      name,
      email,
      phoneNumber,
      destination,
      category,
      packageName,
      packageSlug,
      travelDate,
      budget,
      travelersCount,
      notes,
      message,
      inquiryType,
    } = data;

    if (!name || !email || !phoneNumber) {
      return NextResponse.json(
        { message: 'Name, email, and phone number are required' },
        { status: 400 }
      );
    }

    const finalNotes = (notes || message || '').trim();
    const finalDestination = destination || category || packageName || 'General India Inquiry';
    const finalCategory = category || 'General';
    const finalPackageName = packageName || destination || 'Custom Tour Plan';

    const newInquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      destination: finalDestination,
      category: finalCategory,
      packageName: finalPackageName,
      packageSlug: packageSlug || '',
      travelDate: travelDate || new Date().toISOString().split('T')[0],
      budget: budget !== undefined ? Number(budget) : 0,
      travelersCount: travelersCount ? Number(travelersCount) : 1,
      status: 'new',
      notes: finalNotes,
      inquiryType: inquiryType || 'quote',
    });

    // Send quotation copy emails asynchronously to admin and customer
    let emailStatus = { adminSent: false, customerSent: false };
    try {
      emailStatus = await sendQuoteEmails({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        category: finalCategory,
        packageName: finalPackageName,
        travelDate: travelDate || 'Flexible / To be confirmed',
        travelersCount: travelersCount ? Number(travelersCount) : 1,
        message: finalNotes,
      });
    } catch (emailErr) {
      console.error('Email sending exception:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        inquiry: newInquiry,
        emailStatus,
        message: 'Your inquiry has been received. A confirmation copy has been sent to your email.',
      },
      { status: 201 }
    );
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
