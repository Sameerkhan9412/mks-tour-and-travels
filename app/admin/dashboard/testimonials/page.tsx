'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, MessageSquare, Star, CheckCircle2, AlertCircle } from 'lucide-react';

interface TestimonialData {
  _id: string;
  name: string;
  photo: string;
  review: string;
  rating: number;
  destination: string;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [photoUrl, setPhotoUrl] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/testimonials');
      setTestimonials(res.data.testimonials || []);
    } catch (err) {
      console.error('Fetch testimonials admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setReview('');
    setRating(5);
    setPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80');
    setDestination('Kashmir');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEdit = (t: TestimonialData) => {
    setIsEditing(true);
    setEditId(t._id);
    setName(t.name);
    setReview(t.review);
    setRating(t.rating);
    setPhotoUrl(t.photo);
    setDestination(t.destination);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review || !photoUrl || !destination) {
      setErrorMsg('Please enter all fields.');
      return;
    }

    const payload = {
      name,
      review,
      rating: Number(rating),
      photo: photoUrl,
      destination,
    };

    try {
      if (editId) {
        await axios.put(`/api/testimonials/${editId}`, payload);
        setSuccessMsg('Testimonial updated successfully.');
      } else {
        await axios.post('/api/testimonials', payload);
        setSuccessMsg('Testimonial added successfully.');
      }
      setIsEditing(false);
      fetchTestimonials();
    } catch (err: any) {
      console.error('Save testimonial error:', err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer testimonial?')) return;
    try {
      await axios.delete(`/api/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading Testimonials management...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary-blue" />
            Testimonial Reviews Management
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Display traveler feedback and stories on the homepage slider
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            Add Review
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
            {editId ? 'Modify Review Details' : 'Publish New Customer Testimonial'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyan Sen"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Destination Traveled */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination Visited *</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kashmir / Dubai"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Star Rating */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating (1 to 5) *</label>
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

          {/* Photo Url */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Photo URL *</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
              required
            />
          </div>

          {/* Review text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review Quote Description *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Quote details of their travel experience with MSK Holiday's..."
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none"
              required
            />
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
              Save Review
            </button>
          </div>
        </form>
      ) : (
        /* Testimonials Table list */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Photo</th>
                  <th className="p-4 sm:p-5">Name</th>
                  <th className="p-4 sm:p-5">Traveled To</th>
                  <th className="p-4 sm:p-5">Rating</th>
                  <th className="p-4 sm:p-5">Review Snippet</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {testimonials.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    {/* Photo */}
                    <td className="p-4 sm:p-5">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                        <img
                          src={t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                          alt={t.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      {t.name}
                    </td>

                    {/* Destination */}
                    <td className="p-4 sm:p-5 text-slate-500 font-semibold">
                      {t.destination}
                    </td>

                    {/* Rating */}
                    <td className="p-4 sm:p-5 text-slate-800 font-bold">
                      <div className="flex items-center text-accent-gold">
                        <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold mr-0.5" />
                        {t.rating}
                      </div>
                    </td>

                    {/* Snippet */}
                    <td className="p-4 sm:p-5 text-slate-400 max-w-[200px] truncate">
                      {t.review}
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary-blue transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {testimonials.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                      No traveler reviews added yet. Click &quot;Add Review&quot; to begin.
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
