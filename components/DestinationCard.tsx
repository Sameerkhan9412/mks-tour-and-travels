'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Compass, Calendar } from 'lucide-react';

interface DestinationData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  bestTimeToVisit: string;
  attractions: string[];
}

export default function DestinationCard({ destination }: { destination: DestinationData }) {
  const attractionsCount = destination.attractions?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative h-[400px] w-full rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Background Image */}
      <Image
        src={destination.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
        alt={destination.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />

      {/* Dark Shroud Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-slate-900/30 to-slate-950/10 opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Card Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
        {/* Best Time badge */}
        <div className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] font-bold text-white bg-white/25 backdrop-blur-md border border-white/20 mb-3 shadow-inner">
          <Calendar className="w-3 h-3 text-accent-gold" />
          <span>{destination.bestTimeToVisit}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-white tracking-wide mb-1 flex items-center gap-2">
          {destination.name}
        </h3>

        {/* Attractions count and Link */}
        <div className="flex items-center justify-between text-xs text-slate-300 mt-2 border-t border-white/10 pt-3">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-secondary-sky" />
            {attractionsCount > 0 ? `${attractionsCount} Attractions` : 'Featured Spot'}
          </span>
          <Link
            href={`/destinations/${destination.slug}`}
            className="font-bold text-white group-hover:text-accent-gold transition-colors duration-200"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
