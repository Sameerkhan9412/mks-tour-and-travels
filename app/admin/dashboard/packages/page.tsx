'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Save, Compass, CheckCircle2, AlertCircle, X, MapPin, Layers } from 'lucide-react';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

interface PlaceYouWillSee {
  name: string;
  image: string;
}

interface CategoryMin {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface DestinationMin {
  _id: string;
  name: string;
}

interface HotelMin {
  _id: string;
  name: string;
  location: string;
}

interface PackageData {
  _id: string;
  name: string;
  slug: string;
  destination?: string | DestinationMin | null;
  category: string;
  categoryRef?: string | CategoryMin | null;
  description: string;
  duration: string;
  durationDays: number;
  price: number;
  regularPrice?: number;
  rating: number;
  images: string[];
  highlights?: {
    travel?: string;
    accommodation?: string;
    meals?: string;
    transport?: string;
    groupSize?: string;
    team?: string;
  };
  placesYouWillSee?: PlaceYouWillSee[];
  itineraryIntro?: string;
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  hotels: (string | HotelMin)[];
  featured: boolean;
  mapEmbedUrl?: string;
  isDomestic: boolean;
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [categories, setCategories] = useState<CategoryMin[]>([]);
  const [destinations, setDestinations] = useState<DestinationMin[]>([]);
  const [hotels, setHotels] = useState<HotelMin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [durationDays, setDurationDays] = useState(4);
  const [price, setPrice] = useState(18000);
  const [regularPrice, setRegularPrice] = useState<number | ''>(22000);
  const [rating, setRating] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isDomestic, setIsDomestic] = useState(true);

  // Highlights (the 6 fields from the screenshot)
  const [hlTravel, setHlTravel] = useState('04 Days/ 03 Nights');
  const [hlAccommodation, setHlAccommodation] = useState('3 nights in hotels');
  const [hlMeals, setHlMeals] = useState('4 Breakfasts, 3 Dinners');
  const [hlTransport, setHlTransport] = useState('Mini-Coach and Ferry');
  const [hlGroupSize, setHlGroupSize] = useState('Average 24 people');
  const [hlTeam, setHlTeam] = useState('Expert Trip Manager');

