import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Package from '@/models/Package';
import Destination from '@/models/Destination';
import Hotel from '@/models/Hotel';
import Category from '@/models/Category';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  // Prevent tree-shaking of imported models
  const _registerModels = [Destination.modelName, Hotel.modelName, Category.modelName];

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const destinationParam = searchParams.get('destination');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const duration = searchParams.get('duration');
    const isDomestic = searchParams.get('domestic');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');

    const query: any = {};

    // 1. Destination filter
    if (destinationParam) {
      const dest = await Destination.findOne({
        $or: [
          { slug: destinationParam.toLowerCase() },
          { name: { $regex: new RegExp(destinationParam, 'i') } },
        ],
      });
      if (dest) {
        query.destination = dest._id;
      } else {
        return NextResponse.json({ success: true, packages: [] });
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

    // 5. Domestic/International filter
    if (isDomestic !== null && isDomestic !== 'all') {
      query.isDomestic = isDomestic === 'true';
    }

    // 6. Featured filter
    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
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

    const packages = await Package.find(query)
      .populate('destination')
      .populate('hotels')
      .populate('categoryRef')
      .sort(sortQuery);

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error('Packages fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getSessionUser();
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();
    const {
      name,
      destination,
      description,
      duration,
      durationDays,
      price,
      regularPrice,
      rating,
      images,
      highlights,
      placesYouWillSee,
      itineraryIntro,
      itinerary,
      included,
      excluded,
      hotels,
      featured,
      category,
      categoryRef,
      mapUrl,
      mapEmbedUrl,
      isDomestic,
    } = data;

    if (!name || !description || !duration || !durationDays || !price || !category) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Auto-generate slug
    const slug = (data.slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingPackage = await Package.findOne({ slug });
    if (existingPackage) {
      return NextResponse.json(
        { message: 'A package with this name/slug already exists' },
        { status: 400 }
      );
    }

    const newPackage = await Package.create({
      name: name.trim(),
      slug,
      destination: destination || undefined,
      description: description.trim(),
      duration: duration.trim(),
      durationDays: Number(durationDays),
      price: Number(price),
      regularPrice: regularPrice ? Number(regularPrice) : undefined,
      rating: rating ? Number(rating) : 5,
      images: images || [],
      highlights: highlights || {},
      placesYouWillSee: placesYouWillSee || [],
      itineraryIntro: itineraryIntro || '',
      itinerary: itinerary || [],
      included: included || [],
      excluded: excluded || [],
      hotels: hotels || [],
      featured: featured === true,
      category: category.toLowerCase().trim(),
      categoryRef: categoryRef || undefined,
      mapUrl: mapUrl || '',
      mapEmbedUrl: mapEmbedUrl || '',
      isDomestic: isDomestic !== false,
    });

    return NextResponse.json({ success: true, package: newPackage }, { status: 201 });
  } catch (error: any) {
    console.error('Package creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
