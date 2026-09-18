'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle, Calendar, Users, IndianRupee, Phone, Mail, User, MapPin } from 'lucide-react';

const inquirySchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
  phoneNumber: zod.string().min(10, 'Please enter a valid phone number (minimum 10 digits)'),
  destination: zod.string().min(2, 'Please specify your destination'),
  travelDate: zod.string().min(1, 'Please select a travel date'),
  budget: zod.coerce.number().min(1000, 'Minimum budget should be ₹1,000'),
  travelersCount: zod.coerce.number().min(1, 'At least 1 traveler required'),
});

type InquiryFormValues = zod.infer<typeof inquirySchema>;

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDestination?: string;
}

export default function InquiryForm({ isOpen, onClose, prefilledDestination }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema) as any,
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      destination: prefilledDestination || '',
      travelDate: '',
      budget: 15000,
      travelersCount: 2,
    },
  });

  // Prefill destination if prop changes
  React.useEffect(() => {
    if (prefilledDestination) {
      reset((prev) => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination, reset]);

  const onSubmit = async (values: InquiryFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await axios.post('/api/inquiries', values);
      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          reset();
          onClose();
        }, 3000);
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Inquiry submit error:', error);
      setErrorMsg(error.response?.data?.message || 'Server connection failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col z-10"
          >
            {/* Success overlay */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-tropical-teal mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Inquiry Submitted!</h3>
                  <p className="text-slate-500 text-sm max-w-md">
                    Thank you for planning with MSK Holiday&apos;s. One of our travel specialists will contact you within 24 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Header */}
            <div className="gradient-primary p-6 text-white relative flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold">Start Planning Your Journey</h3>
                <p className="text-xs text-white/70 mt-1">Fill out the form below to receive a custom quote.</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-50 text-red-600 border border-red-100">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-secondary-sky" /> Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register('name')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.name ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-secondary-sky" /> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.email ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-secondary-sky" /> Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Ten-digit phone number"
                    {...register('phoneNumber')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.phoneNumber ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.phoneNumber && <span className="text-[10px] text-red-500 font-semibold">{errors.phoneNumber.message}</span>}
                </div>

                {/* Destination */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary-sky" /> Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    {...register('destination')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.destination ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.destination && <span className="text-[10px] text-red-500 font-semibold">{errors.destination.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Travel Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary-sky" /> Travel Date
                  </label>
                  <input
                    type="date"
                    {...register('travelDate')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.travelDate ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.travelDate && <span className="text-[10px] text-red-500 font-semibold">{errors.travelDate.message}</span>}
                </div>

                {/* Travelers */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-secondary-sky" /> Travelers Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('travelersCount')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.travelersCount ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.travelersCount && <span className="text-[10px] text-red-500 font-semibold">{errors.travelersCount.message}</span>}
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-secondary-sky" /> Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    {...register('budget')}
                    className={`px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all duration-200 ${
                      errors.budget ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 focus:border-primary-blue'
                    }`}
                  />
                  {errors.budget && <span className="text-[10px] text-red-500 font-semibold">{errors.budget.message}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-6 rounded-xl font-bold text-white bg-primary-blue hover:bg-opacity-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-accent-gold" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