  // Itinerary & Media
  const [itineraryIntro, setItineraryIntro] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [placesYouWillSee, setPlacesYouWillSee] = useState<PlaceYouWillSee[]>([]);
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);

  // Input helpers
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceImage, setNewPlaceImage] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [dayTitle, setDayTitle] = useState('');
  const [dayDesc, setDayDesc] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pkgsRes, catsRes, destsRes, hotelsRes] = await Promise.all([
        axios.get('/api/packages'),
        axios.get('/api/categories'),
        axios.get('/api/destinations'),
        axios.get('/api/hotels'),
      ]);
      setPackages(pkgsRes.data.packages || []);
      setCategories(catsRes.data.categories || []);
      setDestinations(destsRes.data.destinations || []);
      setHotels(hotelsRes.data.hotels || []);
    } catch (err) {
      console.error('Fetch packages admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setCategory(categories[0]?.slug || 'kashmir');
    setDestinationId(destinations[0]?._id || '');
    setDescription('');
    setDuration('04 Days/ 03 Nights');
    setDurationDays(4);
    setPrice(18000);
    setRegularPrice(22000);
    setRating(5);
    setImageUrl('https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1200&q=85');
    setMapEmbedUrl('');
    setFeatured(true);
    setIsDomestic(true);

    setHlTravel('04 Days/ 03 Nights');
    setHlAccommodation('3 nights in hotels');
    setHlMeals('4 Breakfasts, 3 Dinners');
    setHlTransport('Mini-Coach and Ferry');
    setHlGroupSize('Average 24 people');
    setHlTeam('Expert Trip Manager');

    setItineraryIntro('');
    setItinerary([
      { day: 1, title: 'Day 1- Srinagar: Land into the Capital', description: 'Arrive at airport and transfer to houseboat.' },
      { day: 2, title: 'Day 2- Srinagar: A day excursion to Pahalgam', description: 'Explore scenic saffron fields and Lidder valley.' },
    ]);
    setPlacesYouWillSee([
      { name: 'Dal Lake & Houseboats', image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=600&q=80' },
    ]);
    setIncluded([
      'Accommodation in Selected Hotel',
      'All State Taxes, Toll Taxes, Parking fees, and Driver Charges',
      'Break Fast and Dinner',
      'Sightseeing as per Itinerary',
      'Transportation in Selected Mode of Transport',
    ]);
    setExcluded([
      'Exclusions Air / Train Fare',
      'Any private expenses',
      'Entry / Camera fees to any sightseeing Place',
      'Guide Service Fees',
      'Laundry Fees',
      'Sightseeing of any place not mentioned in the itinerary',
    ]);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEdit = (pkg: PackageData) => {
    setIsEditing(true);
    setEditId(pkg._id);
    setName(pkg.name);
    setCategory(pkg.category || 'kashmir');
    setDestinationId(
      pkg.destination && typeof pkg.destination === 'object'
        ? pkg.destination._id
        : (pkg.destination as string) || ''
    );
    setDescription(pkg.description);
    setDuration(pkg.duration);
    setDurationDays(pkg.durationDays);
    setPrice(pkg.price);
    setRegularPrice(pkg.regularPrice || '');
    setRating(pkg.rating);
    setImageUrl(pkg.images[0] || '');
    setMapEmbedUrl(pkg.mapEmbedUrl || '');
    setFeatured(pkg.featured);
    setIsDomestic(pkg.isDomestic !== false);

    setHlTravel(pkg.highlights?.travel || pkg.duration || '');
    setHlAccommodation(pkg.highlights?.accommodation || '');
    setHlMeals(pkg.highlights?.meals || '');
    setHlTransport(pkg.highlights?.transport || '');
    setHlGroupSize(pkg.highlights?.groupSize || '');
    setHlTeam(pkg.highlights?.team || '');

    setItineraryIntro(pkg.itineraryIntro || '');
    setItinerary(pkg.itinerary || []);
    setPlacesYouWillSee(pkg.placesYouWillSee || []);
    setIncluded(pkg.included || []);
    setExcluded(pkg.excluded || []);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditId(null);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAddItineraryDay = () => {
    if (!dayTitle) return;
    const nextDay = itinerary.length + 1;
    setItinerary([...itinerary, { day: nextDay, title: dayTitle, description: dayDesc }]);
    setDayTitle('');
    setDayDesc('');
  };

  const handleRemoveItineraryDay = (dayNum: number) => {
    setItinerary(
      itinerary
        .filter((item) => item.day !== dayNum)
        .map((item, idx) => ({ ...item, day: idx + 1 }))
    );
  };

  const handleAddPlace = () => {
    if (!newPlaceName || !newPlaceImage) return;
    setPlacesYouWillSee([...placesYouWillSee, { name: newPlaceName, image: newPlaceImage }]);
    setNewPlaceName('');
    setNewPlaceImage('');
  };

  const handleRemovePlace = (index: number) => {
    setPlacesYouWillSee(placesYouWillSee.filter((_, idx) => idx !== index));
  };

  const handleAddIncluded = () => {
    if (!newInclude.trim()) return;
    setIncluded([...included, newInclude.trim()]);
    setNewInclude('');
  };

  const handleRemoveIncluded = (index: number) => {
    setIncluded(included.filter((_, idx) => idx !== index));
  };

  const handleAddExcluded = () => {
    if (!newExclude.trim()) return;
    setExcluded([...excluded, newExclude.trim()]);
    setNewExclude('');
  };

  const handleRemoveExcluded = (index: number) => {
    setExcluded(excluded.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !duration || !price || !category) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    const selectedCategoryObj = categories.find((c) => c.slug === category);

    const payload = {
      name,
      category,
      categoryRef: selectedCategoryObj?._id,
      destination: destinationId || undefined,
      description,
      duration,
      durationDays: Number(durationDays),
      price: Number(price),
      regularPrice: regularPrice ? Number(regularPrice) : undefined,
      rating: Number(rating),
      images: [imageUrl],
      highlights: {
        travel: hlTravel,
        accommodation: hlAccommodation,
        meals: hlMeals,
        transport: hlTransport,
        groupSize: hlGroupSize,
        team: hlTeam,
      },
      placesYouWillSee,
      itineraryIntro: itineraryIntro || description,
      itinerary,
      included,
      excluded,
      featured,
      mapEmbedUrl,
      isDomestic: true,
    };

    try {
      if (editId) {
        await axios.put(`/api/packages/${editId}`, payload);
        setSuccessMsg('Package updated successfully!');
      } else {
        await axios.post('/api/packages', payload);
        setSuccessMsg('Package created successfully!');
      }

      await fetchData();
      setTimeout(() => {
        handleCloseForm();
      }, 1000);
    } catch (err: any) {
      console.error('Save package error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save package');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await axios.delete(`/api/packages/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-blue/10 text-primary-blue">
              <Compass className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">India Tour Packages</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create and edit Indian tour packages with day-wise itineraries, pricing discounts, quick highlights, and media.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary-blue hover:bg-opacity-90 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Package Form Drawer / Section */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                {editId ? 'Edit Tour Package' : 'Create New India Tour Package'}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                Supports all fields from the live tour details layout
              </span>
            </div>
            <button
              onClick={handleCloseForm}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 text-xs font-bold rounded-2xl border border-green-100">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4" /> 1. Basic Package Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmir Weekend Tour 3N/4D"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Tour Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-semibold capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Discounted Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="18000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-bold text-green-700"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Displayed as &quot;From 18,000 /-&quot;
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="22000"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-semibold line-through text-slate-500"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Crossed-out regular price
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Duration Text *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="04 Days/ 03 Nights"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Total Days (Filter)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Cover Image URL *
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                  />
                  {imageUrl && (
                    <div className="relative w-28 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <Image src={imageUrl} alt="Cover preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tour Overview / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed introduction to the experience, landscapes, highlights, and journey details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                />
              </div>
            </div>

            {/* Section 2: Quick Highlights Grid (6 Cards shown in screenshot) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4" /> 2. &quot;Explore&quot; 6-Card Highlights (From Screenshot)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    1. Travel
                  </label>
                  <input
                    type="text"
                    placeholder="04 Days/ 03 Nights"
                    value={hlTravel}
                    onChange={(e) => setHlTravel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    2. Accommodation
                  </label>
                  <input
                    type="text"
                    placeholder="3 nights in hotels"
                    value={hlAccommodation}
                    onChange={(e) => setHlAccommodation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    3. Meals
                  </label>
                  <input
                    type="text"
                    placeholder="4 Breakfasts, 3 Dinners"
                    value={hlMeals}
                    onChange={(e) => setHlMeals(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    4. Transport
                  </label>
                  <input
                    type="text"
                    placeholder="Mini-Coach and Ferry / Private Cab"
                    value={hlTransport}
                    onChange={(e) => setHlTransport(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    5. Group Size
                  </label>
                  <input
                    type="text"
                    placeholder="Average 24 people / Private"
                    value={hlGroupSize}
                    onChange={(e) => setHlGroupSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    6. Team
                  </label>
                  <input
                    type="text"
                    placeholder="Expert Trip Manager"
                    value={hlTeam}
                    onChange={(e) => setHlTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Places You'll See Gallery */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider">
                3. &quot;Places You&apos;ll See&quot; Gallery Photos
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Place Name (e.g. Khardungla Top, Dal Lake)"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <input
                  type="url"
                  placeholder="Place Image URL"
                  value={newPlaceImage}
                  onChange={(e) => setNewPlaceImage(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddPlace}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Add Place
                </button>
              </div>

              {placesYouWillSee.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {placesYouWillSee.map((place, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                      <div className="relative h-28 w-full">
                        <Image src={place.image} alt={place.name} fill className="object-cover" />
                      </div>
                      <div className="p-2 bg-white flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 truncate">{place.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePlace(idx)}
                          className="text-red-500 hover:text-red-700 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 4: Day-wise Itinerary Accordions */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider">
                4. Day-by-Day Itinerary Builder
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Itinerary Introduction Overview (Shown before Day list)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Experience the serene beauty of Kashmir on a refreshing weekend getaway..."
                  value={itineraryIntro}
                  onChange={(e) => setItineraryIntro(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Add Day {itinerary.length + 1}
                </span>
                <input
                  type="text"
                  placeholder="Day Title e.g. Day 1- Srinagar: Land into the Capital"
                  value={dayTitle}
                  onChange={(e) => setDayTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
                <textarea
                  rows={2}
                  placeholder="Day Description and activities..."
                  value={dayDesc}
                  onChange={(e) => setDayDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddItineraryDay}
                  className="px-4 py-2 bg-primary-blue text-white rounded-xl text-xs font-bold"
                >
                  Add Day to Itinerary
                </button>
              </div>

              <div className="space-y-2">
                {itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-primary-blue mr-2">Day {day.day}:</span>
                      <span className="font-bold text-slate-800">{day.title}</span>
                      <p className="text-slate-500 mt-1 line-clamp-1">{day.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(day.day)}
                      className="text-red-500 hover:text-red-700 font-bold p-1"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: What's Included & Excluded */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider">
                5. Inclusions & Exclusions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-green-700 uppercase flex items-center gap-1">
                    ✓ What&apos;s Included ({included.length})
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add inclusion item..."
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddIncluded}
                      className="px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {included.map((inc, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                      >
                        <span className="text-slate-700 truncate">✓ {inc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIncluded(idx)}
                          className="text-red-500 ml-2 font-bold"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
                    ✕ What&apos;s Excluded ({excluded.length})
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add exclusion item..."
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddExcluded}
                      className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {excluded.map((exc, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                      >
                        <span className="text-slate-700 truncate">✕ {exc}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExcluded(idx)}
                          className="text-red-500 ml-2 font-bold"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Map & Flags */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider">
                6. Location Map & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/maps?q=...&output=embed"
                    value={mapEmbedUrl}
                    onChange={(e) => setMapEmbedUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Paste Google Maps embed URL or leave blank for default destination view
                  </span>
                </div>

                <div className="flex items-center gap-6 pt-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pkg-featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
                    />
                    <label htmlFor="pkg-featured" className="text-xs font-bold text-slate-700 select-none">
                      Featured on Homepage
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 rounded-full text-xs font-bold text-white bg-primary-blue hover:bg-opacity-90 shadow-md"
              >
                <Save className="w-4 h-4" />
                {editId ? 'Save Package Changes' : 'Publish Package'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Packages List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Packages ({packages.length})
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm font-medium">
            No tour packages found. Click &quot;Add Package&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Tour</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                          <Image src={pkg.images[0]} alt={pkg.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-sm block line-clamp-1">{pkg.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{pkg.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-blue/10 text-primary-blue uppercase tracking-wider">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{pkg.duration}</td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-green-700 text-sm">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      {pkg.regularPrice && (
                        <span className="text-[10px] line-through text-slate-400 ml-1.5 font-medium">
                          ₹{pkg.regularPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          pkg.featured ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {pkg.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pkg)}
                          className="p-2 rounded-lg text-slate-400 hover:text-primary-blue hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
