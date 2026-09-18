import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/db';
import Package from '@/models/Package';
import Category from '@/models/Category';
import Destination from '@/models/Destination';
import Testimonial from '@/models/Testimonial';

import HeroSection from '@/components/HeroSection';
import PackageCard from '@/components/PackageCard';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import { BadgePercent, Headset, ShieldCheck, HeartHandshake, ArrowRight, Sparkles, MapPin, Compass } from 'lucide-react';

// Default 10 Indian Tour Categories fallback
const defaultCategories = [
  {
    _id: 'c1',
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'Land of Gods, Rishikesh & Himalayan Trails',
  },
  {
    _id: 'c2',
    name: 'Kashmir',
    slug: 'kashmir',
    image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=80',
    description: 'Paradise on Earth, Dal Lake & Gulmarg',
  },
  {
    _id: 'c3',
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    description: 'Manali, Shimla, Snow Valleys & Apple Groves',
  },
  {
    _id: 'c4',
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
    description: 'Sun-kissed Beaches, Cruises & Coastal Heritage',
  },
  {
    _id: 'c5',
    name: 'Rajasthan',
    slug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'Royal Palaces, Desert Sand Dunes & Forts',
  },
  {
    _id: 'c6',
    name: 'Ladakh',
    slug: 'ladakh',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'Pangong Tso, Khardung La & High Passes',
  },
  {
    _id: 'c7',
    name: 'Spiti',
    slug: 'spiti',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    description: 'The Middle Land, Ancient Gompas & Cold Desert',
  },
  {
    _id: 'c8',
    name: 'Andaman & Nicobar',
    slug: 'andaman-nicobar',
    image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
    description: 'Coral Reefs, Tropical Islands & Scuba Diving',
  },
  {
    _id: 'c9',
    name: 'Kerala',
    slug: 'kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: "God's Own Country, Backwaters & Munnar Hills",
  },
  {
    _id: 'c10',
    name: 'Sikkim',
    slug: 'sikkim',
    image: 'https://images.unsplash.com/photo-1622308644420-a75d5069f1d0?auto=format&fit=crop&w=800&q=80',
    description: 'Kanchenjunga Vistas & Buddhist Monasteries',
  },
];

const mockPackages = [
  {
    _id: 'p1',
    name: 'Kashmir Weekend Tour 3N/4D',
    slug: 'kashmir-weekend-tour-3n-4d',
    description:
      'Experience the serene beauty of Kashmir on a refreshing weekend getaway. Dal Lake Shikara ride, houseboat stay, Gulmarg and Pahalgam excursions.',
    duration: '04 Days/ 03 Nights',
    price: 18000,
    regularPrice: 22000,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=85'],
    category: 'kashmir',
  },
  {
    _id: 'p2',
    name: 'Spiti Valley Road Trip & Monastery Circuit',
    slug: 'spiti-valley-road-trip-monastery-circuit',
    description:
      'High-altitude Himalayan cold desert road trip. Ancient 1000-year-old Key & Tabo monasteries, and turquoise Chandratal Lake.',
    duration: '07 Days/ 06 Nights',
    price: 26500,
    regularPrice: 32000,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=85'],
    category: 'spiti',
  },
  {
    _id: 'p3',
    name: 'Royal Rajasthan Heritage & Desert Forts',
    slug: 'royal-rajasthan-heritage-desert-forts',
    description:
      'Grand royal palaces of Jaipur, Golden Fort of Jaisalmer, and Thar Desert camel safari with cultural bonfire evenings.',
    duration: '06 Days/ 05 Nights',
    price: 24500,
    regularPrice: 29999,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=85'],
    category: 'rajasthan',
  },
];

