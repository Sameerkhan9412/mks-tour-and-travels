import React from 'react';
import { connectToDatabase } from '@/lib/db';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Category from '@/models/Category';
import PackageCard from '@/components/PackageCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Compass, AlertCircle } from 'lucide-react';

interface PackagesPageProps {
  searchParams: Promise<{
    destination?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    duration?: string;
    domestic?: string;
    sort?: string;
  }>;
}

// Fallback Indian Packages
const defaultFallbackPackages = [
  {
    _id: 'p1',
    name: 'Kashmir Weekend Tour 3N/4D',
    slug: 'kashmir-weekend-tour-3n-4d',
    description:
      'Experience the serene beauty of Kashmir on a refreshing weekend getaway. Dal Lake Shikara ride, houseboat stay, Gulmarg Gondola and Pahalgam excursions.',
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
  {
    _id: 'p4',
    name: 'Kerala Serene Backwaters & Munnar Hills',
    slug: 'kerala-serene-backwaters-munnar-hills',
    description:
      "Discover God's Own Country. Breathe the misty aroma of Munnar tea plantations and cruise the backwaters of Alleppey in a private houseboat.",
    duration: '05 Days/ 04 Nights',
    price: 21500,
    regularPrice: 26000,
    rating: 4.9,
    images: ['https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=800&q=85'],
    category: 'kerala',
  },
  {
    _id: 'p5',
    name: 'Uttarakhand Char Dham & Rishikesh Spiritual Trail',
    slug: 'uttarakhand-char-dham-rishikesh-spiritual-trail',
    description:
      'Divine evening Ganga Aarti in Rishikesh, scenic Himalayan valleys, and serene mountain hill vistas of Mussoorie.',
    duration: '05 Days/ 04 Nights',
    price: 19500,
    regularPrice: 24000,
    rating: 4.8,
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85'],
    category: 'uttarakhand',
  },
];

export default async function PackagesPage({ searchParams }: PackagesPageProps) {
  // Prevent tree-shaking of imported models
  const _registerModels = [Destination.modelName, Hotel.modelName, Category.modelName];

  let destinationsList: any[] = [];
  let packagesList: any[] = [];

  const resolvedParams = await searchParams;
  const { destination, category, minPrice, maxPrice, duration, domestic, sort } = resolvedParams;

  try {
    await connectToDatabase();

    // Fetch destinations for filter select dropdown
    destinationsList = await Destination.find({}, 'name slug').sort({ name: 1 }).lean();

    const query: any = {};

    // 1. Destination filter
    if (destination) {
      const dest = await Destination.findOne({ slug: destination.toLowerCase() });
      if (dest) {
        query.destination = dest._id;
      } else {
        packagesList = [];
      }
    }

    // 2. Category filter
    if (category && category !== 'all') {
      const catSlug = category.toLowerCase().trim();
      const matchedCat = await Category.findOne({
        $or: [{ slug: catSlug }, { name: { $regex: new RegExp(`^${catSlug}$`, 'i') } }],
      });

      if (matchedCat) {
        query.$or = [
          { category: matchedCat.slug },
          { category: matchedCat.name.toLowerCase() },
          { categoryRef: matchedCat._id },
        ];
      } else {
        query.category = { $regex: new RegExp(`^${catSlug}$`, 'i') };
      }
    }

    // 3. Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Duration filter
    if (duration && duration !== 'all') {
      if (duration === 'short') {
        query.durationDays = { $lte: 4 };
      } else if (duration === 'medium') {
        query.durationDays = { $gte: 5, $lte: 8 };
      } else if (duration === 'long') {
        query.durationDays = { $gte: 9 };
      }
    }

    // Determine Sort options
    let sortQuery: any = { featured: -1, createdAt: -1 };
    if (sort === 'priceAsc') {
      sortQuery = { price: 1 };
    } else if (sort === 'priceDesc') {
      sortQuery = { price: -1 };
    } else if (sort === 'latest') {
      sortQuery = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortQuery = { rating: -1, price: 1 };
    }

    if (!destination || query.destination) {
      packagesList = await Package.find(query)
        .populate('destination')
        .populate('hotels')
        .populate('categoryRef')
        .sort(sortQuery)
        .lean();
    }
  } catch (error) {
    console.error('Database fetch error in packages list page:', error);
  }

  // Cast lean outputs to simple structures
  let cleanPackages = JSON.parse(JSON.stringify(packagesList));
  const cleanDestinations = JSON.parse(JSON.stringify(destinationsList));

  // Fallback if DB is empty and user is browsing
  if (cleanPackages.length === 0 && !destination && (!category || category === 'all') && !minPrice && !maxPrice) {
    cleanPackages = defaultFallbackPackages;
  } else if (cleanPackages.length === 0 && category && category !== 'all') {
    cleanPackages = defaultFallbackPackages.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-900 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-blue/30 via-slate-900 to-slate-950 opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-black tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            100% India Tours
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Explore India Tour Packages
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Discover curated itineraries across Kashmir, Uttarakhand, Himachal Pradesh, Spiti, Rajasthan, Kerala, and beyond.
          </p>
        </div>
      </section>

      {/* Main Content: Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-4">
            <FilterSidebar destinationsList={cleanDestinations} />
          </aside>

          {/* Packages Listing Section */}
          <main className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Showing {cleanPackages.length} {cleanPackages.length === 1 ? 'Package' : 'Packages'}
              </span>
              {category && category !== 'all' && (
                <span className="text-xs font-extrabold text-primary-blue bg-primary-blue/10 px-3 py-1 rounded-full uppercase">
                  Category: {category}
                </span>
              )}
            </div>

            {cleanPackages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Packages Match Your Filters</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your selected category, price range, or duration to explore other available Indian tours.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cleanPackages.map((pkg: any) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
