import React from 'react';
import { Compass } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Background radial soft pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        {/* Modern premium spinning travel container */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Animated pulse ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-blue/10 animate-ping" />
          {/* Spin outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-blue border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000" />
          {/* Inner compass icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 shadow-md">
            <Compass className="w-8 h-8 text-primary-blue animate-pulse" />
          </div>
        </div>

        {/* Brand/Loading text */}
        <h2 className="text-lg font-black text-slate-800 tracking-wide">MSK Holiday&apos;s</h2>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-widest animate-pulse">
          Loading amazing memories...
        </p>
      </div>
    </div>
  );
}
