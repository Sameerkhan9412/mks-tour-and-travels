'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';

interface GrowthItem {
  name: string;
  inquiries: number;
}

interface DestStatItem {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  growthData: GrowthItem[];
  destinationData: DestStatItem[];
}

const COLORS = ['#0B3B78', '#3FA9F5', '#14B8A6', '#F9C63D', '#0F172A'];

export default function AnalyticsCharts({ growthData, destinationData }: AnalyticsChartsProps) {
  // Ensure we have some default chart structures if lists are empty
  const defaultGrowth = [
    { name: 'Jan', inquiries: 4 },
    { name: 'Feb', inquiries: 7 },
    { name: 'Mar', inquiries: 12 },
    { name: 'Apr', inquiries: 9 },
    { name: 'May', inquiries: 18 },
    { name: 'Jun', inquiries: 15 }
  ];

  const defaultDest = [
    { name: 'Kashmir', value: 8 },
    { name: 'Maldives', value: 5 },
    { name: 'Dubai', value: 6 },
    { name: 'Goa', value: 3 },
    { name: 'Bali', value: 4 }
  ];

  const actualGrowth = growthData && growthData.length > 0 ? growthData : defaultGrowth;
  const actualDest = destinationData && destinationData.length > 0 ? destinationData : defaultDest;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 1. Monthly growth bar chart */}
      <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-800 mb-6">Inquiries Growth Trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={actualGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="600" />
              <YAxis stroke="#94a3b8" fontSize={11} fontWeight="600" />
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="inquiries" fill="#0B3B78" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Destination Popularity Pie Chart */}
      <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col">
        <h3 className="text-base font-extrabold text-slate-800 mb-6">Popular Destination Demands</h3>
        <div className="h-64 w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={actualDest}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {actualDest.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
