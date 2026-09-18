'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, PhoneCall, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import axios from 'axios';

interface CategoryItem {
  _id?: string;
  name: string;
  slug: string;
  image: string;
}

// Default 10 Indian Tour Categories from the user screenshot
const defaultCategories: CategoryItem[] = [
  {
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Kashmir',
    slug: 'kashmir',
    image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Ladakh',
    slug: 'ladakh',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Spiti',
    slug: 'spiti',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Andaman & Nicobar',
    slug: 'andaman-nicobar',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sikkim',
    slug: 'sikkim',
    image: 'https://images.unsplash.com/photo-1622308644420-a75d5069f1d0?auto=format&fit=crop&w=300&q=80',
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic categories if available
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get('/api/categories');
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        // Fallback to default 10 Indian categories
      }
    };
    fetchCats();
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const isPackagesActive = pathname.startsWith('/packages');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-nav py-3 shadow-md bg-white/95 backdrop-blur-md' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary-blue text-white overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Globe className="w-6 h-6 text-accent-gold animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-extrabold tracking-wider text-primary-blue leading-none">
                  MSK HOLIDAY&apos;S
                </span>
                <span className="text-[10px] md:text-[11px] font-bold text-secondary-sky tracking-widest leading-none mt-1">
                  INDIA TOURS ONLY
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-primary-blue ${
                  pathname === '/' ? 'text-primary-blue font-bold' : 'text-slate-700'
                }`}
              >
                Home
                {pathname === '/' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-blue rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* Tour Packages with Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/packages"
                  className={`flex items-center gap-1.5 text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-primary-blue ${
                    isPackagesActive ? 'text-primary-blue font-bold' : 'text-slate-700'
                  }`}
                >
                  Tour Packages
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-primary-blue' : 'text-slate-400'
                    }`}
                  />
                  {isPackagesActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-blue rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Tour Packages Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                          India Tour Categories
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> 100% India
                        </span>
                      </div>

                      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50 pr-1">
                        {categories.map((cat, idx) => (
                          <Link
                            key={cat.slug || idx}
                            href={`/packages?category=${cat.slug}`}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-inner bg-slate-100 group-hover:scale-105 transition-transform duration-200">
                              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-slate-800 group-hover:text-primary-blue transition-colors truncate">
                                {cat.name}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                Explore tour packages
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100 mt-1 px-1">
                        <Link
                          href="/packages"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block text-center py-2 text-xs font-bold text-primary-blue hover:bg-primary-blue/5 rounded-xl transition-colors"
                        >
                          View All India Tour Packages →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/about"
                className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-primary-blue ${
                  pathname === '/about' ? 'text-primary-blue font-bold' : 'text-slate-700'
                }`}
              >
                About Us
                {pathname === '/about' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-blue rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              <Link
                href="/contact"
                className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-primary-blue ${
                  pathname === '/contact' ? 'text-primary-blue font-bold' : 'text-slate-700'
                }`}
              >
                Contact
                {pathname === '/contact' && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-blue rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </nav>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-primary-blue hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4 text-accent-gold" />
                Plan My Trip
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-blue focus:outline-none transition-colors duration-200"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-sm bg-white shadow-xl flex flex-col p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center">
                    <Globe className="w-5 h-5 text-accent-gold" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary-blue leading-none">
                      MSK HOLIDAY&apos;S
                    </span>
                    <span className="text-[9px] font-semibold text-secondary-sky tracking-wider leading-none mt-0.5">
                      INDIA TOURS ONLY
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-primary-blue transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    pathname === '/'
                      ? 'bg-slate-50 text-primary-blue border-l-4 border-primary-blue'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-blue'
                  }`}
                >
                  Home
                </Link>

                {/* Tour Packages Accordion on Mobile */}
                <div>
                  <button
                    onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide text-slate-700 hover:bg-slate-50"
                  >
                    <span>Tour Packages</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isMobilePackagesOpen ? 'rotate-180 text-primary-blue' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isMobilePackagesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 pr-1 py-1 space-y-1"
                      >
                        <Link
                          href="/packages"
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-1.5 text-xs font-bold text-primary-blue"
                        >
                          → View All Packages
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/packages?category=${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary-blue"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    pathname === '/about'
                      ? 'bg-slate-50 text-primary-blue border-l-4 border-primary-blue'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-blue'
                  }`}
                >
                  About Us
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    pathname === '/contact'
                      ? 'bg-slate-50 text-primary-blue border-l-4 border-primary-blue'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-blue'
                  }`}
                >
                  Contact
                </Link>
              </nav>

              <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col gap-3">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary-blue transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary-blue shadow-md hover:bg-opacity-95 transition-all duration-200"
                >
                  <PhoneCall className="w-4 h-4 text-accent-gold" />
                  Plan My Trip
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
