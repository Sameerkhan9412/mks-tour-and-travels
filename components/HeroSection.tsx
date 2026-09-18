'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, Calendar, MapPin, BadgeDollarSign, ChevronRight, Phone } from 'lucide-react';
import axios from 'axios';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1920&q=85',
    title: 'Kashmir: Paradise on Earth',
    subtitle: 'Sail on the pristine Dal Lake and breathe the fresh mountain air of Gulmarg.',
  },
  {
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=85',
    title: 'Spiti & Ladakh High Passes',
    subtitle: 'Traverse dramatic cold deserts, ancient cliff monasteries, and crystalline lakes.',
  },
  {
    image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=1920&q=85',
    title: 'Kerala: God’s Own Country',
    subtitle: 'Unwind in tranquil backwater houseboats and lush misty tea hills of Munnar.',
  },
  {
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
    title: 'Royal Rajasthan Heritage',
    subtitle: 'Step into legendary maharajah palaces, mighty desert hill forts, and golden sands.',
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [formData, setFormData] = useState({
    destination: '',
    travelDate: '',
    budget: '',
    travelersCount: '2',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Cycle slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination || !formData.travelDate || !formData.phoneNumber) {
      alert('Please fill out Destination, Travel Date, and Phone Number');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        name: 'Website Visitor',
        email: 'visitor@mskholidays.com', // placeholder
        phoneNumber: formData.phoneNumber,
        destination: formData.destination,
        travelDate: formData.travelDate,
        budget: Number(formData.budget) || 20000,
        travelersCount: Number(formData.travelersCount) || 2,
      };

      const res = await axios.post('/api/inquiries', payload);
      if (res.data.success) {
        setSubmitStatus('success');
        setFormData({
          destination: '',
          travelDate: '',
          budget: '',
          travelersCount: '2',
          phoneNumber: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 4000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Quick submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Dynamic Background Slider */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={heroSlides[activeSlide].image}
              alt="Destination background"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark/90 z-1" />
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-accent-gold text-brand-dark tracking-widest uppercase mb-4"
        >
          Unforgettable Travel Experiences
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-shadow leading-tight"
        >
          Discover Extraordinary Journeys With{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-secondary-sky to-white">
            MSK Holiday&apos;s
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl text-shadow font-medium"
        >
          Domestic & International Tour Packages Custom-Designed For Memorable Experiences and Seamless Stays.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#featured-packages"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-slate-900 bg-accent-gold hover:bg-white transition-all duration-300 shadow-lg hover:scale-105"
          >
            Explore Packages
            <ChevronRight className="w-5 h-5" />
          </a>
          <a
            href="#quick-inquiry"
            className="px-8 py-4 rounded-full font-bold text-white border border-white bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-md"
          >
            Plan My Trip
          </a>
        </motion.div>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          id="quick-inquiry"
          className="mt-16 w-full max-w-5xl rounded-3xl bg-[#061e3f]/90 backdrop-blur-xl border border-primary-blue/30 p-6 sm:p-8 shadow-[0_20px_50px_rgba(11,59,120,0.3)] text-left"
        >
          <h3 className="text-white text-base sm:text-lg font-bold mb-5 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-gold"></span>
            </span>
            Quick Tour Inquiry Form
          </h3>

          <form onSubmit={handleSubmitInquiry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent-gold" /> Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g. Kashmir, Goa, Dubai"
                className="w-full px-4 py-3 bg-slate-950/60 text-white placeholder-slate-400 rounded-xl border border-slate-700/60 text-sm focus:outline-none focus:bg-slate-950 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all duration-300"
                required
              />
            </div>

            {/* Travel Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent-gold" /> Travel Date
              </label>
              <input
                type="date"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/60 text-white rounded-xl border border-slate-700/60 text-sm focus:outline-none focus:bg-slate-950 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all duration-300 text-slate-300"
                required
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BadgeDollarSign className="w-3.5 h-3.5 text-accent-gold" /> Budget (₹)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Estimated Budget"
                className="w-full px-4 py-3 bg-slate-950/60 text-white placeholder-slate-400 rounded-xl border border-slate-700/60 text-sm focus:outline-none focus:bg-slate-950 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all duration-300"
              />
            </div>

            {/* Travelers Count */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent-gold" /> Travelers Count
              </label>
              <select
                name="travelersCount"
                value={formData.travelersCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950/60 text-white rounded-xl border border-slate-700/60 text-sm focus:outline-none focus:bg-slate-950 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all duration-300 [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5">5+ Travelers</option>
              </select>
            </div>

            {/* Phone Number & Submit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-accent-gold" /> Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Mobile No."
                  className="w-full px-3 py-3 bg-slate-950/60 text-white placeholder-slate-400 rounded-xl border border-slate-700/60 text-sm focus:outline-none focus:bg-slate-950 focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/20 transition-all duration-300 min-w-0"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center p-3.5 rounded-xl bg-accent-gold hover:bg-white text-slate-950 transition-all duration-300 cursor-pointer shrink-0 disabled:opacity-50 shadow-md hover:shadow-[0_0_15px_rgba(249,198,61,0.4)] hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </form>

          {/* Success / Error Toast */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-green-400 font-bold flex items-center gap-1.5"
              >
                ✓ Custom quote requested successfully! Our travel experts will call you shortly.
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-red-400 font-bold"
              >
                ✗ Failed to submit inquiry. Please check details or connection.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
