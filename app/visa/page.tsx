'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, HelpCircle, ShieldAlert, BadgeCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const visaData = [
  {
    country: 'Dubai (UAE)',
    category: 'Tourist / Visit Visa',
    processingTime: '2 - 3 Working Days',
    validity: '30 Days / 60 Days (Single/Multiple Entry)',
    documents: [
      'Scanned color copy of Passport first & last page (valid for 6 months).',
      'One passport-size photograph with white background (scanned).',
      'Confirmed return flight tickets (optional but recommended).',
      'PAN Card copy of the applicant.'
    ],
    fee: '₹7,500 onwards'
  },
  {
    country: 'Singapore',
    category: 'Tourist eVisa',
    processingTime: '3 - 5 Working Days',
    validity: 'Up to 2 Years (Multiple Entry, 30 days stay per visit)',
    documents: [
      'Original passport valid for 6 months from travel date.',
      'Two recent passport-size photos (35x45mm, matte finish, white background).',
      'Duly filled Visa Form 14A.',
      'Bank statement for last 3 months with healthy balance.',
      'Covering letter stating travel itinerary.'
    ],
    fee: '₹3,200 onwards'
  },
  {
    country: 'Thailand',
    category: 'Tourist Visa / eVisa on Arrival',
    processingTime: '3 Working Days (eVisa) / Instantly on arrival',
    validity: '15 Days (Visa on Arrival) / 60 Days (Tourist Visa)',
    documents: [
      'Passport valid for at least 6 months with 2 blank pages.',
      'Two recent photographs (4x6 cm, white background).',
      'Confirmed return flight tickets within 15/60 days.',
      'Proof of hotel accommodation reservation in Thailand.',
      'Proof of funds (minimum 10,000 THB per person).'
    ],
    fee: '₹4,500 (eVisa) / 2,000 THB (Arrival)'
  },
  {
    country: 'Schengen (Europe)',
    category: 'Schengen Short-Stay Visa (Type C)',
    processingTime: '15 Calendar Days',
    validity: 'Based on itinerary (Single/Multiple Entry)',
    documents: [
      'Passport valid for 6 months with at least 3 blank pages.',
      'Schengen visa application form signed.',
      'Travel insurance covering minimum €30,000 medical coverage.',
      'Confirmed round-trip flight bookings and hotel vouchers.',
      'Detailed day-wise travel itinerary letter.',
      'Income Tax Returns (ITR) for last 3 years and bank statement for last 6 months.'
    ],
    fee: '₹9,800 onwards (including VFS fees)'
  }
];

const faqs = [
  {
    q: 'How early should I apply for my tourist visa?',
    a: 'We recommend applying at least 15 to 30 days before your intended travel date for eVisas, and 45 days in advance for paper-based visa applications (like Schengen or UK) to account for any peak season processing delays.'
  },
  {
    q: 'Is the visa application fee refundable if rejected?',
    a: 'No, visa consulate and processing fees are collected by the respective governments and visa facilitation centers (like VFS) to evaluate your application, and are non-refundable regardless of the decision.'
  },
  {
    q: 'Can I travel if my passport expires in less than 6 months?',
    a: 'Almost all countries strictly require your passport to be valid for at least 6 months from your date of entry. Traveling with less than 6 months validity will lead to boarding rejection at immigration.'
  },
  {
    q: 'What is the difference between Single Entry and Multiple Entry visas?',
    a: 'A Single Entry visa allows you to enter the country once; if you leave, you cannot re-enter on the same visa even if it is still valid. A Multiple Entry visa allows you to exit and re-enter the country multiple times during the visa validity window.'
  }
];

