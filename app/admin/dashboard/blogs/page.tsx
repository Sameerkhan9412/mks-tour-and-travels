'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  author: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('family');
  const [author, setAuthor] = useState('MSK Editor');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/blogs');
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error('Fetch blogs admin error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenNew = () => {
    setIsEditing(true);
    setEditId(null);
    setTitle('');
    setContent('');
    setImageUrl('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80');
    setCategory('family');
    setAuthor('MSK Editor');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEdit = (blog: BlogData) => {
    setIsEditing(true);
    setEditId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setImageUrl(blog.image);
    setCategory(blog.category);
    setAuthor(blog.author);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageUrl) {
      setErrorMsg('Please fill out Title, Content, and Image URL.');
      return;
    }

    const payload = {
      title,
      content,
      image: imageUrl,
      category,
      author,
    };

    try {
      if (editId) {
        await axios.put(`/api/blogs/${editId}`, payload);
        setSuccessMsg('Blog article updated successfully.');
      } else {
        await axios.post('/api/blogs', payload);
        setSuccessMsg('Blog article published successfully.');
      }
      setIsEditing(false);
      fetchBlogs();
    } catch (err: any) {
      console.error('Save blog error:', err);
      setErrorMsg(err.response?.data?.message || 'Error occurred while saving.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await axios.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading Blogs management...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-blue" />
            Travel Blogs Management
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Write guides, advice, and tips for visa procedures
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-blue text-white rounded-xl text-xs font-bold hover:bg-opacity-95 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            Write Article
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
            {editId ? 'Edit Blog Article' : 'Write New Travel Guide'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Places in Kashmir You Cannot Miss"
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>

            {/* Author */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Author Sign *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none bg-white"
              >
                <option value="honeymoon">Honeymoon Specials</option>
                <option value="adventure">Adventure Tours</option>
                <option value="family">Family Tours</option>
                <option value="international">International Travel</option>
                <option value="visa">Visa Guides</option>
              </select>
            </div>

            {/* Image Url */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cover Image URL *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Write the full guide article here (markdown or text supported)..."
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
              Publish Article
            </button>
          </div>
        </form>
      ) : (
        /* Blogs list table */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Cover</th>
                  <th className="p-4 sm:p-5">Article Title</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Author</th>
                  <th className="p-4 sm:p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50 transition-colors">
                    {/* Image */}
                    <td className="p-4 sm:p-5">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                        <img
                          src={blog.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=80&q=80'}
                          alt={blog.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      {blog.title}
                    </td>

                    {/* Category */}
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold text-primary-blue bg-blue-50 rounded-full border border-blue-100 uppercase">
                        {blog.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="p-4 sm:p-5 text-slate-500 font-semibold">
                      {blog.author}
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary-blue transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 italic">
                      No blog guides written yet. Click &quot;Write Article&quot; to begin.
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
