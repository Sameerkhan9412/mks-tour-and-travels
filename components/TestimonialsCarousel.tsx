'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialItem {
  _id: string;
  name: string;
  photo: string;
  review: string;
  rating: number;
  destination: string;
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length, nextSlide]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[activeIndex];

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Decorative Quote Icon */}
      <div className="absolute top-0 left-8 text-primary-blue/5 dark:text-white/5 pointer-events-none">
        <Quote className="w-32 h-32 rotate-180" />
      </div>

      <div className="relative overflow-hidden min-h-[300px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center px-6 md:px-12"
          >
            {/* Customer Photo */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 bg-slate-100">
              <Image
                src={current.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={current.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4 text-accent-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < current.rating ? 'fill-accent-gold' : 'text-slate-300 fill-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-base md:text-lg text-slate-600 italic leading-relaxed mb-6 font-medium max-w-2xl">
              &ldquo;{current.review}&rdquo;
            </p>

            {/* Client Info */}
            <h4 className="text-base font-extrabold text-slate-800 tracking-wider">
              {current.name}
            </h4>
            <span className="text-xs font-bold text-secondary-sky tracking-widest uppercase mt-1">
              Traveled to {current.destination}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-white hover:bg-primary-blue hover:text-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary-blue w-6' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-white hover:bg-primary-blue hover:text-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
