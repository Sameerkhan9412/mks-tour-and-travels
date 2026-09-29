'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  Compass,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Layers,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

interface PlaceYouWillSee {
  name?: string;
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
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [extraImageUrl, setExtraImageUrl] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingPlace, setIsUploadingPlace] = useState(false);
  const [coverUploadError, setCoverUploadError] = useState('');
  const [placeUploadError, setPlaceUploadError] = useState('');
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
  const [newPlaceImage, setNewPlaceImage] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [dayTitle, setDayTitle] = useState('');
  const [dayDesc, setDayDesc] = useState('');

  // 1. Cover Image Upload (Device to Cloudinary)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCoverUploadError('Please select a valid image file (PNG, JPG, WEBP, AVIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCoverUploadError('Image size should be less than 10MB');
      return;
    }

    setIsUploadingCover(true);
    setCoverUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'msk_holidays/packages');

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success && res.data?.url) {
        setImageUrl(res.data.url);
      } else {
        setCoverUploadError(res.data?.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('Package image upload error:', err);
      setCoverUploadError(err.response?.data?.message || 'Error uploading image to server');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // 2. Additional Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'msk_holidays/packages');

        const res = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.success && res.data?.url) {
          setGalleryImages((prev) => [...prev, res.data.url]);
        }
      }
    } catch (err: any) {
      console.error('Gallery image upload error:', err);
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddExtraImage = () => {
    if (!extraImageUrl.trim()) return;
    setGalleryImages([...galleryImages, extraImageUrl.trim()]);
    setExtraImageUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, idx) => idx !== index));
  };

  // 3. Place Photo Upload (Device to Cloudinary)
  const handlePlaceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPlace(true);
    setPlaceUploadError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'msk_holidays/packages/places');

        const res = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.success && res.data?.url) {
          setPlacesYouWillSee((prev) => [...prev, { image: res.data.url }]);
        }
      }
    } catch (err: any) {
      console.error('Place image upload error:', err);
      setPlaceUploadError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploadingPlace(false);
      e.target.value = '';
    }
  };

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
    setCategory(categories[0]?.slug || '');
    setDestinationId(destinations[0]?._id || '');
    setDescription('');
    setDuration('04 Days/ 03 Nights');
    setDurationDays(4);
    setPrice(0);
    setRegularPrice('');
    setRating(5);
    setImageUrl('https://plus.unsplash.com/premium_photo-1663088923485-58685ba14d5f?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    setGalleryImages([]);
    setExtraImageUrl('');
    setCoverUploadError('');
    setPlaceUploadError('');
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
      { image: 'https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=600&q=80' },
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
    setImageUrl(pkg.images?.[0] || '');
    setGalleryImages(pkg.images?.slice(1) || []);
    setExtraImageUrl('');
    setCoverUploadError('');
    setPlaceUploadError('');
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
    setCoverUploadError('');
    setPlaceUploadError('');
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
    if (!newPlaceImage.trim()) return;
    setPlacesYouWillSee([...placesYouWillSee, { image: newPlaceImage.trim() }]);
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
    if (!name || !description || !duration || !category || !imageUrl.trim()) {
      setErrorMsg('Please select a Category, add a Cover Image, and fill all required fields.');
      return;
    }

    const selectedCategoryObj = categories.find((c) => c.slug === category);
    const allImages = [imageUrl.trim(), ...galleryImages.filter((img) => img && img !== imageUrl.trim())];

    const payload = {
      name,
      category,
      categoryRef: selectedCategoryObj?._id,
      destination: destinationId || undefined,
      description,
      duration,
      durationDays: Number(durationDays),
      price: price ? Number(price) : 0,
      regularPrice: regularPrice ? Number(regularPrice) : undefined,
      rating: Number(rating),
      images: allImages.length > 0 ? allImages : [imageUrl.trim()],
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Tour Category *
                    </label>
                    <Link
                      href="/admin/dashboard/categories"
                      target="_blank"
                      className="text-[11px] font-bold text-primary-blue hover:underline"
                    >
                      + Manage Categories
                    </Link>
                  </div>
                  {categories.length === 0 ? (
                    <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
                      No categories found.{' '}
                      <Link href="/admin/dashboard/categories" className="font-bold underline text-primary-blue">
                        Add a category first
                      </Link>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-semibold capitalize"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Reference Price (₹) <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Quote on request"
                    value={price || ''}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-700 font-medium"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Clients will send Quote Requests
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Regular Price (₹) <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Optional regular price"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-500 font-medium"
                  />
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Optional reference
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

              {/* Package Cover Image Upload & URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Package Cover Image *
                  </label>
                  <span className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP, AVIF (Max 10MB)
                  </span>
                </div>

                {coverUploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{coverUploadError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload File from Device */}
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-primary-blue rounded-2xl p-5 transition-all bg-slate-50/60 hover:bg-primary-blue/5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] group">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCover}
                      onChange={handleCoverUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    {isUploadingCover ? (
                      <div className="flex flex-col items-center gap-2 text-primary-blue">
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                        <span className="text-[10px] text-slate-400">Please wait a moment</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-primary-blue block">
                            Upload Image from Device
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Click to browse or drop cover image here
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Or Paste Direct Image URL */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        Or Paste Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-700 font-medium"
                      />
                    </div>

                    {imageUrl ? (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-xs">
                          <Image src={imageUrl} alt="Package cover preview" fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Cover Image Attached</span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block mt-0.5" title={imageUrl}>
                            {imageUrl}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove cover image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                        No cover image uploaded or entered yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Gallery Photos (Optional) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Additional Gallery Images <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Upload multiple gallery photos or paste links
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploadingGallery}
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                    {isUploadingGallery ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-blue" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 text-primary-blue" />
                        <span>Upload Photos</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste extra photo URL and click Add"
                    value={extraImageUrl}
                    onChange={(e) => setExtraImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddExtraImage}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs">
                        <div className="relative h-20 w-full">
                          <Image src={img} alt={`Gallery photo ${idx + 1}`} fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-primary-blue uppercase tracking-wider">
                    3. &quot;Places You&apos;ll See&quot; Gallery Photos
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Add photos of destinations &amp; attractions travelers will see (Image only)
                  </span>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-blue/10 hover:bg-primary-blue/15 text-primary-blue text-xs font-bold cursor-pointer transition-colors shrink-0 w-fit">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploadingPlace}
                    onChange={handlePlaceImageUpload}
                    className="hidden"
                  />
                  {isUploadingPlace ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Photos from Device</span>
                    </>
                  )}
                </label>
              </div>

              {placeUploadError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{placeUploadError}</span>
                </div>
              )}

              {/* Paste Direct URL */}
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste place photo URL (e.g. https://images.unsplash.com/...)"
                  value={newPlaceImage}
                  onChange={(e) => setNewPlaceImage(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddPlace}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Add Photo
                </button>
              </div>

              {/* Photos Gallery Grid */}
              {placesYouWillSee.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {placesYouWillSee.map((place, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-2xs aspect-4/3"
                    >
                      <Image
                        src={place.image}
                        alt={`Place photo ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  No places gallery photos added yet. Upload from device or paste image URLs above.
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
                  <th className="py-3 px-4">Pricing / Quote</th>
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
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-primary-blue border border-blue-200">
                        Quote on Request
                      </span>
                      {pkg.price && pkg.price > 0 ? (
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                          Ref: ₹{pkg.price.toLocaleString('en-IN')}
                        </span>
                      ) : null}
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
