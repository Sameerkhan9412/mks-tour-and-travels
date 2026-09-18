import React from 'react';

export default function PackagesLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header Skeleton */}
      <section className="relative py-20 bg-slate-900 text-center overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          <div className="h-6 w-32 bg-slate-700 rounded-full mb-4" />
          <div className="h-10 w-64 bg-slate-700 rounded-xl mb-4" />
          <div className="h-4 w-96 bg-slate-700 rounded-lg" />
        </div>
      </section>

      {/* Directory Layout Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
            <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
            <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse mt-6" />
          </div>

          {/* Listing Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[480px]">
                  {/* Image wrapper skeleton */}
                  <div className="relative h-60 w-full bg-slate-200 animate-pulse shrink-0" />
                  {/* Details skeleton */}
                  <div className="flex flex-col flex-1 p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                      <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-3.5 w-full bg-slate-100 rounded animate-pulse" />
                      <div className="h-3.5 w-5/6 bg-slate-100 rounded animate-pulse" />
                    </div>
                    {/* Price and Action skeleton */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <div className="space-y-1">
                        <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
                        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                      </div>
                      <div className="w-11 h-11 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
