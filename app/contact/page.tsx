'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  Compass,
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

// Categories standard list
const categoriesList = [
  { slug: 'kashmir', name: 'Kashmir' },
  { slug: 'spiti', name: 'Spiti' },
  { slug: 'rajasthan', name: 'Rajasthan' },
  { slug: 'kerala', name: 'Kerala' },
  { slug: 'uttarakhand', name: 'Uttarakhand' },
  { slug: 'himachal-pradesh', name: 'Himachal Pradesh' },
  { slug: 'goa', name: 'Goa' },
  { slug: 'ladakh', name: 'Ladakh' },
  { slug: 'andaman-nicobar', name: 'Andaman & Nicobar' },
  { slug: 'sikkim', name: 'Sikkim' },
];

// Fallback Indian Packages by category
const fallbackTourPlans: Record<string, string[]> = {
  kashmir: [
    'Kashmir Weekend Tour 3N/4D',
    'Kashmir Paradise Honeymoon Tour 5N/6D',
    'Kashmir & Ladakh Combined Circuit 8N/9D',
  ],
  spiti: [
    'Spiti Valley Road Trip & Monastery Circuit (7D/6N)',
    'Chandratal & Kaza Adventure 6N/7D',
  ],
  rajasthan: [
    'Royal Rajasthan Heritage & Desert Forts (6D/5N)',
    'Golden Triangle with Udaipur Royal Tour 7N/8D',
  ],
  kerala: [
    'Kerala Serene Backwaters & Munnar Hills (5D/4N)',
    'Wayanad Nature & Backwaters Retreat 4N/5D',
  ],
  uttarakhand: [
    'Uttarakhand Char Dham & Rishikesh Spiritual Trail (5D/4N)',
    'Nainital & Corbett Wildlife Safari 4N/5D',
  ],
  'himachal-pradesh': [
    'Manali & Shimla Scenic Mountain Tour 5N/6D',
    'Dharamshala & Dalhousie Himalayan Retreat 4N/5D',
  ],
  goa: [
    'Goa Coastal Paradise & Beach Escape 4N/5D',
    'South Goa Heritage & Luxury Resort Stay 3N/4D',
  ],
  ladakh: [
    'Ladakh High Altitude Passes & Pangong Circuit 6N/7D',
    'Leh Ladakh Bike Expedition 7N/8D',
  ],
  'andaman-nicobar': [
    'Andaman Coral Islands & Radhanagar Beach 5N/6D',
    'Havelock & Neil Island Escapade 4N/5D',
  ],
  sikkim: [
    'Sikkim Monasteries & Gangtok Vistas 5N/6D',
    'North Sikkim Lachung & Yumthang Valley Tour 6N/7D',
  ],
};