export default function VisaPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Inquiry state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    destination: 'Dubai (UAE) Visa',
    travelDate: '',
    travelersCount: '1',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitVisa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.travelDate) {
      alert('Please fill out all fields');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        ...formData,
        budget: 5000, // standard visa processing fee estimate
        travelersCount: Number(formData.travelersCount),
      };

      const res = await axios.post('/api/inquiries', payload);
      if (res.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          destination: 'Dubai (UAE) Visa',
          travelDate: '',
          travelersCount: '1',
        });
        setTimeout(() => setSubmitStatus('idle'), 4000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('Visa inquiry submit error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 gradient-primary text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-blue via-slate-900 to-brand-dark opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-1 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-extrabold tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Hassle-Free Processing
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            Visa Services & Assistance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-medium">
            Get professional guidance for documentation, application submissions, and quick tourist visa approvals.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Interactive Guides */}
          <div className="lg:col-span-2 space-y-12">
            {/* Country Selector Tabs */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BadgeCheck className="w-5.5 h-5.5 text-primary-blue" />
                Popular Country Visa Guides
              </h3>

              {/* Tab headers */}
              <div className="flex gap-2 border-b border-slate-100 pb-3 mb-6 overflow-x-auto">
                {visaData.map((v, idx) => (
                  <button
                    key={v.country}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all shrink-0 cursor-pointer ${
                      activeTab === idx
                        ? 'bg-primary-blue text-white shadow-sm'
                        : 'text-slate-500 hover:text-primary-blue hover:bg-slate-50'
                    }`}
                  >
                    {v.country}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                        Visa Category
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800 mt-1">
                        {visaData[activeTab].category}
                      </h4>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">
                        Estimated Fee
                      </span>
                      <span className="text-base font-black text-primary-blue mt-1 inline-block">
                        {visaData[activeTab].fee}
                      </span>
                    </div>
                  </div>

                  {/* Processing info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-3 items-start p-4 border border-slate-100 rounded-xl bg-white">
                      <Clock className="w-5 h-5 text-secondary-sky shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Processing Time
                        </span>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          {visaData[activeTab].processingTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-4 border border-slate-100 rounded-xl bg-white">
                      <FileText className="w-5 h-5 text-tropical-teal shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Validity & Entry
                        </span>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">
                          {visaData[activeTab].validity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-accent-gold" /> Required Checklist Documents
                    </h5>
                    <ul className="space-y-2.5">
                      {visaData[activeTab].documents.map((doc, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                          <span className="text-primary-blue text-xs shrink-0 mt-1">■</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5.5 h-5.5 text-primary-blue" />
                Frequently Asked Visa Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, idx) => {
                  const isFaqOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-250"
                    >
                      <button
                        onClick={() => setOpenFaq(isFaqOpen ? null : idx)}
                        className={`w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 text-sm transition-colors duration-200 ${
                          isFaqOpen ? 'bg-slate-50' : 'bg-white'
                        }`}
                      >
                        <span>{faq.q}</span>
                        <span className="text-primary-blue font-bold text-xs">
                          {isFaqOpen ? '[-]' : '[+]'}
                        </span>
                      </button>
                      {isFaqOpen && (
                        <div className="p-4 border-t border-slate-100 text-slate-500 text-xs leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-4">
              <h4 className="text-base font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Send className="w-4 h-4 text-primary-blue" />
                Visa Application Inquiry
              </h4>

              {submitStatus === 'success' && (
                <div className="text-xs text-green-600 p-3 bg-green-50 rounded-xl border border-green-100 font-semibold">
                  ✓ Visa request received! A specialist will contact you to collect documents.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="text-xs text-red-600 p-3 bg-red-50 rounded-xl border border-red-100">
                  ✗ Connection error. Please try again.
                </div>
              )}

              <form onSubmit={handleSubmitVisa} className="space-y-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@email.com"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Destination Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country Visa Needed</label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-600 bg-white"
                  >
                    <option value="Dubai (UAE) Visa">Dubai (UAE) Visa</option>
                    <option value="Singapore Visa">Singapore Visa</option>
                    <option value="Thailand Visa">Thailand Visa</option>
                    <option value="Schengen (Europe) Visa">Schengen (Europe) Visa</option>
                    <option value="Other Country Visa">Other Country Visa</option>
                  </select>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Travel Date</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleInputChange}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-500"
                    required
                  />
                </div>

                {/* Travelers */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applicants Count</label>
                  <select
                    name="travelersCount"
                    value={formData.travelersCount}
                    onChange={handleInputChange}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-primary-blue text-slate-600 bg-white"
                  >
                    <option value="1">1 Applicant</option>
                    <option value="2">2 Applicants</option>
                    <option value="3">3 Applicants</option>
                    <option value="4">4 Applicants</option>
                    <option value="5">5+ Applicants</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-white bg-primary-blue hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-accent-gold" />
                  Submit Assistance Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
