'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Building2,
  Utensils,
  Car,
  Users,
  UserCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  PhoneCall,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';

interface DestinationInfo {
  name: string;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

interface PlaceYouWillSee {
  name: string;
  image: string;
}

interface PackageData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  price: number;
  regularPrice?: number;
  rating: number;
  images: string[];
  highlights?: {
    travel?: string;
    accommodation?: string;
    meals?: string;
    transport?: string;
    groupSize?: string;
    team?: string;
  };
  placesYouWillSee?: PlaceYouWillSee[];
  itineraryIntro?: string;
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  category: string;
  destination?: DestinationInfo | null | string;
  mapEmbedUrl?: string;
}

export default function PackageDetailClient({ pkg }: { pkg: PackageData }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'map'>('overview');
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Inquiry form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const formRef = useRef<HTMLDivElement | null>(null);

  const toggleDay = (day: number) => {
    if (expandedDays.includes(day)) {
      setExpandedDays(expandedDays.filter((d) => d !== day));
    } else {
      setExpandedDays([...expandedDays, day]);
    }
  };

  const scrollToSection = (id: string, tab: 'overview' | 'itinerary' | 'included' | 'map') => {
    setActiveTab(tab);
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -120;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToDiscountForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const nameInput = document.getElementById('inquiry-name');
      if (nameInput) nameInput.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      alert('Please fill out Name, Email, and Phone Number');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        destination: pkg.name,
        budget: pkg.price,
        travelersCount: 2,
        notes: `Discount inquiry for ${pkg.name} (${pkg.duration})`,
      };

      const res = await axios.post('/api/inquiries', payload);
      if (res.data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phoneNumber: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Inquiry submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp click handler
  const triggerWhatsApp = () => {
    const phone = '919805400248';
    const text = encodeURIComponent(
      `Hi MSK Holiday's, I want a discount on "${pkg.name}" (Price: ₹${pkg.price}). Please share the best offer and itinerary.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Highlights defaults matching screenshot
  const highlights = {
    travel: pkg.highlights?.travel || pkg.duration || '04 Days/ 03 Nights',
    accommodation: pkg.highlights?.accommodation || '3 nights in hotels',
    meals: pkg.highlights?.meals || '4 Breakfasts, 3 Dinners',
    transport: pkg.highlights?.transport || 'Mini-Coach and Ferry',
    groupSize: pkg.highlights?.groupSize || 'Average 24 people',
    team: pkg.highlights?.team || 'Expert Trip Manager',
  };

  // Places You'll See gallery
  const places =
    pkg.placesYouWillSee && pkg.placesYouWillSee.length > 0
      ? pkg.placesYouWillSee
      : [
          { name: 'Dal Lake & Houseboats', image: pkg.images[0] || 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=80' },
          { name: 'Gulmarg Gondola & Peaks', image: pkg.images[1] || 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80' },
          { name: 'Pahalgam Lidder Valley', image: pkg.images[2] || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80' },
          { name: 'Mughal Gardens Srinagar', image: pkg.images[3] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
        ];

  const nextPlace = () => {
    setCarouselIndex((prev) => (prev + 1) % places.length);
  };

  const prevPlace = () => {
    setCarouselIndex((prev) => (prev - 1 + places.length) % places.length);
  };

  // Default Inclusions & Exclusions from screenshot
  const inclusions =
    pkg.included && pkg.included.length > 0
      ? pkg.included
      : [
          'Accommodation in Selected Hotel',
          'All State Taxes, Toll Taxes, Parking fees, and Driver Charges',
          'Break Fast and Dinner',
          'Sightseeing as per Itinerary',
          'Transportation in Selected Mode of Transport',
        ];

  const exclusions =
    pkg.excluded && pkg.excluded.length > 0
      ? pkg.excluded
      : [
          'Exclusions Air / Train Fare',
          'Any private expenses',
          'Entry / Camera fees to any sightseeing Place',
          'Guide Service Fees',
          'Laundry Fees',
          'Sightseeing of any place not mentioned in the itinerary',
        ];

  const itineraryText =
    pkg.itineraryIntro ||
    pkg.description ||
    "Experience the serene beauty of Kashmir on a refreshing weekend getaway. Explore the charming city of Srinagar, with its picturesque Dal Lake, historic Mughal Gardens, and bustling local markets. Enjoy a peaceful Shikara ride and stay in a traditional houseboat, adding to the magical experience. Visit the breathtaking meadows of Gulmarg or the scenic landscapes of Pahalgam, where nature's beauty unfolds at every step. This short yet delightful tour is perfect for those looking for a rejuvenating break in the heart of the Himalayas.";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* 1. Hero Banner matching screenshot (media_1789748716817.png) */}
      <section className="relative pt-28 pb-16 bg-slate-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={pkg.images[0] || 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1920&q=85'}
            alt={pkg.name}
            fill
            priority
            className="object-cover opacity-45 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>|</span>
            <Link href={`/packages?category=${pkg.category}`} className="hover:text-white capitalize transition-colors">
              {pkg.category}
            </Link>
            <span>|</span>
            <span className="text-accent-gold font-bold truncate">{pkg.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Title & Tag */}
            <div className="lg:col-span-8 space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {pkg.name}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-2">
                {pkg.description}
              </p>
            </div>

            {/* Pricing Box (Right side matching screenshot) */}
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-2xl p-6 text-slate-800 shadow-2xl border border-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                From
              </span>
              <div className="flex items-baseline gap-3 my-1">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {pkg.price.toLocaleString('en-IN')} /-
                </span>
                {pkg.regularPrice && (
                  <span className="text-base font-bold text-slate-400 line-through">
                    {pkg.regularPrice.toLocaleString('en-IN')} /-
                  </span>
                )}
              </div>

              {/* Want A Discount Button (Green button in screenshot) */}
              <button
                onClick={scrollToDiscountForm}
                className="w-full mt-3 py-3 px-6 bg-[#6bc400] hover:bg-[#5eb000] text-white font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                Want A Discount ??
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sub-Tabs Bar: Overview | Itinerary | What's Included | Map */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-3.5 scrollbar-none">
            <button
              onClick={() => scrollToSection('section-overview', 'overview')}
              className={`text-sm font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-primary-blue border-b-2 border-primary-blue pb-2 -mb-3.5 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('section-itinerary', 'itinerary')}
              className={`text-sm font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'text-primary-blue border-b-2 border-primary-blue pb-2 -mb-3.5 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => scrollToSection('section-included', 'included')}
              className={`text-sm font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'included'
                  ? 'text-primary-blue border-b-2 border-primary-blue pb-2 -mb-3.5 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              What&apos;s Included
            </button>
            <button
              onClick={() => scrollToSection('section-map', 'map')}
              className={`text-sm font-bold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'map'
                  ? 'text-primary-blue border-b-2 border-primary-blue pb-2 -mb-3.5 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map
            </button>
          </nav>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Section: Explore / 6 Quick Highlights Card Grid */}
            <section id="section-overview" className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Travel */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Travel</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.travel}</p>
                  </div>
                </div>

                {/* 2. Accommodation */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Accommodation</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.accommodation}</p>
                  </div>
                </div>

                {/* 3. Meals */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Meals</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.meals}</p>
                  </div>
                </div>

                {/* 4. Transport */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Transport</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.transport}</p>
                  </div>
                </div>

                {/* 5. Group Size */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Group Size</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.groupSize}</p>
                  </div>
                </div>

                {/* 6. Team */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#6bc400]/15 text-[#5aa800] flex items-center justify-center mb-3">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Team</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">{highlights.team}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Places You'll See (Photo Gallery Carousel) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Places You&apos;ll See</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPlace}
                    className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextPlace}
                    className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {places.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`relative h-40 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all shadow-xs group ${
                      carouselIndex === idx ? 'border-primary-blue scale-[0.98]' : 'border-transparent'
                    }`}
                  >
                    <Image src={place.image} alt={place.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-bold line-clamp-1 drop-shadow-sm">
                      {place.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Itinerary (Timeline with Accordions) */}
            <section id="section-itinerary" className="space-y-6 pt-4 border-t border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Itinerary</h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {itineraryText}
              </p>

              <div className="pt-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-6">
                  Introduction
                </span>

                <div className="space-y-4">
                  {pkg.itinerary.map((item) => {
                    const isExpanded = expandedDays.includes(item.day);
                    return (
                      <div
                        key={item.day}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3 pr-2">
                            <span className="w-3 h-3 rounded-full bg-slate-800 shrink-0" />
                            <h3 className="text-sm sm:text-base font-bold text-slate-800">
                              {item.title}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-primary-blue' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3">
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                                  {item.description}
                                </p>
                                {item.activities && item.activities.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {item.activities.map((act, actIdx) => (
                                      <span
                                        key={actIdx}
                                        className="text-[10px] font-bold bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full"
                                      >
                                        {act}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section: What's Included & Excluded (matching screenshot) */}
            <section id="section-included" className="space-y-6 pt-4 border-t border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                What&apos;s Included &amp; Excluded
              </h2>

              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
                {/* Inclusions */}
                {inclusions.map((item, idx) => (
                  <div key={`inc-${idx}`} className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}

                {/* Exclusions */}
                {exclusions.map((item, idx) => (
                  <div key={`exc-${idx}`} className="flex items-center gap-3.5 p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Map */}
            <section id="section-map" className="space-y-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Map</h2>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(pkg.name + ' India')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-blue hover:underline"
                >
                  Open in Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="relative h-80 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                <iframe
                  title="Tour Map"
                  src={
                    pkg.mapEmbedUrl ||
                    `https://maps.google.com/maps?q=${encodeURIComponent(
                      pkg.category + ' India'
                    )}&t=&z=10&ie=UTF8&iwloc=&output=embed`
                  }
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Sidebar Form (4 cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div
              ref={formRef}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6"
            >
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-green-600 block mb-1">
                  Exclusive Offer
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  Hurry! Up to 30% Off on Unforgettable Travel Experiences!
                </h3>
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-xs font-bold border border-green-200">
                  ✓ Thank you! Our travel expert will contact you shortly with discount details.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-200">
                  ✕ Failed to submit. Please contact us directly or via WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <label htmlFor="inquiry-name" className="block text-xs font-bold text-slate-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-green-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-green-600 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-green-600 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-[#6bc400] hover:bg-[#5eb000] text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </form>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Instant Confirmation</span>
                <span className="font-bold text-green-700">✓ No Booking Fees</span>
              </div>
            </div>

            {/* Quick Contact & WhatsApp card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white text-center space-y-3 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-gold block">
                Have questions?
              </span>
              <p className="text-xs text-slate-300">
                Speak directly with our dedicated India Tour Manager
              </p>
              <div className="flex items-center justify-center gap-2 text-base font-black text-white pt-1">
                <PhoneCall className="w-4 h-4 text-accent-gold" />
                <span>+91 98054 00248</span>
              </div>
              <button
                onClick={triggerWhatsApp}
                className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button (matching screenshot bottom right) */}
      <button
        onClick={triggerWhatsApp}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </button>
    </div>
  );
}
