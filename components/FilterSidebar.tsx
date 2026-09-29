'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RefreshCw, ArrowUpDown } from 'lucide-react';
import axios from 'axios';

interface CategoryItem {
  _id?: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categoriesList?: CategoryItem[];
}

export default function FilterSidebar({ categoriesList = [] }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dynamic categories state initialized from server props
  const [categories, setCategories] = useState<CategoryItem[]>(categoriesList);

  // Local state to keep track of fields
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');

  // Update categories whenever server props change or fetch directly from DB API
  useEffect(() => {
    if (categoriesList && categoriesList.length > 0) {
      setCategories(categoriesList);
    }

    axios
      .get('/api/categories')
      .then((res) => {
        if (res.data?.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error('Failed to load dynamic categories in filter:', err);
      });
  }, [categoriesList]);

  // Sync state if URL changes externally
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
    setDuration(searchParams.get('duration') || 'all');
    setSort(searchParams.get('sort') || 'popular');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (category && category !== 'all') params.set('category', category);
    if (duration && duration !== 'all') params.set('duration', duration);
    if (sort) params.set('sort', sort);

    router.push(`/packages?${params.toString()}`, { scroll: false });
  };

  const handleClear = () => {
    setCategory('all');
    setDuration('all');
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
          className="text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Clear All
        </button>
      </div>

      {/* Dynamic Category select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 bg-white"
        >
          <option value="all">All Tour Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug || cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
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
          <option value="durationAsc">Duration: Short to Long</option>
          <option value="durationDesc">Duration: Long to Short</option>
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
