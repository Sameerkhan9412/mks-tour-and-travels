import React from 'react';
import { connectToDatabase } from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { FileText, Compass, MapPin, Hotel as HotelIcon, BarChart3, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export default async function AdminDashboardIndexPage() {
  let stats = {
    totalInquiries: 0,
    totalPackages: 0,
    totalDestinations: 0,
    totalHotels: 0,
    statusBreakdown: {
      new: 0,
      contacted: 0,
      converted: 0,
      closed: 0
    }
  };

  let growthChart: any[] = [];
  let destinationStats: any[] = [];

  try {
    await connectToDatabase();

    // 1. Total counts
    const totalInquiries = await Inquiry.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalHotels = await Hotel.countDocuments();

    // 2. Inquiry status breakdown
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const contactedInquiries = await Inquiry.countDocuments({ status: 'contacted' });
    const convertedInquiries = await Inquiry.countDocuments({ status: 'converted' });
    const closedInquiries = await Inquiry.countDocuments({ status: 'closed' });

    stats = {
      totalInquiries,
      totalPackages,
      totalDestinations,
      totalHotels,
      statusBreakdown: {
        new: newInquiries,
        contacted: contactedInquiries,
        converted: convertedInquiries,
        closed: closedInquiries
      }
    };

    // 3. Monthly growth of inquiries (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyData = await Inquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        inquiries: matched ? matched.count : 0
      });
    }

    // 4. Popular destinations based on inquiries
    const popularDestinationsData = await Inquiry.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    destinationStats = popularDestinationsData.map((item) => ({
      name: item._id || 'General',
      value: item.count
    }));
  } catch (error) {
    console.error('Database query error in admin analytics dashboard:', error);
  }

  const statCards = [
    {
      label: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: <FileText className="w-6 h-6 text-primary-blue" />,
      bg: 'bg-blue-50 border-blue-100',
      desc: `${stats.statusBreakdown.new} New unprocessed leads`
    },
    {
      label: 'Tour Packages',
      value: stats.totalPackages,
      icon: <Compass className="w-6 h-6 text-secondary-sky" />,
      bg: 'bg-sky-50 border-sky-100',
      desc: 'Active packages in directory'
    },
    {
      label: 'Destinations',
      value: stats.totalDestinations,
      icon: <MapPin className="w-6 h-6 text-tropical-teal" />,
      bg: 'bg-teal-50 border-teal-100',
      desc: 'Domestic & International spots'
    },
    {
      label: 'Partner Hotels',
      value: stats.totalHotels,
      icon: <HotelIcon className="w-6 h-6 text-accent-gold" />,
      bg: 'bg-yellow-50 border-yellow-100',
      desc: 'Accommodations cataloged'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-blue" />
            Dashboard Analytics
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
            Real-time operations metrics overview
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`border rounded-3xl p-6 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow ${card.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.label}</span>
              <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-800 leading-none">{card.value}</span>
              <span className="block text-[10px] font-bold text-slate-400 mt-2 tracking-wide truncate">
                {card.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry status breakdown summary widgets */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary-sky" />
          Lead Pipeline Funnel
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xl font-black text-slate-700 block">{stats.statusBreakdown.new}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1.5">New Leads</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xl font-black text-slate-700 block">{stats.statusBreakdown.contacted}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1.5">Contacted</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xl font-black text-green-600 block">{stats.statusBreakdown.converted}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1.5">Converted</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <span className="text-xl font-black text-slate-400 block">{stats.statusBreakdown.closed}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-1.5">Closed</span>
          </div>
        </div>
      </div>

      {/* Recharts Graphical Visuals */}
      <AnalyticsCharts growthData={growthChart} destinationData={destinationStats} />
    </div>
  );
}
