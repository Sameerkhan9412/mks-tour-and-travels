import React from 'react';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Category from '@/models/Category';
import PackageDetailClient from '@/components/PackageDetailClient';

interface PackagePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fallback mock packages for India tours matching screenshots
const mockPackagesMap: Record<string, any> = {
  'kashmir-weekend-tour-3n-4d': {
    _id: 'p1',
    name: 'Kashmir Weekend Tour 3N/4D',
    slug: 'kashmir-weekend-tour-3n-4d',
    category: 'kashmir',
    description:
      "Experience the serene beauty of Kashmir on a refreshing weekend getaway. Explore the charming city of Srinagar, with its picturesque Dal Lake, historic Mughal Gardens, and bustling local markets. Enjoy a peaceful Shikara ride and stay in a traditional houseboat, adding to the magical experience. Visit the breathtaking meadows of Gulmarg or the scenic landscapes of Pahalgam, where nature's beauty unfolds at every step. This short yet delightful tour is perfect for those looking for a rejuvenating break in the heart of the Himalayas.",
    itineraryIntro:
      "Experience the serene beauty of Kashmir on a refreshing weekend getaway. Explore the charming city of Srinagar, with its picturesque Dal Lake, historic Mughal Gardens, and bustling local markets. Enjoy a peaceful Shikara ride and stay in a traditional houseboat, adding to the magical experience. Visit the breathtaking meadows of Gulmarg or the scenic landscapes of Pahalgam, where nature's beauty unfolds at every step. This short yet delightful tour is perfect for those looking for a rejuvenating break in the heart of the Himalayas.",
    duration: '04 Days/ 03 Nights',
    durationDays: 4,
    price: 18000,
    regularPrice: 22000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
    ],
    highlights: {
      travel: '04 Days/ 03 Nights',
      accommodation: '3 nights in hotels',
      meals: '4 Breakfasts, 3 Dinners',
      transport: 'Mini-Coach and Ferry',
      groupSize: 'Average 24 people',
      team: 'Expert Trip Manager',
    },
    placesYouWillSee: [
      {
        name: 'Dal Lake & Shikara',
        image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Gulmarg Meadows & Gondola',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Pahalgam Valley & Lidder',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Mughal Gardens Srinagar',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1- Srinagar: Land into the Capital',
        description:
          'Arrive at Srinagar Airport where our representative welcomes you. Transfer to your pre-booked deluxe houseboat on the tranquil waters of Dal Lake. In the late afternoon, embark on a serene Shikara ride across the lake visiting floating markets and Char Chinar. Relish traditional Kashmiri Kehwa tea and dinner.',
        activities: ['Airport Meet & Greet', 'Houseboat Check-in', 'Shikara Ride on Dal Lake', 'Kashmiri Dinner'],
      },
      {
        day: 2,
        title: 'Day 2- Srinagar: A day excursion to Pahalgam',
        description:
          'After a hearty breakfast, embark on a scenic day drive to Pahalgam (Valley of Shepherds) through picturesque saffron fields of Pampore and pine-clad hills. Stroll along the sparkling Lidder river, visit Betaab Valley or take a pony ride to Baisaran Meadow (Mini Switzerland). Return to Srinagar for overnight stay.',
        activities: ['Saffron Fields visit', 'Pahalgam Valley', 'Lidder River walk', 'Betaab Valley excursion'],
      },
      {
        day: 3,
        title: 'Day 3- Srinagar: A family outing to Gulmarg',
        description:
          'Head out for an exhilarating excursion to Gulmarg (Meadow of Flowers). Ride the famous Gulmarg Gondola (Asia’s highest cable car) up to Kongdoori and Apharwat Peak for breathtaking views of snow-capped peaks. Enjoy snow sledging, photography, and gentle meadow walks before returning to Srinagar.',
        activities: ['Gulmarg Gondola Ride', 'Snow activities', 'Meadow walk', 'Local Kashmiri Handicraft shopping'],
      },
      {
        day: 4,
        title: 'Day 4- Srinagar: Departure from Srinagar',
        description:
          'Savor your last morning breakfast with mountain views. Visit the grand Mughal Gardens — Nishat Bagh (Garden of Pleasure) and Shalimar Bagh (Abode of Love). Afterwards, our driver will drop you at Srinagar Airport with cherished memories of paradise.',
        activities: ['Mughal Gardens visit', 'Local Walnut & Shawl market', 'Airport Drop-off'],
      },
    ],
    included: [
      'Accommodation in Selected Hotel',
      'All State Taxes, Toll Taxes, Parking fees, and Driver Charges',
      'Break Fast and Dinner',
      'Sightseeing as per Itinerary',
      'Transportation in Selected Mode of Transport',
    ],
    excluded: [
      'Exclusions Air / Train Fare',
      'Any private expenses',
      'Entry / Camera fees to any sightseeing Place',
      'Guide Service Fees',
      'Laundry Fees',
      'Sightseeing of any place not mentioned in the itinerary',
    ],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Srinagar,Jammu+and+Kashmir&t=&z=11&ie=UTF8&iwloc=&output=embed',
  },
  'spiti-valley-road-trip-monastery-circuit': {
    _id: 'p2',
    name: 'Spiti Valley Road Trip & Monastery Circuit',
    slug: 'spiti-valley-road-trip-monastery-circuit',
    category: 'spiti',
    description:
      'Embark on the ultimate high-altitude adventure into the mystical Spiti Valley. Traverse rugged riverbeds, ancient 1000-year-old cliff monasteries like Key & Tabo, and marvel at the surreal turquoise Chandratal Lake.',
    itineraryIntro:
      'A soul-stirring expedition into the Himalayan cold desert. Experience high-altitude stargazing, traditional homestays, fossil hunting, and crossing the legendary Kunzum Pass.',
    duration: '07 Days/ 06 Nights',
    durationDays: 7,
    price: 26500,
    regularPrice: 32000,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=85',
    ],
    highlights: {
      travel: '07 Days/ 06 Nights',
      accommodation: '6 nights in hotels/camps',
      meals: 'Breakfast and Dinner daily',
      transport: 'Custom 4x4 SUV / Tempo',
      groupSize: 'Max 12 people',
      team: 'Certified Himalayan Road Captain',
    },
    placesYouWillSee: [
      { name: 'Key Monastery', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chandratal Lake', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80' },
    ],
    itinerary: [
      { day: 1, title: 'Day 1: Shimla to Kalpa / Sangla', description: 'Drive through apple valleys along Sutlej river to picturesque Kalpa.' },
      { day: 2, title: 'Day 2: Kalpa to Tabo Monastery', description: 'Enter Spiti Valley, visit the UNESCO heritage 1000-year-old Tabo monastery.' },
      { day: 3, title: 'Day 3: Kaza, Key Monastery & Kibber', description: 'Explore the iconic Key Gompa and the world’s highest post office at Hikkim.' },
      { day: 4, title: 'Day 4: Kaza to Chandratal Moon Lake', description: 'Cross Kunzum Pass (15,060 ft) and camp near pristine Chandratal Lake.' },
      { day: 5, title: 'Day 5: Chandratal to Manali', description: 'Traverse Rohtang Pass / Atal Tunnel and arrive in lush green Manali.' },
    ],
    included: [
      'Accommodation in Standard Hotels & Swiss Tents',
      'Experienced Himalayan Driver & 4x4 Vehicle',
      'Daily Breakfast & Dinner',
      'Inner Line Permits and Toll Charges',
    ],
    excluded: [
      'Air/Train fare to/from origin',
      'Personal insurance and emergency evacuation',
      'Lunch and extra expenses',
    ],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kaza,Spiti&t=&z=9&ie=UTF8&iwloc=&output=embed',
  },
  'royal-rajasthan-heritage-desert-forts': {
    _id: 'p3',
    name: 'Royal Rajasthan Heritage & Desert Forts',
    slug: 'royal-rajasthan-heritage-desert-forts',
    category: 'rajasthan',
    description:
      'Step into the land of maharajas. Explore the Pink City of Jaipur, the Golden Fort and desert sand dunes of Jaisalmer, and the romantic lake palaces of Udaipur.',
    itineraryIntro:
      'Experience unparalleled Rajput hospitality, majestic fortresses, camel dune safaris under star-lit desert skies, and folk music celebrations.',
    duration: '06 Days/ 05 Nights',
    durationDays: 6,
    price: 24500,
    regularPrice: 29999,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=85',
    ],
    highlights: {
      travel: '06 Days/ 05 Nights',
      accommodation: 'Heritage Hotels & Luxury Desert Camp',
      meals: 'Buffet Breakfast & Rajasthani Dinners',
      transport: 'AC Sedan / Innova with Chauffeur',
      groupSize: 'Custom Private Family Group',
      team: 'English/Hindi Speaking Heritage Guide',
    },
    placesYouWillSee: [
      { name: 'Amber Fort Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' },
      { name: 'Thar Desert Dunes', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
    ],
    itinerary: [
      { day: 1, title: 'Day 1: Arrival in Jaipur - Pink City', description: 'Arrive in Jaipur, check into heritage haveli, visit City Palace and Hawa Mahal.' },
      { day: 2, title: 'Day 2: Forts of Jaipur & Nahargarh Sunset', description: 'Explore Amber Fort, mirror palaces, and watch sunset from Nahargarh.' },
      { day: 3, title: 'Day 3: Jaipur to Jodhpur - Blue City', description: 'Drive to Jodhpur, tour Mehrangarh Fort and Jaswant Thada.' },
      { day: 4, title: 'Day 4: Jodhpur to Jaisalmer Sam Sand Dunes', description: 'Arrive in Jaisalmer desert camp, enjoy camel safari and Kalbeliya folk dance.' },
      { day: 5, title: 'Day 5: Jaisalmer Golden Fort & Havelis', description: 'Explore Sonar Qila, Patwon ki Haveli, and Gadisar Lake.' },
    ],
    included: [
      '5 Nights accommodation in selected heritage hotels & desert camp',
      'Daily Breakfast & 5 traditional Dinners',
      'Camel Safari & Desert Cultural Show',
      'All toll, driver allowance, and sightseeing transfers',
    ],
    excluded: ['Monument entrance tickets', 'Airfare/Train tickets', 'Personal expenses'],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Jaipur,Rajasthan&t=&z=10&ie=UTF8&iwloc=&output=embed',
  },
};

export default async function PackageDetailPage({ params }: PackagePageProps) {
  // Prevent tree-shaking of imported models
  const _registerModels = [Destination.modelName, Hotel.modelName, Category.modelName];

  const { id } = await params;
  let pkg: any = null;

  try {
    await connectToDatabase();
    pkg = await Package.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }, { slug: id.toLowerCase() }],
    })
      .populate('destination')
      .populate('hotels')
      .populate('categoryRef')
      .lean();
  } catch (error) {
    console.error('Error fetching package from DB, falling back to mock map:', error);
  }

  // Fallback map check
  if (!pkg) {
    pkg = mockPackagesMap[id.toLowerCase()];
  }

  if (!pkg) {
    // If user clicked another slug, try checking if it starts with kashmir or similar
    if (id.includes('kashmir')) {
      pkg = mockPackagesMap['kashmir-weekend-tour-3n-4d'];
    }
  }

  if (!pkg) {
    notFound();
  }

  // Cast Mongoose document to clean JSON
  const cleanPkg = JSON.parse(JSON.stringify(pkg));

  return (
    <div className="bg-slate-50 min-h-screen">
      <PackageDetailClient pkg={cleanPkg} />
    </div>
  );
}
