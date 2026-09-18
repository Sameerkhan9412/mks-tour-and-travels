'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import axios from 'axios';
import { Globe, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await axios.post('/api/auth/login', values);
      if (res.data.success) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setErrorMsg('Invalid credentials. Please try again.');
      }
    } catch (error: any) {
      console.error('Login submit error:', error);
      setErrorMsg(
        error.response?.data?.message || 'Connection failed. Please check credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-blue rounded-full filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-sky rounded-full filter blur-[150px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary-blue flex items-center justify-center shadow-lg border border-slate-700 animate-float mb-4">
            <Globe className="w-6 h-6 text-accent-gold" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wider">
            MSK HOLIDAY&apos;S
          </h2>
          <p className="text-[10px] font-bold text-secondary-sky tracking-widest uppercase mt-1">
            Control Center Log In
          </p>
        </div>

        <div className="glass-dark border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-white text-base font-bold mb-6 text-center border-b border-slate-800 pb-3">
            Admin Authentication
          </h3>

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-950/50 text-red-400 border border-red-900/50 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-secondary-sky" /> Email Address
              </label>
              <input
                type="email"
                placeholder="admin@email.com"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border text-sm text-white focus:outline-none focus:border-primary-blue transition-all ${
                  errors.email ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-secondary-sky" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border text-sm text-white focus:outline-none focus:border-primary-blue transition-all ${
                    errors.password ? 'border-red-500' : 'border-slate-800'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <span className="text-[10px] text-red-500 font-semibold">{errors.password.message}</span>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 mt-2 rounded-xl font-bold text-slate-900 bg-accent-gold hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-md"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                'Secure Log In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Secure admin connection. Unauthorized access attempts are monitored.
          </p>
        </div>
      </div>
    </div>
  );
}
