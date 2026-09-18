import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error: any) {
    console.error('Auth session error:', error);
    return NextResponse.json({ authenticated: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
