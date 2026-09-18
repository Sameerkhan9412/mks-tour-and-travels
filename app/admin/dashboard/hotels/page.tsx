'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, Hotel as HotelIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface HotelData {
  _id: string;
  name: string;
  location: string;
  rating: number;
  description: string;
  images: string[];
  amenities: string[];
}

export default function HotelsAdminPage() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(3);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/hotels');
      setHotels(res.data.hotels || []);
    } catch (err) {
      console.error('Fetch hotels admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setLocation('');
    setRating(3);
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
    setAmenities(['Free Wi-Fi', 'Swimming Pool', 'Room Service']);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEdit = (hotel: HotelData) => {
    setIsEditing(true);
    setEditId(hotel._id);
    setName(hotel.name);
    setLocation(hotel.location);
    setRating(hotel.rating);
    setDescription(hotel.description);
    setImageUrl(hotel.images[0] || '');
    setAmenities(hotel.amenities || []);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !description) {
      setErrorMsg('Please fill out Name, Location, and Description.');
      return;
    }

    const payload = {
      name,
      location,
      rating: Number(rating),
      description,
      images: [imageUrl],
      amenities,
    };

    try {
      if (editId) {
        await axios.put(`/api/hotels/${editId}`, payload);
        setSuccessMsg('Hotel updated successfully.');
      } else {
        await axios.post('/api/hotels', payload);
        setSuccessMsg('Hotel added successfully.');
      }
      setIsEditing(false);
      fetchHotels();
    } catch (err: any) {
      console.error('Save hotel error:', err);
      setErrorMsg(err.response?.data?.message || 'Error saving hotel.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await axios.delete(`/api/hotels/${id}`);
      fetchHotels();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setAmenities([...amenities, newAmenity.trim()]);
    setNewAmenity('');
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading Hotels management...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <HotelIcon className="w-6 h-6 text-primary-blue" />
            Hotel Management
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Manage stays and lodging partner files
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            Add Hotel
          </button>
        )}
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs bg-green-50 text-green-600 rounded-xl border border-green-100 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
            {editId ? 'Edit Lodging Details' : 'Add New Partner Hotel'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotel Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Palace Hotel"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location / City *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dal Lake, Srinagar"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Star Rating (1 to 5) *</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hotel Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Write a brief overview about hotel rooms, check-in, and services..."
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Url */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Showcase URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Amenities Builder */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Amenities Checklist</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g. Free Buffet Breakfast"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-1.5">
                {amenities.map((am, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5"
                  >
                    {am}
                    <button
                      type="button"
                      onClick={() => setAmenities(amenities.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-accent-gold" />
              Save Hotel
            </button>
          </div>
        </form>
      ) : (
        /* Hotels list table */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Image</th>
                  <th className="p-4 sm:p-5">Hotel Name</th>
                  <th className="p-4 sm:p-5">Location</th>
                  <th className="p-4 sm:p-5">Rating</th>
                  <th className="p-4 sm:p-5">Amenities</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="hover:bg-slate-50 transition-colors">
                    {/* Image */}
                    <td className="p-4 sm:p-5">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                        <img
                          src={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=80&q=80'}
                          alt={hotel.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      {hotel.name}
                    </td>

                    {/* Location */}
                    <td className="p-4 sm:p-5 text-slate-500 font-semibold">
                      {hotel.location}
                    </td>

                    {/* Rating */}
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      {hotel.rating} Star
                    </td>

                    {/* Amenities count */}
                    <td className="p-4 sm:p-5 text-slate-400">
                      {hotel.amenities?.length || 0} Listed
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(hotel)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary-blue transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {hotels.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                      No hotels cataloged. Click &quot;Add Hotel&quot; to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