const mockTestimonials = [
  {
    _id: 't1',
    name: 'Amit & Priya Sen',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    review:
      'Our tour to Kashmir was seamless and beautifully curated! The houseboat stays, drivers, and Gulmarg Gondola ride were top-notch. Truly paradise on earth.',
    rating: 5,
    destination: 'Kashmir',
  },
  {
    _id: 't2',
    name: 'Rohit Verma',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    review:
      'The Spiti Valley circuit organized by MSK Holidays was exceptional. Punctual drivers, safe mountain navigation, and stunning homestay experiences.',
    rating: 5,
    destination: 'Spiti',
  },
  {
    _id: 't3',
    name: 'Dr. Sunita & Rajesh Nair',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    review:
      'We loved our Rajasthan heritage package. The royal haveli in Jaipur and luxury desert camp in Jaisalmer made our family holiday unforgettable.',
    rating: 5,
    destination: 'Rajasthan',
  },
];

export default async function HomePage() {
  let categories: any[] = [];
  let packages: any[] = [];
  let testimonials: any[] = [];

  try {
    await connectToDatabase();
    categories = await Category.find().sort({ order: 1, name: 1 }).lean();
    packages = await Package.find({ featured: true }).sort({ createdAt: -1 }).limit(6).lean();
    testimonials = await Testimonial.find().limit(5).lean();
  } catch (error) {
    console.error('Database fetch error in homepage, using mock data:', error);
  }

  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayPackages = packages.length > 0 ? packages : mockPackages;
  const displayTestimonials = testimonials.length > 0 ? testimonials : mockTestimonials;

  const features = [
    {
      icon: <BadgePercent className="w-8 h-8 text-accent-gold" />,
      title: 'Best Price Guarantee',
      desc: 'Direct partnerships with local Indian hoteliers and drivers mean transparent rates with no hidden fees.',
    },
    {
      icon: <Headset className="w-8 h-8 text-secondary-sky" />,
      title: '24/7 Dedicated Support',
      desc: 'Round-the-clock ground assistance throughout your journey across the Himalayas and Pan-India.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-tropical-teal" />,
      title: 'Verified & Sanitized Stays',
      desc: 'Every houseboat, heritage haveli, and mountain resort is hand-checked for safety and hygiene.',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-rose-500" />,
      title: '100% Customized Itineraries',
      desc: 'Flexibility to tailor your days, stops, and activities to your personal rhythm and preferences.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Inquiry Widget */}
      <HeroSection />

      {/* 2. Tour Package Categories (India Only) */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-primary-blue/10 text-primary-blue">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold tracking-widest text-primary-blue uppercase">
                  Explore By Region
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                India Tour Package Categories
              </h2>
            </div>
            <Link
              href="/packages"
              className="mt-4 md:mt-0 font-bold text-xs uppercase tracking-wider text-primary-blue hover:text-secondary-sky flex items-center gap-1.5 transition-colors"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Categories matching the 10 Indian states */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {displayCategories.map((cat: any) => (
              <Link
                key={cat.slug || cat._id}
                href={`/packages?category=${cat.slug}`}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900 border border-slate-200/70"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-sm font-black tracking-tight leading-tight text-white group-hover:text-accent-gold transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-300 block mt-0.5 font-medium">
                    View Packages →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured India Packages Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-extrabold tracking-widest text-primary-blue uppercase bg-primary-blue/10 px-4 py-1.5 rounded-full">
                Handpicked Escapes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 leading-tight tracking-tight">
                Featured India Tour Packages
              </h2>
            </div>
            <Link
              href="/packages"
              className="mt-4 md:mt-0 font-bold text-xs uppercase tracking-wider text-primary-blue hover:text-secondary-sky flex items-center gap-1.5 transition-colors"
            >
              View All Tour Packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages.map((pkg: any) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Book With Us Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full">
              Trust &amp; Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Why Travelers Choose MSK Holiday&apos;s
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              We take the stress out of planning so you can focus on building lifelong memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="mb-5 p-3 rounded-2xl bg-slate-900/60 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Happy Travelers Testimonials */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold tracking-widest text-primary-blue uppercase bg-white px-4 py-1.5 rounded-full shadow-xs">
              Client Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Our Travelers Say
            </h2>
          </div>

          <TestimonialsCarousel testimonials={displayTestimonials} />
        </div>
      </section>
    </div>
  );
}
