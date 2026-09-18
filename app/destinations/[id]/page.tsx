import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import Destination from '@/models/Destination';
import Package from '@/models/Package';
import Hotel from '@/models/Hotel';
import PackageCard from '@/components/PackageCard';
import { MapPin, Calendar, Compass, Backpack, Landmark, ArrowRight, HelpCircle, Hotel as HotelIcon } from 'lucide-react';

interface DestinationPageProps {
  params: Promise<{
    id: string;
  }>;
}

const mockDestinationsMap: Record<string, any> = {
  kashmir: {
    _id: 'd1',
    name: 'Kashmir',
    slug: 'kashmir',
    image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'March to October',
    overview: 'Known as the "Paradise on Earth", Kashmir is famous for its scenic meadows, snow-capped mountains, pristine lakes, and warm hospitality. From cruising in traditional wooden Shikara boats on Srinagar\'s Dal Lake to Gondola rides in Gulmarg, Kashmir is a dream come true for nature lovers.',
    attractions: ['Srinagar Mughal Gardens', 'Gulmarg Ski Resort', 'Pahalgam Valley of Shepherds', 'Sonamarg Meadow of Gold'],
    activities: ['Shikara Boat Cruising', 'Gondola Cable Car Ride', 'White Water Rafting in Lidder River', 'Local Saffron & Handicraft Shopping'],
    travelTips: [
      'Carry woolens even in summer as evenings can get quite cool.',
      'Only postpaid mobile connections work in the Kashmir region.',
      'Negotiate rates beforehand for horse rides and local taxis.'
    ],
    isDomestic: true,
  },
  maldives: {
    _id: 'd4',
    name: 'Maldives',
    slug: 'maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'November to April',
    overview: 'Maldives is an archipelago of over 1,000 coral islands, famous for its luxurious overwater bungalows, white sand beaches, and thriving marine life. It is the ultimate global spot for romance, snorkeling, and deep-sea diving in private island resorts.',
    attractions: ['Male Atolls & Fish Market', 'Maafushi Local Island', 'Bioluminescent Beach in Vaadhoo', 'Banana Reef Diving Spot'],
    activities: ['Coral Reef Snorkeling', 'Sunset Dolphin Cruises', 'Couple Water Spa Treatments', 'Scuba Diving'],
    travelTips: [
      'Maldives is a Muslim country; dress modestly when visiting local inhabited islands.',
      'US Dollars are widely accepted across all resorts and islands.',
      'Seaplanes only fly during daylight hours, plan flights accordingly.'
    ],
    isDomestic: false,
  },
  dubai: {
    _id: 'd5',
    name: 'Dubai',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    bestTimeToVisit: 'October to April',
    overview: 'Dubai is a city of high-tech wonders, record-breaking architecture, luxury shopping, and vibrant nightlife. Experience a roller-coaster dune bashing ride in the desert, shop in traditional gold souks, and enjoy panoramic views from Burj Khalifa.',
    attractions: ['Burj Khalifa (124th & 148th Floor)', 'The Dubai Mall & Aquarium', 'Palm Jumeirah & Atlantis Resort', 'Jumeirah Beach'],
    activities: ['Desert Dune Bashing & BBQ', 'Marina Dhow Cruise Dinner', 'Skydiving over Palm Jumeirah', 'Aquaventure Waterpark Rides'],
    travelTips: [
      'Taxis are the most convenient mode of travel, but the Metro is highly cost-effective.',
      'Respect local customs, especially during holy months like Ramadan.',
      'Check visa requirements online; many passports get visa-on-arrival.'
    ],
    isDomestic: false,
  }
};

const mockPackagesList = [
  {
    _id: 'p1',
    name: 'Scenic Paradise Kashmir Tour',
    slug: 'scenic-paradise-kashmir-tour',
    description: 'Breathe the fresh mountain air of Gulmarg, enjoy a romantic shikara ride on Dal Lake, and explore the golden saffron fields of Pampore.',
    duration: '5 Days / 4 Nights',
    price: 24999,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=85'],
    category: 'family',
    destination: { name: 'Kashmir' },
  },
  {
    _id: 'p2',
    name: 'Luxury Maldives Overwater Escapes',
    slug: 'luxury-maldives-overwater-escapes',
    description: 'Indulge in premium overwater villas, enjoy sunset dining by the lagoons, and dive into vibrant marine life in crystalline waters.',
    duration: '6 Days / 5 Nights',
    price: 84999,
    rating: 5.0,
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=85'],
    category: 'honeymoon',
    destination: { name: 'Maldives' },
  },
  {
    _id: 'p3',
    name: 'Vibrant Dubai Skyline & Desert Safari',
    slug: 'vibrant-dubai-skyline-desert-safari',
    description: 'Explore the high-tech marvels of downtown Dubai, shop in local gold souks, and take in the thrilling roller coaster sand dune ride.',
    duration: '5 Days / 4 Nights',
    price: 49999,
    rating: 4.7,
    images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=85'],
    category: 'luxury',
    destination: { name: 'Dubai' },
  },
];

