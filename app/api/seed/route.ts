import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Package from '@/models/Package';
import Testimonial from '@/models/Testimonial';
import Inquiry from '@/models/Inquiry';
import { hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key !== 'msk_seed_2026') {
      return NextResponse.json({ message: 'Forbidden: Invalid seed key' }, { status: 403 });
    }

    await connectToDatabase();

    // 1. Clean collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Destination.deleteMany({});
    await Hotel.deleteMany({});
    await Package.deleteMany({});
    await Testimonial.deleteMany({});
    await Inquiry.deleteMany({});

    // 2. Hash and seed default admin user
    const passwordHash = await hashPassword('admin1234');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@mskholidays.com',
      passwordHash,
      role: 'admin',
    });

    // 3. Seed the 10 Indian tour package categories exactly as requested in screenshot
    const categoriesData = [
      {
        name: 'Uttarakhand',
        slug: 'uttarakhand',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        description: 'Land of the Gods: sacred rivers, majestic peaks, Rishikesh, and serene hill retreats.',
        order: 1,
        featured: true,
      },
      {
        name: 'Kashmir',
        slug: 'kashmir',
        image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=80',
        description: 'Paradise on Earth: Dal Lake, snow-capped Gulmarg, Pahalgam valleys, and cozy houseboats.',
        order: 2,
        featured: true,
      },
      {
        name: 'Himachal Pradesh',
        slug: 'himachal-pradesh',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
        description: 'Apple orchards, pine forests, adventure trails, Manali, Shimla, and Dharamshala.',
        order: 3,
        featured: true,
      },
      {
        name: 'Goa',
        slug: 'goa',
        image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
        description: 'Golden sandy beaches, vibrant coastal nightlife, Portuguese architecture, and ocean cruises.',
        order: 4,
        featured: true,
      },
      {
        name: 'Rajasthan',
        slug: 'rajasthan',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        description: 'Grand royal forts, opulent palaces, desert dunes of Thar, and cultural heritage.',
        order: 5,
        featured: true,
      },
      {
        name: 'Ladakh',
        slug: 'ladakh',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        description: 'Rugged moonscapes, high altitude mountain passes, Pangong Lake, and ancient monasteries.',
        order: 6,
        featured: true,
      },
      {
        name: 'Spiti',
        slug: 'spiti',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        description: 'The Middle Land: raw cold desert beauty, dramatic mountain vistas, and Tibetan culture.',
        order: 7,
        featured: true,
      },
      {
        name: 'Andaman & Nicobar',
        slug: 'andaman-nicobar',
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80',
        description: 'Turquoise tropical waters, vibrant coral reefs, Radhanagar Beach, and scuba adventures.',
        order: 8,
        featured: true,
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=800&q=80',
        description: "God's Own Country: tranquil backwater canals, lush tea hills of Munnar, and ayurvedic retreats.",
        order: 9,
        featured: true,
      },
      {
        name: 'Sikkim',
        slug: 'sikkim',
        image: 'https://images.unsplash.com/photo-1622308644420-a75d5069f1d0?auto=format&fit=crop&w=800&q=80',
        description: 'Towering Kanchenjunga views, Buddhist monasteries, glacial lakes, and rhododendron valleys.',
        order: 10,
        featured: true,
      },
    ];

    const seededCategories = await Category.insertMany(categoriesData);
    const catMap = new Map<string, any>();
    seededCategories.forEach((cat) => catMap.set(cat.slug, cat));

    // 4. Seed India destinations
    const destinationsData = [
      {
        name: 'Kashmir',
        slug: 'kashmir',
        image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=800&q=80',
        overview: 'Paradisiacal mountain scenery, wooden houseboats, and snow activities in Gulmarg.',
        bestTimeToVisit: 'March to October',
        attractions: ['Dal Lake', 'Gulmarg Cable Car', 'Pahalgam Valley', 'Mughal Gardens'],
        activities: ['Shikara Boat cruising', 'Skiing & Snowboarding', 'Saffron farm tours'],
        isDomestic: true,
        featured: true,
      },
      {
        name: 'Goa',
        slug: 'goa',
        image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=800&q=80',
        overview: 'Golden sandy beaches, rich history, water sports, and vibrant nights.',
        bestTimeToVisit: 'November to February',
        attractions: ['Calangute Beach', 'Fort Aguada', 'Dudhsagar Waterfalls'],
        activities: ['Parasailing', 'Scuba Diving', 'Heritage Walk'],
        isDomestic: true,
        featured: true,
      },
      {
        name: 'Kerala',
        slug: 'kerala',
        image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=800&q=80',
        overview: 'Quiet backwaters, tea gardens in Munnar, and authentic ayurvedic healing centers.',
        bestTimeToVisit: 'September to March',
        attractions: ['Munnar Hills', 'Alleppey Backwater canals', 'Varkala Beach'],
        activities: ['Houseboat cruise stays', 'Ayurveda therapies', 'Tea picking'],
        isDomestic: true,
        featured: true,
      },
      {
        name: 'Ladakh',
        slug: 'ladakh',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        overview: 'High-altitude deserts, stark blue lakes, and ancient cliff monasteries.',
        bestTimeToVisit: 'May to September',
        attractions: ['Pangong Tso', 'Khardung La', 'Nubra Valley'],
        activities: ['High altitude biking', 'Monastery tours', 'Camel safari'],
        isDomestic: true,
        featured: true,
      },
      {
        name: 'Rajasthan',
        slug: 'rajasthan',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        overview: 'Royal grandeur, historic hill forts, and desert luxury camping.',
        bestTimeToVisit: 'October to March',
        attractions: ['Amber Fort Jaipur', 'Udaipur Lake Palace', 'Jaisalmer Fort'],
        activities: ['Desert camel safari', 'Heritage fort walks', 'Folk dance viewing'],
        isDomestic: true,
        featured: true,
      },
      {
        name: 'Uttarakhand',
        slug: 'uttarakhand',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        overview: 'Spiritual riverbanks, yoga centers, and snow mountain hill stations.',
        bestTimeToVisit: 'March to June & September to November',
        attractions: ['Rishikesh Ghats', 'Mussoorie Hills', 'Nainital Lake'],
        activities: ['White water rafting', 'Ganga Aarti', 'Mountain trekking'],
        isDomestic: true,
        featured: true,
      },
    ];

    const seededDestinations = await Destination.insertMany(destinationsData);
    const destMap = new Map<string, any>();
    seededDestinations.forEach((d) => destMap.set(d.slug, d));

    // 5. Seed Hotels
    const hotelsData = [
      {
        name: 'The Royal Houseboats',
        location: 'Dal Lake, Srinagar, Kashmir',
        rating: 5,
        description: 'Traditional Kashmiri carved cedar wood houseboats offering luxury stays and authentic hospitality.',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'],
        amenities: ['Free Wi-Fi', 'Room Service', 'Heating', 'Kashmiri Kehwa'],
      },
      {
        name: 'Taj Exotica Resort & Spa',
        location: 'Benaulim Beach, Goa',
        rating: 5,
        description: 'Mediterranean-style luxury resort spread across 56 acres along the Arabian Sea.',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=300&q=80'],
        amenities: ['Private Beach', 'Swimming Pool', 'Luxury Spa', 'Fine Dining'],
      },
      {
        name: 'Grand Heritage Haveli',
        location: 'Jaipur, Rajasthan',
        rating: 5,
        description: 'Royal Rajasthani heritage property with royal courtyards, marble carvings, and folk music evenings.',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'],
        amenities: ['Courtyard Dining', 'Swimming Pool', 'Cultural Shows', 'Spa'],
      },
    ];

    const seededHotels = await Hotel.insertMany(hotelsData);

    // 6. Seed Packages matching the exact screenshots
    const packagesData = [
      {
        name: 'Kashmir Weekend Tour 3N/4D',
        slug: 'kashmir-weekend-tour-3n-4d',
        destination: destMap.get('kashmir')?._id,
        category: 'kashmir',
        categoryRef: catMap.get('kashmir')?._id,
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
              'Arrive at Srinagar Airport where our representative will welcome you. Transfer to your pre-booked deluxe houseboat on the tranquil waters of Dal Lake. In the late afternoon, embark on a serene Shikara ride across the lake visiting floating markets and Char Chinar. Relish traditional Kashmiri Kehwa tea and dinner.',
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
        hotels: [seededHotels[0]._id],
        featured: true,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Srinagar,Jammu+and+Kashmir&t=&z=11&ie=UTF8&iwloc=&output=embed',
        isDomestic: true,
      },
      {
        name: 'Spiti Valley Road Trip & Monastery Circuit',
        slug: 'spiti-valley-road-trip-monastery-circuit',
        category: 'spiti',
        categoryRef: catMap.get('spiti')?._id,
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
          { day: 1, title: 'Day 1: Shimla to Kalpa / Sangla', description: 'Drive through apple valleys along Sutlej river to picturesque Kalpa.', activities: ['Scenic Drive', 'Kinnaur Kailash View'] },
          { day: 2, title: 'Day 2: Kalpa to Tabo Monastery', description: 'Enter Spiti Valley, visit the UNESCO heritage 1000-year-old Tabo monastery.', activities: ['Tabo Caves', 'Monastery walk'] },
          { day: 3, title: 'Day 3: Kaza, Key Monastery & Kibber', description: 'Explore the iconic Key Gompa and the world’s highest post office at Hikkim.', activities: ['Hikkim Postcard', 'Key Monastery tour'] },
          { day: 4, title: 'Day 4: Kaza to Chandratal Moon Lake', description: 'Cross Kunzum Pass (15,060 ft) and camp near pristine Chandratal Lake.', activities: ['High altitude pass', 'Stargazing'] },
          { day: 5, title: 'Day 5: Chandratal to Manali', description: 'Traverse Rohtang Pass / Atal Tunnel and arrive in lush green Manali.', activities: ['Atal Tunnel drive', 'Manali town walk'] },
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
          'Lunch and alcoholic drinks',
        ],
        hotels: [],
        featured: true,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Kaza,Spiti&t=&z=9&ie=UTF8&iwloc=&output=embed',
        isDomestic: true,
      },
      {
        name: 'Royal Rajasthan Heritage & Desert Forts',
        slug: 'royal-rajasthan-heritage-desert-forts',
        destination: destMap.get('rajasthan')?._id,
        category: 'rajasthan',
        categoryRef: catMap.get('rajasthan')?._id,
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
          { day: 1, title: 'Day 1: Arrival in Jaipur - Pink City', description: 'Arrive in Jaipur, check into heritage haveli, visit City Palace and Hawa Mahal.', activities: ['Hawa Mahal', 'City Palace'] },
          { day: 2, title: 'Day 2: Forts of Jaipur & Nahargarh Sunset', description: 'Explore Amber Fort, mirror palaces, and watch sunset from Nahargarh.', activities: ['Amber Fort elephant ride', 'Nahargarh sunset'] },
          { day: 3, title: 'Day 3: Jaipur to Jodhpur - Blue City', description: 'Drive to Jodhpur, tour Mehrangarh Fort and Jaswant Thada.', activities: ['Mehrangarh Fort', 'Blue city walk'] },
          { day: 4, title: 'Day 4: Jodhpur to Jaisalmer Sam Sand Dunes', description: 'Arrive in Jaisalmer desert camp, enjoy camel safari and Kalbeliya folk dance.', activities: ['Dune bashing', 'Folk dance around bonfire'] },
          { day: 5, title: 'Day 5: Jaisalmer Golden Fort & Havelis', description: 'Explore Sonar Qila, Patwon ki Haveli, and Gadisar Lake.', activities: ['Fort bazaar shopping', 'Gadisar boat ride'] },
        ],
        included: [
          '5 Nights accommodation in selected heritage hotels & desert camp',
          'Daily Breakfast & 5 traditional Dinners',
          'Camel Safari & Desert Cultural Show',
          'All toll, driver allowance, and sightseeing transfers',
        ],
        excluded: ['Monument entrance tickets', 'Airfare/Train tickets', 'Personal expenses'],
        hotels: [seededHotels[2]._id],
        featured: true,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Jaipur,Rajasthan&t=&z=10&ie=UTF8&iwloc=&output=embed',
        isDomestic: true,
      },
      {
        name: 'Kerala Serene Backwaters & Munnar Hills',
        slug: 'kerala-serene-backwaters-munnar-hills',
        destination: destMap.get('kerala')?._id,
        category: 'kerala',
        categoryRef: catMap.get('kerala')?._id,
        description:
          "Discover God's Own Country. Breathe the misty aroma of Munnar's endless tea plantations, explore wildlife in Thekkady, and cruise the palm-fringed backwaters of Alleppey in a private houseboat.",
        itineraryIntro:
          'A rejuvenating escape crafted to immerse you in tropical greenery, authentic Kerala cuisine, Kathakali culture, and soothing backwater tranquility.',
        duration: '05 Days/ 04 Nights',
        durationDays: 5,
        price: 21500,
        regularPrice: 26000,
        rating: 4.9,
        images: [
          'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=1200&q=85',
        ],
        highlights: {
          travel: '05 Days/ 04 Nights',
          accommodation: '3 Nights Hill Resort + 1 Night Deluxe Houseboat',
          meals: 'All meals on Houseboat, Daily Breakfast at Resorts',
          transport: 'Private Air-Conditioned Sedan',
          groupSize: 'Couples / Families',
          team: 'Dedicated Kerala Tour Host',
        },
        placesYouWillSee: [
          { name: 'Munnar Tea Estates', image: 'https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=600&q=80' },
          { name: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80' },
        ],
        itinerary: [
          { day: 1, title: 'Day 1: Cochin to Munnar Tea Country', description: 'Pick up from Cochin Airport, drive through Cheeyappara waterfalls to Munnar.', activities: ['Waterfall stops', 'Tea garden view'] },
          { day: 2, title: 'Day 2: Munnar Sightseeing & Eravikulam National Park', description: 'See endangered Nilgiri Tahr, Mattupetty Dam, and Echo Point.', activities: ['National park', 'Boat ride'] },
          { day: 3, title: 'Day 3: Munnar to Thekkady Spice Plantations', description: 'Visit fragrant cardamom and pepper plantations and enjoy a boat safari.', activities: ['Spice plantation walk', 'Elephant interaction'] },
          { day: 4, title: 'Day 4: Thekkady to Alleppey Houseboat', description: 'Board traditional kettuvallam houseboat, cruise lagoons, and enjoy Kerala meals.', activities: ['Backwater cruise', 'Sunset viewing'] },
          { day: 5, title: 'Day 5: Alleppey to Cochin Departure', description: 'Morning cruise, checkout, visit Fort Kochi Chinese nets, and drop-off.', activities: ['Fort Kochi tour', 'Airport drop'] },
        ],
        included: [
          'Accommodation in scenic 4-star resorts and private AC Houseboat',
          'All meals on houseboat (Breakfast, Lunch, Dinner, Evening tea)',
          'All sightseeing and intercity transfers in private AC cab',
          'Taxes, parking, and driver allowance',
        ],
        excluded: ['Air/Train fare', 'Entrance fees & Elephant rides', 'Personal expenses'],
        hotels: [],
        featured: true,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Alleppey,Kerala&t=&z=10&ie=UTF8&iwloc=&output=embed',
        isDomestic: true,
      },
      {
        name: 'Uttarakhand Char Dham & Rishikesh Spiritual Trail',
        slug: 'uttarakhand-char-dham-rishikesh-spiritual-trail',
        destination: destMap.get('uttarakhand')?._id,
        category: 'uttarakhand',
        categoryRef: catMap.get('uttarakhand')?._id,
        description:
          'Experience the divine energy of Uttarakhand. From the divine evening Ganga Aarti in Rishikesh and Haridwar to the scenic Himalayan valleys and serene hill vistas of Mussoorie.',
        itineraryIntro:
          'A sacred and refreshing pilgrimage and hill retreat across the holy foothills of the Himalayas.',
        duration: '05 Days/ 04 Nights',
        durationDays: 5,
        price: 19500,
        regularPrice: 24000,
        rating: 4.8,
        images: [
          'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85',
        ],
        highlights: {
          travel: '05 Days/ 04 Nights',
          accommodation: '4 Nights in Deluxe Riverside & Hill Hotels',
          meals: 'Daily Vegetarian Breakfast & Dinners',
          transport: 'Private Vehicle with Experienced Mountain Chauffeur',
          groupSize: 'Family & Pilgrim Groups',
          team: 'Local Uttarakhand Guide',
        },
        placesYouWillSee: [
          { name: 'Rishikesh Triveni Ghat', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
        ],
        itinerary: [
          { day: 1, title: 'Day 1: Delhi to Haridwar & Evening Ganga Aarti', description: 'Drive to Haridwar, witness grand Ganga Aarti at Har Ki Pauri.', activities: ['Har Ki Pauri Aarti', 'Temple visits'] },
          { day: 2, title: 'Day 2: Haridwar to Rishikesh Yoga Capital', description: 'Visit Ram Jhula, Lakshman Jhula, and attend Parmarth Niketan Aarti.', activities: ['Ram Jhula', 'Riverbank meditation'] },
          { day: 3, title: 'Day 3: Rishikesh to Mussoorie Queen of Hills', description: 'Drive to Mussoorie, stop at Kempty Falls and stroll along the Mall Road.', activities: ['Kempty Falls', 'Mall Road walk'] },
          { day: 4, title: 'Day 4: Mussoorie Sightseeing & Gun Hill', description: 'Cable car ride to Gun Hill, visit Lal Tibba and Company Garden.', activities: ['Gun hill view', 'Lal Tibba'] },
          { day: 5, title: 'Day 5: Mussoorie to Delhi Departure', description: 'Morning breakfast, return journey to Delhi airport or railway station.', activities: ['Departure transfer'] },
        ],
        included: [
          '4 Nights Hotel Stay in Haridwar, Rishikesh, and Mussoorie',
          'Daily Breakfast and Dinner',
          'Private Cab for all transfers and mountain sightseeing',
        ],
        excluded: ['Air/Train fare', 'Rafting tickets', 'Personal expenses'],
        hotels: [],
        featured: true,
        mapEmbedUrl: 'https://maps.google.com/maps?q=Rishikesh,Uttarakhand&t=&z=11&ie=UTF8&iwloc=&output=embed',
        isDomestic: true,
      },
    ];

    const seededPackages = await Package.insertMany(packagesData);

    // 7. Seed Testimonials
    const testimonialsData = [
      {
        name: 'Amit & Priya Sen',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        review:
          'Our tour to Kashmir was seamless and beautifully curated! The houseboat stays, polite drivers, and Gulmarg Gondola guidance were top notch. Truly paradise on earth.',
        rating: 5,
        destination: 'Kashmir',
      },
      {
        name: 'Rohit Verma',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        review:
          'The Spiti Valley expedition organized by MSK Holidays was beyond expectations. Safe drivers, reliable homestays, and breathtaking views throughout.',
        rating: 5,
        destination: 'Spiti',
      },
      {
        name: 'Dr. Sunita & Rajesh Nair',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        review:
          'We loved our Rajasthan heritage tour. Beautiful havelis in Jaipur and the desert camp in Jaisalmer made our anniversary so memorable. Highly recommended!',
        rating: 5,
        destination: 'Rajasthan',
      },
    ];

    await Testimonial.insertMany(testimonialsData);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully for India Tours only!',
      seededCategories: seededCategories.length,
      seededDestinations: seededDestinations.length,
      seededPackages: seededPackages.length,
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
