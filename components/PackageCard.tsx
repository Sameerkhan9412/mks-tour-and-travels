'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, ArrowUpRight } from 'lucide-react';

interface DestinationInfo {
  name: string;
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
  category: string;
  destination: DestinationInfo | null | string;
}

export default function PackageCard({ pkg }: { pkg: PackageData }) {
  const destName =
    pkg.destination && typeof pkg.destination === 'object'
      ? pkg.destination.name
      : 'Popular Destination';

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(pkg.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden glass-card h-full"
    >
      {/* Category Tag */}
      <span className="absolute top-4 left-4 z-10 px-3.5 py-1 text-xs font-bold tracking-wider text-primary-blue bg-white rounded-full shadow-md capitalize">
        {pkg.category}
      </span>

      {/* Package Rating */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-slate-900 bg-opacity-70 rounded-full backdrop-blur-sm shadow-md">
        <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" />
        <span>{pkg.rating.toFixed(1)}</span>
      </div>

      {/* Package Image wrapper */}
      <div className="relative h-60 w-full overflow-hidden shrink-0">
        <Image
          src={pkg.images[0] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85'}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Package Details */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-secondary-sky" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-tropical-teal" />
            <span className="truncate max-w-[150px]">{destName}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-primary-blue transition-colors duration-200 mb-2">
          {pkg.name}
        </h3>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
          {pkg.description}
        </p>

        {/* Price and Action Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              From
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-slate-900">
                {formattedPrice}
              </span>
              {pkg.regularPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ₹{pkg.regularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-50 border border-slate-200 group-hover:bg-primary-blue group-hover:border-primary-blue text-slate-700 group-hover:text-white transition-all duration-300 shadow-sm"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