const mockHotelsList = [
  {
    _id: 'h1',
    name: 'The Royal Houseboats',
    location: 'Dal Lake, Srinagar, Kashmir',
    rating: 4,
    description: 'Traditional Kashmiri wooden houseboats offering luxurious stays and local hospitality.',
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'],
    amenities: ['Free Wi-Fi', 'Room Service', 'Heating', 'Kashmiri Kehwa']
  },
  {
    _id: 'h2',
    name: 'The Sun Siyam Resort',
    location: 'Noonu Atoll, Maldives',
    rating: 5,
    description: 'Five-star luxury resort featuring private overwater villas, infinity pools, and dining options.',
    images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80'],
    amenities: ['Infinity Pool', 'Private Beach', 'Spa Center', 'All Inclusive Meals']
  },
  {
    _id: 'h3',
    name: 'Novotel Bur Dubai',
    location: 'Healthcare City, Dubai',
    rating: 4,
    description: 'Modern hotel located in the heart of Dubai Bur, featuring rooftop pools and fitness amenities.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'],
    amenities: ['Rooftop Pool', 'Free Wi-Fi', 'Gym', 'Metro access']
  }
];

export default async function DestinationDetailPage({ params }: DestinationPageProps) {
  const { id } = await params;
  let dest: any = null;
  let relatedPkgs: any[] = [];
  let matchingHotels: any[] = [];

  try {
    await connectToDatabase();
    dest = await Destination.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }, { slug: id.toLowerCase() }]
    }).lean();

    if (dest) {
      relatedPkgs = await Package.find({ destination: dest._id })
        .populate('destination')
        .lean();

      // Find hotels that contain destination name in their location
      matchingHotels = await Hotel.find({
        location: { $regex: new RegExp(dest.name, 'i') }
      }).lean();
    }
  } catch (error) {
    console.error('Database fetch error in destination detail page:', error);
  }

  // Fallback map check
  if (!dest) {
    dest = mockDestinationsMap[id.toLowerCase()];
    if (dest) {
      relatedPkgs = mockPackagesList.filter(
        (p) => p.destination.name.toLowerCase() === dest.name.toLowerCase()
      );
      matchingHotels = mockHotelsList.filter(
        (h) => h.location.toLowerCase().includes(dest.name.toLowerCase())
      );
    }
  }

  if (!dest) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Large Image Banner */}
      <section className="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src={dest.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'}
          alt={dest.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-slate-900/40 to-slate-950/20 z-1" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white z-10">
          <div className="flex items-center justify-center gap-1.5 self-start px-4 py-1.5 rounded-full text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/10 mb-4 shadow-sm w-fit mx-auto">
            <Calendar className="w-4 h-4 text-accent-gold" />
            <span>Best Time: {dest.bestTimeToVisit}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
            Explore {dest.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-semibold">
            {dest.isDomestic ? 'Domestic Tour Destination' : 'International Wonders Guide'}
          </p>
        </div>
      </section>

      {/* 2. Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-4">About {dest.name}</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {dest.overview}
              </p>
            </div>

            {/* Attractions */}
            {dest.attractions && dest.attractions.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Landmark className="w-5.5 h-5.5 text-primary-blue" /> Major Attractions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.attractions.map((attr: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                    >
                      <Compass className="w-5 h-5 text-secondary-sky shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{attr}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">MUST VISIT</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {dest.activities && dest.activities.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Backpack className="w-5.5 h-5.5 text-tropical-teal" /> Popular Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dest.activities.map((act: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-center text-sm text-slate-600 font-medium p-2 bg-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-tropical-teal shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels nearby */}
            {matchingHotels.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <HotelIcon className="w-5.5 h-5.5 text-primary-blue" /> Recommended Lodgings in {dest.name}
                </h3>
                <div className="space-y-4">
                  {matchingHotels.map((hotel: any) => (
                    <div
                      key={hotel._id}
                      className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{hotel.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {hotel.location}
                        </p>
                      </div>
                      <Link
                        href={`/packages`}
                        className="px-4 py-2 text-xs font-bold text-primary-blue bg-slate-50 hover:bg-primary-blue hover:text-white rounded-xl border border-slate-200 hover:border-primary-blue transition-all"
                      >
                        View Stays
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Tips & Related Packages */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            {/* Travel Tips */}
            {dest.travelTips && dest.travelTips.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <HelpCircle className="w-4.5 h-4.5 text-accent-gold" /> Travel Tips
                </h3>
                <ul className="space-y-3 text-xs text-slate-500 leading-relaxed font-semibold">
                  {dest.travelTips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex gap-2 bg-slate-50 p-3 rounded-xl">
                      <span className="text-accent-gold text-sm font-bold shrink-0">!</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Consultation CTA */}
            <div className="gradient-primary p-6 rounded-3xl text-white space-y-4 shadow-md text-center">
              <h4 className="text-lg font-bold">Plan a custom trip to {dest.name}?</h4>
              <p className="text-xs text-slate-200">
                Let our travel experts craft a tailored itinerary just for you. Get a free consultation today.
              </p>
              <Link
                href="/contact"
                className="w-full inline-block text-center py-3 rounded-xl font-extrabold text-slate-900 bg-accent-gold hover:bg-white transition-all text-xs"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Related Packages Section */}
        {relatedPkgs.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-800">
                Related {dest.name} Packages
              </h3>
              <Link
                href="/packages"
                className="text-xs font-bold text-primary-blue hover:text-secondary-sky flex items-center gap-1"
              >
                All Packages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPkgs.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
