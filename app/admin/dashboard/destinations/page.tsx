'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Map, CheckCircle2, AlertCircle } from 'lucide-react';

interface DestinationData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  overview: string;
  attractions: string[];
  activities: string[];
  bestTimeToVisit: string;
  travelTips: string[];
  isDomestic: boolean;
  featured: boolean;
}

export default function DestinationsAdminPage() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [overview, setOverview] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDomestic, setIsDomestic] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Lists
  const [attractions, setAttractions] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [travelTips, setTravelTips] = useState<string[]>([]);

  // Item buffers
  const [newAttraction, setNewAttraction] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newTip, setNewTip] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/destinations');
      setDestinations(res.data.destinations || []);
    } catch (err) {
      console.error('Fetch destinations admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setOverview('');
    setBestTimeToVisit('November to February');
    setImageUrl('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80');
    setIsDomestic(true);
    setFeatured(false);
    setAttractions([]);
    setActivities([]);
    setTravelTips([]);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEdit = (dest: DestinationData) => {
    setIsEditing(true);
    setEditId(dest._id);
    setName(dest.name);
    setOverview(dest.overview);
    setBestTimeToVisit(dest.bestTimeToVisit);
    setImageUrl(dest.image);
    setIsDomestic(dest.isDomestic);
    setFeatured(dest.featured);
    setAttractions(dest.attractions || []);
    setActivities(dest.activities || []);
    setTravelTips(dest.travelTips || []);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !overview || !bestTimeToVisit || !imageUrl) {
      setErrorMsg('Please enter all required fields.');
      return;
    }

    const payload = {
      name,
      overview,
      bestTimeToVisit,
      image: imageUrl,
      isDomestic,
      featured,
      attractions,
      activities,
      travelTips,
    };

    try {
      if (editId) {
        await axios.put(`/api/destinations/${editId}`, payload);
        setSuccessMsg('Destination updated successfully.');
      } else {
        await axios.post('/api/destinations', payload);
        setSuccessMsg('Destination created successfully.');
      }
      setIsEditing(false);
      fetchDestinations();
    } catch (err: any) {
      console.error('Save destination error:', err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination? All linked packages might lose destination refs.')) return;
    try {
      await axios.delete(`/api/destinations/${id}`);
      fetchDestinations();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Add list helper actions
  const handleAddAttraction = () => {
    if (!newAttraction.trim()) return;
    setAttractions([...attractions, newAttraction.trim()]);
    setNewAttraction('');
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setActivities([...activities, newActivity.trim()]);
    setNewActivity('');
  };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setTravelTips([...travelTips, newTip.trim()]);
    setNewTip('');
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading Destinations management...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Map className="w-6 h-6 text-primary-blue" />
            Destinations Management
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Create and edit domestic & international destinations
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            Add Destination
          </button>
        )}
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs bg-green-50 text-green-600 rounded-xl border border-green-100">
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
            {editId ? 'Modify Destination Info' : 'Create New Destination'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kashmir"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-blue"
                required
              />
            </div>

            {/* Best Time to Visit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Time to Visit *</label>
              <input
                type="text"
                value={bestTimeToVisit}
                onChange={(e) => setBestTimeToVisit(e.target.value)}
                placeholder="e.g. March to October"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overview Summary *</label>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={4}
              placeholder="Detailed description of the destination..."
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Url */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Image Banner URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-8 pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDomestic}
                  onChange={(e) => setIsDomestic(e.target.checked)}
                  className="rounded border-slate-300 text-primary-blue w-4.5 h-4.5"
                />
                Domestic Spot
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-slate-300 text-primary-blue w-4.5 h-4.5"
                />
                Featured
              </label>
            </div>
          </div>

          {/* Lists lists: attractions, activities, travel tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
            {/* Attractions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Attractions List</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAttraction}
                  onChange={(e) => setNewAttraction(e.target.value)}
                  placeholder="e.g. Shalimar Garden"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAttraction}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {attractions.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs bg-slate-55 p-2 rounded-lg border border-slate-100">
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setAttractions(attractions.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 font-bold shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Activities List</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="e.g. Shikara Cruising"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {activities.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs bg-slate-55 p-2 rounded-lg border border-slate-100">
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setActivities(activities.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 font-bold shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel Tips */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Travel Tips</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  placeholder="e.g. Carry warm woolens"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTip}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {travelTips.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs bg-slate-55 p-2 rounded-lg border border-slate-100 font-medium">
                    <span className="truncate">{item}</span>
                    <button
                      type="button"
                      onClick={() => setTravelTips(travelTips.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 font-bold shrink-0"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
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
              Save Destination
            </button>
          </div>
        </form>
      ) : (
        /* Grid list of destinations */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest._id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 w-full bg-slate-100">
                <img src={dest.image} alt={dest.name} className="object-cover w-full h-full" />
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold text-primary-blue bg-white rounded-full capitalize">
                  {dest.isDomestic ? 'Domestic' : 'International'}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{dest.name}</h4>
                  <p className="text-xs text-slate-400 font-bold mt-1">Best time: {dest.bestTimeToVisit}</p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{dest.overview}</p>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-4">
                  <button
                    onClick={() => handleOpenEdit(dest)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary-blue cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dest._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400 italic">
              No destinations in database. Click &quot;Add Destination&quot; to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
