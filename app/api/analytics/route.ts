import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Blog from '@/models/Blog';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Total counts
    const totalInquiries = await Inquiry.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalBlogs = await Blog.countDocuments();

    // 2. Inquiry status breakdown
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
    const convertedInquiries = await Inquiry.countDocuments({ status: 'converted' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    // 3. Monthly growth of inquiries (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Inquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthChart = [];

    // Fill last 6 months with actual count or 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mLabel = months[d.getMonth()];
      const year = d.getFullYear();
      const monthNum = d.getMonth() + 1;

      const matched = monthlyData.find(
        (item) => item._id.year === year && item._id.month === monthNum
      );

      growthChart.push({
        name: mLabel,
        inquiries: matched ? matched.count : 0,
      });
    }

    // 4. Popular destinations based on inquiries
    const popularDestinationsData = await Inquiry.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const destinationStats = popularDestinationsData.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalInquiries,
        totalPackages,
        totalDestinations,
        totalHotels,
        totalBlogs,
        statusBreakdown: {
          new: newInquiries,
          contacted: contactedInquiries,
          converted: convertedInquiries,
          closed: closedInquiries,
        },
      },
      charts: {
        growthChart,
        destinationStats,
      },
    });
  } catch (error: any) {
    console.error('Analytics aggregation error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
