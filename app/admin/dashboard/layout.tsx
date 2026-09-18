import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import DashboardSidebarWrapper from '@/components/DashboardSidebarWrapper';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getSessionUser();

  // Enforce session check on server layout rendering
  if (!admin) {
    redirect('/admin/login');
  }

  // Cast type to standard props
  const cleanAdmin = {
    username: admin.username,
    email: admin.email,
    role: admin.role,
  };

  return <DashboardSidebarWrapper admin={cleanAdmin}>{children}</DashboardSidebarWrapper>;
}