function ContactFormInner() {
  const searchParams = useSearchParams();

  const paramCategory = searchParams.get('category') || '';
  const paramPackage = searchParams.get('package') || '';
  const paramPackageName = searchParams.get('packageName') || '';

  const [availablePackages, setAvailablePackages] = useState<Array<{ _id: string; name: string; slug: string; category: string }>>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    category: paramCategory || 'kashmir',
    tourPlan: paramPackageName || paramPackage || '',
    travelDate: '',
    travelersCount: 2,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedPlan, setSubmittedPlan] = useState('');

  // Fetch all packages to populate tour plan dropdown dynamically
  useEffect(() => {
    async function loadPackages() {
      setLoadingPackages(true);
      try {
        const res = await axios.get('/api/packages');
        if (res.data.success && Array.isArray(res.data.packages)) {
          setAvailablePackages(res.data.packages);
        }
      } catch (err) {
        console.error('Failed to load packages in contact form:', err);
      } finally {
        setLoadingPackages(false);
      }
    }
    loadPackages();
  }, []);

  // Sync URL query params if they change
  useEffect(() => {
    if (paramCategory) {
      setFormData((prev) => ({
        ...prev,
        category: paramCategory.toLowerCase(),
      }));
    }
    if (paramPackageName) {
      setFormData((prev) => ({
        ...prev,
        tourPlan: paramPackageName,
      }));
    } else if (paramPackage) {
      // Find package name by slug if available
      const matched = availablePackages.find((p) => p.slug === paramPackage);
      setFormData((prev) => ({
        ...prev,
        tourPlan: matched ? matched.name : paramPackage,
      }));
    }
  }, [paramCategory, paramPackage, paramPackageName, availablePackages]);

  // Compute tour plans for selected category
  const filteredPackages = availablePackages.filter(
    (p) => p.category?.toLowerCase() === formData.category.toLowerCase()
  );

  const fallbackPlans = fallbackTourPlans[formData.category.toLowerCase()] || [
    'Custom Tailored Itinerary',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      tourPlan: '', // Reset tour plan when category changes so user picks from new list
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber) {
      alert('Please fill out your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const chosenPlan = formData.tourPlan || `Custom ${formData.category.toUpperCase()} Tour`;

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        category: formData.category,
        packageName: chosenPlan,
        destination: chosenPlan,
        travelDate: formData.travelDate || 'Flexible / To be confirmed',
        travelersCount: formData.travelersCount || 1,
        message: formData.message,
        inquiryType: 'quote',
      };

      const res = await axios.post('/api/inquiries', payload);
      if (res.data.success) {
        setSubmitStatus('success');
        setSubmittedEmail(formData.email);
        setSubmittedPlan(chosenPlan);
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          category: formData.category,
          tourPlan: '',
          travelDate: '',
          travelersCount: 2,
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Contact form submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerWhatsApp = () => {
    const phone = '919805400248';
    const plan = formData.tourPlan || 'a customized tour package';
    const text = encodeURIComponent(
      `Hi MSK Holiday's, I am interested in getting a quotation for ${plan} (${formData.category}). Please share details.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-slate-900 text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-blue/40 via-slate-900 to-slate-950 opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <span className="text-xs font-black tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Request Quotation &amp; Contact
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-2 tracking-tight">
            Get Your Tour Quote &amp; Itinerary
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Select your destination category and tour plan. We will send a personalized quotation copy directly to your email and our travel managers.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800">Office Location</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connect with our tour curators. We specialize exclusively in handpicked India vacations with verified hotels and round-the-clock ground assistance.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-50 rounded-xl text-primary-blue shadow-inner shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Head Office
                    </span>
                    <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                      102, Royal Plaza Building, Near Metro Station, Mumbai, MH - 400001, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-50 rounded-xl text-secondary-sky shadow-inner shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Call &amp; WhatsApp
                    </span>
                    <p className="text-sm text-slate-600 font-bold mt-1">
                      <a href="tel:+919805400248" className="hover:text-primary-blue transition-colors">
                        +91 98054 00248 / +91 98765 43210
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-50 rounded-xl text-tropical-teal shadow-inner shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Email Address
                    </span>
                    <p className="text-sm text-slate-600 font-bold mt-1">
                      <a href="mailto:info@mskholidays.com" className="hover:text-primary-blue transition-colors">
                        info@mskholidays.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Support */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center space-y-4">
              <MessageSquare className="w-10 h-10 text-green-500 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">Quick WhatsApp Quotation</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Need an immediate custom quote? Message our destination manager directly on WhatsApp.
              </p>
              <button
                onClick={triggerWhatsApp}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Side: Quote / Message Form */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-gold" />
                  Request Tour Quotation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  A copy of your quote details will be automatically emailed to you and the admin.
                </p>
              </div>
            </div>

            {/* Pre-fill Alert if redirected from a package card */}
            {paramPackageName && (
              <div className="mb-6 p-4 rounded-2xl bg-primary-blue/5 border border-primary-blue/20 flex items-start gap-3">
                <Compass className="w-5 h-5 text-primary-blue shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-primary-blue uppercase tracking-wider block">
                    Selected Tour Package
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    {paramPackageName}
                  </p>
                </div>
              </div>
            )}

            {/* Submission Success Box */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-green-800 font-extrabold text-base">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Quotation Request Sent Successfully!
                </div>
                <p className="text-xs text-green-700 leading-relaxed">
                  Thank you! We have received your inquiry for <strong>{submittedPlan}</strong>. A confirmation copy of this request has been dispatched to <strong>{submittedEmail}</strong>.
                </p>
                <p className="text-xs text-green-700">
                  Our destination manager will send your customized itinerary and best rates within a few hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={triggerWhatsApp}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Follow up on WhatsApp
                  </button>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Failed to send quotation request. Please check your network or reach us directly on WhatsApp.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category & Tour Plan Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
                {/* 1. Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    1. Tour Category / Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800 bg-white font-medium"
                    required
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="other">Other / Pan-India</option>
                  </select>
                </div>

                {/* 2. Tour Plan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    2. Select Tour Plan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tourPlan"
                    value={formData.tourPlan}
                    onChange={handleInputChange}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800 bg-white font-medium"
                    required
                  >
                    <option value="">-- Choose a Tour Plan --</option>
                    {filteredPackages.length > 0
                      ? filteredPackages.map((pkg) => (
                          <option key={pkg._id} value={pkg.name}>
                            {pkg.name}
                          </option>
                        ))
                      : fallbackPlans.map((plan, idx) => (
                          <option key={idx} value={plan}>
                            {plan}
                          </option>
                        ))}
                    <option value={`Custom ${formData.category.toUpperCase()} Tailor-made Plan`}>
                      ✨ Custom Tailor-made Itinerary
                    </option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Email Address (Copy Sent Here) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Phone */}
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Travel Date */}
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Approx Travel Date
                  </label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800 bg-white"
                  />
                </div>

                {/* Travelers Count */}
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Travelers Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="travelersCount"
                    value={formData.travelersCount}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                  />
                </div>
              </div>

              {/* Message / Special Requirements */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Requirements &amp; Specific Preferences
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about hotel categories (3-star, 4-star, luxury), sightseeing preferences, arrival point, food preferences, or custom requirements..."
                  className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-white bg-primary-blue hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4 text-accent-gold" />
                {isSubmitting ? 'Sending Quote Request...' : 'Send Tour Quote Request'}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span>🔒 100% Privacy Guaranteed</span>
                <span>•</span>
                <span>📧 Instant Email Confirmation Copy</span>
                <span>•</span>
                <span>⚡ Fast Quotation Reply</span>
              </div>
            </form>
          </div>
        </div>

        {/* Google Maps Integration */}
        <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden h-[360px] w-full relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8037322960613!2d72.8313410760492!3d18.995321495147515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cef7df77d549%3A0x6b5a3f2b6a2df9b7!2sBurj%20Khalifa!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ContactFormInner />
    </Suspense>
  );
}
