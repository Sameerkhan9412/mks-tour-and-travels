'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, HeartHandshake } from 'lucide-react';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    destination: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.message) {
      alert('Please fill out all fields');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        destination: formData.destination,
        travelDate: new Date().toISOString().split('T')[0], // placeholder today
        budget: 0, // placeholder
        travelersCount: 1, // placeholder
        notes: `Message: ${formData.message}`,
      };

      const res = await axios.post('/api/inquiries', payload);
      if (res.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          destination: 'General Inquiry',
          message: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 4000);
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
    const phone = '919876543210';
    const text = encodeURIComponent(
      `Hi MSK Holiday's, I am contacting you from the website contact page. I would like to plan a trip.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 gradient-primary text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-blue via-slate-900 to-brand-dark opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-1 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-extrabold tracking-widest text-accent-gold uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            Contact MSK Holiday&apos;s
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mt-4 font-medium">
            Have questions about a package, booking requests, or visa processing? Contact us anytime.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-800">Office Location</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Drop by our office or write to us. Our travel consultants are happy to assist you in designing customized holiday packages.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-50 rounded-xl text-primary-blue shadow-inner shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Address</span>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Call Us</span>
                    <p className="text-sm text-slate-600 font-bold mt-1">
                      <a href="tel:+919876543210" className="hover:text-primary-blue transition-colors">+91 98765 43210</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-slate-50 rounded-xl text-tropical-teal shadow-inner shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Us</span>
                    <p className="text-sm text-slate-600 font-bold mt-1">
                      <a href="mailto:info@mskholidays.com" className="hover:text-primary-blue transition-colors">info@mskholidays.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Support */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm text-center space-y-4">
              <MessageSquare className="w-10 h-10 text-green-500 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800">Direct Chat Support</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Need urgent travel answers? Text us on WhatsApp for real-time rates and itinerary designs.
              </p>
              <button
                onClick={triggerWhatsApp}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <HeartHandshake className="w-5.5 h-5.5 text-primary-blue" />
              Send Us a Message
            </h3>

            {submitStatus === 'success' && (
              <div className="text-sm text-green-600 p-4 bg-green-50 rounded-xl border border-green-100 font-semibold mb-6">
                ✓ Message sent successfully! Our customer support team will contact you shortly.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="text-sm text-red-600 p-4 bg-red-50 rounded-xl border border-red-100 mb-6">
                ✗ Connection failed. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@email.com"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                    required
                  />
                </div>

                {/* Destination */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trip Area / Topic</label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g. Kashmir Visa, General Booking"
                    className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="How can we help you plan your journey?"
                  className="px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-primary-blue text-slate-800"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-primary-blue hover:bg-opacity-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-sm shadow-md"
              >
                <Send className="w-4 h-4 text-accent-gold" />
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* 3. Google Maps Integration */}
        <div className="mt-16 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden h-[400px] w-full relative">
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
