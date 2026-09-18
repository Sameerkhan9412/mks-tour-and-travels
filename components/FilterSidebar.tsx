'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RefreshCw, Eye, ArrowUpDown, Calendar, Map, CheckCircle2 } from 'lucide-react';

interface FilterSidebarProps {
  destinationsList: Array<{ _id: string; name: string; slug: string }>;
}

export default function FilterSidebar({ destinationsList }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state to keep track of fields
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [domestic, setDomestic] = useState(searchParams.get('domestic') || 'all');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');

  // Sync state if URL changes externally
  useEffect(() => {
    setDestination(searchParams.get('destination') || '');
    setCategory(searchParams.get('category') || 'all');
    setDomestic(searchParams.get('domestic') || 'all');
    setDuration(searchParams.get('duration') || 'all');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'popular');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (destination) params.set('destination', destination);
    if (category && category !== 'all') params.set('category', category);
    if (domestic && domestic !== 'all') params.set('domestic', domestic);
    if (duration && duration !== 'all') params.set('duration', duration);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sort) params.set('sort', sort);

    router.push(`/packages?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setDestination('');
    setCategory('all');
    setDomestic('all');
    setDuration('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('popular');
    router.push('/packages');
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6 sticky top-28">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-primary-blue" />
          Filter Tour Packages
        </h3>
        <button
          onClick={handleClear}
          className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Destination select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Destination</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 bg-white"
        >
          <option value="">All Destinations</option>
          {destinationsList.map((dest) => (
            <option key={dest._id} value={dest.slug}>
              {dest.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 bg-white"
        >
          <option value="all">All Tour Categories</option>
          <option value="uttarakhand">Uttarakhand</option>
          <option value="kashmir">Kashmir</option>
          <option value="himachal-pradesh">Himachal Pradesh</option>
          <option value="goa">Goa</option>
          <option value="rajasthan">Rajasthan</option>
          <option value="ladakh">Ladakh</option>
          <option value="spiti">Spiti</option>
          <option value="andaman-nicobar">Andaman & Nicobar</option>
          <option value="kerala">Kerala</option>
          <option value="sikkim">Sikkim</option>
        </select>
      </div>

      {/* Duration select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 bg-white"
        >
          <option value="all">Any Duration</option>
          <option value="short">Short (1-4 Days)</option>
          <option value="medium">Medium (5-8 Days)</option>
          <option value="long">Long (9+ Days)</option>
        </select>
      </div>

      {/* Budget range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Price Range (₹)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700"
          />
        </div>
      </div>

      {/* Sorting select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5" /> Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 bg-white"
        >
          <option value="popular">Popularity</option>
          <option value="latest">Latest Packages</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary-blue hover:bg-opacity-95 transition-all duration-200 cursor-pointer shadow-md text-center"
      >
        Apply Filters
      </button>
    </div>
  );
}
