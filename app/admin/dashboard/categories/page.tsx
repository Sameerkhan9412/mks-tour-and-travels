'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Save, Layers, CheckCircle2, AlertCircle, X, Image as ImageIcon, UploadCloud, Loader2 } from 'lucide-react';

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  order: number;
  featured: boolean;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [featured, setFeatured] = useState(true);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, AVIF)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'msk_holidays/categories');

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success && res.data?.url) {
        setImage(res.data.url);
      } else {
        setUploadError(res.data?.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('Category image upload error:', err);
      setUploadError(err.response?.data?.message || 'Error uploading image to server');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setName('');
    setSlug('');
    setImage('');
    setDescription('');
    setOrder(categories.length + 1);
    setFeatured(true);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadError('');
  };

  const handleOpenEdit = (cat: CategoryData) => {
    setIsEditing(true);
    setEditId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setDescription(cat.description || '');
    setOrder(cat.order || 0);
    setFeatured(cat.featured);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadError('');
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditId(null);
    setErrorMsg('');
    setSuccessMsg('');
    setUploadError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) {
      setErrorMsg('Category Name and Image URL are required');
      return;
    }

    try {
      const payload = {
        name,
        slug: slug || undefined,
        image,
        description,
        order: Number(order),
        featured,
      };

      if (editId) {
        await axios.put(`/api/categories/${editId}`, payload);
        setSuccessMsg('Category updated successfully!');
      } else {
        await axios.post('/api/categories', payload);
        setSuccessMsg('Category created successfully!');
      }

      await fetchCategories();
      setTimeout(() => {
        handleCloseForm();
      }, 1000);
    } catch (err: any) {
      console.error('Save category error:', err);
      setErrorMsg(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-blue/10 text-primary-blue">
              <Layers className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tour Package Categories</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage India tour package categories displayed in the website navigation dropdown and listings.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-primary-blue hover:bg-opacity-90 transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Main Form Drawer or Modal */}
      {isEditing && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {editId ? 'Edit Category' : 'Create New Tour Category'}
            </h2>
            <button
              onClick={handleCloseForm}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 text-red-700 text-xs font-bold rounded-2xl border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-green-50 text-green-700 text-xs font-bold rounded-2xl border border-green-100">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Uttarakhand, Kashmir, Spiti"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editId) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/[\s_-]+/g, '-')
                      );
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Slug (URL Identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. uttarakhand, kashmir"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue font-mono text-xs"
                />
              </div>
            </div>

            {/* Category Image Upload & Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Category Image *
                </label>
                <span className="text-[11px] text-slate-400">
                  PNG, JPG, WEBP, AVIF (Max 10MB)
                </span>
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload File from Device */}
                <div className="relative border-2 border-dashed border-slate-200 hover:border-primary-blue rounded-2xl p-5 transition-all bg-slate-50/60 hover:bg-primary-blue/5 flex flex-col items-center justify-center text-center cursor-pointer min-h-[150px] group">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-primary-blue">
                      <Loader2 className="w-7 h-7 animate-spin" />
                      <span className="text-xs font-bold">Uploading image to Cloudinary...</span>
                      <span className="text-[10px] text-slate-400">Please wait a moment</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <div className="w-11 h-11 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-primary-blue block">
                          Upload Image from Device
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Click to browse or drop image here
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
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-700"
                    />
                  </div>

                  {image ? (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-xs">
                        <Image src={image} alt="Category preview" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Image Attached</span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5" title={image}>
                          {image}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-300" />
                      No image uploaded or selected yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of what this Indian destination offers travelers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="cat-featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
                />
                <label htmlFor="cat-featured" className="text-xs font-bold text-slate-700 select-none">
                  Show in Navbar Dropdown & Featured lists
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-primary-blue hover:bg-opacity-90 shadow-md"
              >
                <Save className="w-4 h-4" />
                {editId ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Categories ({categories.length})
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm font-medium">
            No categories found. Click &quot;Add Category&quot; or run the seed script to import default Indian categories.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Category Image</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">#{cat.order || 0}</td>
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 text-sm">{cat.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{cat.slug}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          cat.featured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {cat.featured ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-lg text-slate-400 hover:text-primary-blue hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
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
