import React from 'react';
import { connectToDatabase } from '@/lib/db';
import Destination from '@/models/Destination';
import DestinationCard from '@/components/DestinationCard';
import { Map, MapPin } from 'lucide-react';

const mockDestinations = [
  { _id: 'd1', name: 'Kashmir', slug: 'kashmir', image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'March to October', attractions: ['Srinagar', 'Gulmarg', 'Pahalgam'], isDomestic: true },
  { _id: 'd2', name: 'Goa', slug: 'goa', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'November to February', attractions: ['Calangute', 'Baga', 'Dudhsagar'], isDomestic: true },
  { _id: 'd3', name: 'Kerala', slug: 'kerala', image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'September to March', attractions: ['Munnar', 'Alleppey Houseboats', 'Wayanad'], isDomestic: true },
  { _id: 'd4', name: 'Maldives', slug: 'maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'November to April', attractions: ['Male Atolls', 'Maafushi Island'], isDomestic: false },
  { _id: 'd5', name: 'Dubai', slug: 'dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'October to April', attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Desert Safari'], isDomestic: false },
  { _id: 'd6', name: 'Bali', slug: 'bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', bestTimeToVisit: 'April to October', attractions: ['Ubud Rice Terraces', 'Uluwatu Temple', 'Seminyak'], isDomestic: false },
];

export default async function DestinationsPage() {
  let destinations: any[] = [];

  try {
    await connectToDatabase();
    destinations = await Destination.find().sort({ name: 1 }).lean();
  } catch (error) {
    console.error('Database fetch error in destinations list, using mock data:', error);
  }

  const displayDestinations = destinations.length > 0 ? destinations : mockDestinations;

  const domestic = displayDestinations.filter((d) => d.isDomestic);
  const international = displayDestinations.filter((d) => !d.isDomestic);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 gradient-primary text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-blue via-slate-900 to-brand-dark opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-1 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-extrabold tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Wanderlust Awaits
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            Explore Destinations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-medium">
            Discover breathtaking places, plan your travel itinerary, and book unforgettable custom vacation packages.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Domestic */}
        {domestic.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <MapPin className="w-6 h-6 text-primary-blue" />
              <h2 className="text-2xl font-black text-primary-blue">Domestic Tour Places</h2>
              <span className="text-xs font-bold text-slate-400 ml-2">({domestic.length} Locations)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {domestic.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          </div>
        )}

        {/* International */}
        {international.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <Map className="w-6 h-6 text-secondary-sky" />
              <h2 className="text-2xl font-black text-primary-blue">International Wonders</h2>
              <span className="text-xs font-bold text-slate-400 ml-2">({international.length} Locations)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {international.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
