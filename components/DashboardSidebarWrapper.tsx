'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Globe,
  BarChart3,
  Compass,
  Layers,
  Map,
  Hotel,
  MessageSquare,
  FolderOpen,
  LogOut,
  UserCheck
} from 'lucide-react';
import axios from 'axios';

interface AdminInfo {
  username: string;
  email: string;
  role: string;
}

interface WrapperProps {
  admin: AdminInfo;
  children: React.ReactNode;
}

export default function DashboardSidebarWrapper({ admin, children }: WrapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: 'Analytics', href: '/admin/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Tour Categories', href: '/admin/dashboard/categories', icon: <Layers className="w-5 h-5" /> },
    { name: 'Tour Packages', href: '/admin/dashboard/packages', icon: <Compass className="w-5 h-5" /> },
    { name: 'Destinations', href: '/admin/dashboard/destinations', icon: <Map className="w-5 h-5" /> },
    { name: 'Hotels Management', href: '/admin/dashboard/hotels', icon: <Hotel className="w-5 h-5" /> },
    { name: 'Testimonials', href: '/admin/dashboard/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Inquiries Board', href: '/admin/dashboard/inquiries', icon: <FolderOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand header */}
        <div className="flex items-center gap-2 p-6 border-b border-slate-800 shrink-0">
          <Globe className="w-6 h-6 text-accent-gold" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wider leading-none">MSK HOLIDAY&apos;S</span>
            <span className="text-[9px] font-bold text-secondary-sky tracking-widest leading-none mt-1">CONTROL BOARD</span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 bg-slate-950/40 rounded-2xl border border-slate-800 shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center text-white shrink-0">
            <UserCheck className="w-4 h-4 text-accent-gold" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-white truncate">{admin.username}</span>
            <span className="block text-[9px] font-bold text-slate-500 capitalize">{admin.role}</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary-blue text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer LogOut */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-950/30 hover:text-red-400 border border-transparent hover:border-red-900/30 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Header bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="lg:hidden flex items-center justify-between bg-slate-900 text-slate-300 px-6 py-4 shrink-0 shadow-md">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent-gold" />
            <span className="text-xs font-black text-white tracking-widest">MSK CONTROL</span>
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg text-slate-400 hover:text-white focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* 3. Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 bg-slate-950 lg:hidden"
              />

              {/* Drawer Menu */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col p-6 shadow-xl lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent-gold" />
                    <span className="text-xs font-black text-white tracking-wider">MSK CONTROL</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-primary-blue text-white shadow-md'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-slate-800 pt-6 mt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-all cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 4. Page Content area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-64px)] lg:max-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
