'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const destinations = [
    { name: 'Uttarakhand', href: '/packages?category=uttarakhand' },
    { name: 'Kashmir', href: '/packages?category=kashmir' },
    { name: 'Himachal Pradesh', href: '/packages?category=himachal-pradesh' },
    { name: 'Goa', href: '/packages?category=goa' },
    { name: 'Rajasthan', href: '/packages?category=rajasthan' },
    { name: 'Ladakh', href: '/packages?category=ladakh' },
    { name: 'Kerala', href: '/packages?category=kerala' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tour Packages', href: '/packages' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    // { name: 'Admin Portal', href: '/admin/dashboard' },
  ];

  return (
    <footer className="relative bg-brand-dark text-slate-300 pt-16 pb-8 border-t border-slate-800 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full filter blur-[150px] opacity-10 -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-sky rounded-full filter blur-[150px] opacity-10 -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Intro */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-accent-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-wider leading-none">
                  MSK HOLIDAY&apos;S
                </span>
                <span className="text-[10px] font-bold text-secondary-sky tracking-widest leading-none mt-1">
                  INDIA TOURS & EXPEDITIONS
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted partner for authentic India travel. From the majestic snow-capped peaks of the Himalayas to serene coastal backwaters, we craft customized, stress-free journeys across India.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-blue hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-3.3 0-6 2.7-6 6v1z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-secondary-sky hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200"
                aria-label="Youtube"
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-10 after:h-0.5 after:bg-accent-gold">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-10 after:h-0.5 after:bg-accent-gold">
              Destinations
            </h4>
            <ul className="space-y-3 text-sm">
              {destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-6 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-10 after:h-0.5 after:bg-accent-gold">
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <span>
                  102, Royal Plaza Building,
                  <br />
                  Near Metro Station, Mumbai, MH - 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-gold shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors duration-200">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-gold shrink-0" />
                <a
                  href="mailto:info@mskholidays.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  info@mskholidays.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} MSK Holiday&apos;s Travel & Tours. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
