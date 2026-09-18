'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  Users,
  Headset,
  MapPin,
  Sparkles,
  TreePine,
  ArrowRight,
  PhoneCall,
  Eye,
  Target
} from 'lucide-react';

const whyChooseUsItems = [
  {
    id: 1,
    title: 'Unmatched Service Quality',
    desc: 'From initial inquiry to your return flight, our dedicated trip specialists provide seamless 24/7 coordination, handpicked verified hotels, and premium sanitized transport for a hassle-free vacation.',
  },
  {
    id: 2,
    title: 'Tailored Experiences',
    desc: 'Every traveler is distinct. Whether you dream of a romantic houseboat getaway in Kashmir, high-octane 4x4 safaris in Spiti, or tranquil Ayurvedic healing in Kerala, we tailor every day to your exact pace and passions.',
  },
  {
    id: 3,
    title: 'Reliability & Trust',
    desc: 'With 100% transparent pricing and zero hidden fees, you can travel with complete peace of mind. We maintain emergency support protocols and work exclusively with vetted local chauffeurs and licensed hoteliers.',
  },
  {
    id: 4,
    title: 'Passionate & Knowledgeable Team',
    desc: 'Our ground captains, local guides, and destination planners are born and raised in the regions they curate. They share deep folklore, hidden viewpoints, and authentic culinary secrets no generic guidebook can offer.',
  },
  {
    id: 5,
    title: 'Sustainable & Responsible Travel',
    desc: 'We are committed to preserving fragile ecosystems in the Himalayas and coastal belts by promoting low-impact tourism, reducing single-use plastics, and actively supporting regional homestays and artisans.',
  },
];

const teamMembers = [
  {
    name: 'Mohammad S. Khan',
    role: 'Founder & Managing Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    desc: 'Visionary entrepreneur with 15+ years of destination management leadership across Kashmir, Ladakh, and Himalayan trails.',
  },
  {
    name: 'Sarah D&apos;Souza',
    role: 'Head of Operations & Guest Experience',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    desc: 'Ensures flawless logistics, 24/7 traveler concierge support, and luxury hospitality standards across all tour packages.',
  },
  {
    name: 'Rajesh Sharma',
    role: 'Senior Consultant & Mountain Captain',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    desc: 'High-altitude route specialist with deep knowledge of Spiti, Uttarakhand, and Himachal Pradesh overland circuits.',
  },
];

const stats = [
  { label: 'Happy Travelers', value: '15,000+' },
  { label: 'Tour Categories Across India', value: '10+' },
  { label: 'Satisfaction Rate', value: '99%' },
  { label: 'Dedicated Travel Support', value: '24/7' },
];

export default function AboutPage() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Header Banner (similar to himalyantrips.com/about-us-2/) */}
      <section className="relative pt-32 pb-24 text-white text-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=1920&q=85"
            alt="Scenic India Mountains"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-accent-gold uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
            About Us
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Crafting soulful, safe, and authentic Indian journeys with personalized care, transparent pricing, and local expertise.
          </p>
        </div>
      </section>

      {/* 2. Story Section: Embark on a Journey of Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Images Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=85"
                alt="Exploring Uttarakhand & Himalayas"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-extrabold uppercase tracking-widest text-accent-gold block mb-1">
                  100% Focused on India
                </span>
                <p className="text-base font-bold">
                  From Kashmir&apos;s snow peaks to Kerala&apos;s emerald backwaters
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-blue text-white flex items-center justify-center font-black text-lg">
                15k+
              </div>
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Delighted Travelers</span>
                <span className="block text-[11px] font-semibold text-slate-400">Across 10+ Tour Categories</span>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-blue bg-primary-blue/10 px-3 py-1 rounded-full">
              Embark on a Journey of Discovery
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              We Don&apos;t Just Plan Trips; We Create Lifelong Memories
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At <strong>MSK Holiday&apos;s</strong>, our story began with a profound love for the incredible diversity of India. From the mist-laden pine valleys of Kashmir and Himachal to the tranquil houseboats of Kerala, the sand dunes of Rajasthan, and the dramatic high-altitude moonscapes of Spiti and Ladakh.
            </p>

            <p className="text-sm text-slate-500 leading-relaxed">
              We recognized that traveling should never feel rushed or commercialized. By eliminating middlemen and collaborating directly with verified regional hosts, drivers, and hoteliers, we deliver honest itineraries crafted around your comfort, safety, and authentic local experiences.
            </p>

            {/* Mission & Vision Mini-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-primary-blue/10 text-primary-blue flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Our Mission</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To provide authentic, immersive travel experiences that connect people with the natural wonders, rich cultures, and diverse landscapes of India safely and sustainably.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Our Vision</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To be India&apos;s most trusted and cherished travel partner, recognized globally for tailored itineraries, deep local community ties, and customer-first care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section (himalyantrips.com/about-us-2 style) */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-blue bg-slate-100 px-4 py-1.5 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Trust In Us, We&apos;ve Got You Covered
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium">
              Every detail of your itinerary is managed by seasoned professionals so you can relax and savor every moment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Accordions */}
            <div className="lg:col-span-7 space-y-4">
              {whyChooseUsItems.map((item) => {
                const isExpanded = activeAccordion === item.id;
                return (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/50"
                  >
                    <button
                      onClick={() => toggleAccordion(item.id)}
                      className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                        isExpanded ? 'bg-primary-blue text-white' : 'hover:bg-slate-100/70 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                            isExpanded ? 'bg-white/20 text-white' : 'bg-primary-blue/10 text-primary-blue'
                          }`}
                        >
                          0{item.id}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold tracking-tight">{item.title}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-white' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 text-xs sm:text-sm text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                            {item.desc}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right Photo Grid Collage */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1595815729819-bf9c51f62b8a?auto=format&fit=crop&w=600&q=80"
                  alt="Kashmir Valley"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Kashmir
                </span>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm group mt-6">
                <Image
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
                  alt="Spiti Valley"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Spiti
                </span>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm group -mt-6">
                <Image
                  src="https://images.unsplash.com/photo-1602216056096-3c40cc0c9944?auto=format&fit=crop&w=600&q=80"
                  alt="Kerala Backwaters"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Kerala
                </span>
              </div>

              <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm group">
                <Image
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
                  alt="Rajasthan Forts"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  Rajasthan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Stats Counters Banner */}
      <section className="py-16 bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-3xl sm:text-5xl font-black text-accent-gold block tracking-tight">
                  {st.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 font-bold tracking-wide block uppercase">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leadership & Team Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary-blue bg-primary-blue/10 px-4 py-1.5 rounded-full">
            Our Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meet Our Leadership Team
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium">
            Passionate travelers, certified mountain guides, and hospitality professionals united by a love for India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 text-center shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-slate-100 shadow-md mb-4 bg-slate-100 group-hover:scale-105 transition-transform">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">{member.name}</h3>
              <span className="text-xs font-bold text-secondary-sky tracking-wider block mt-1">
                {member.role}
              </span>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-blue to-slate-900 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-accent-gold bg-white/10 px-4 py-1.5 rounded-full">
              Explore India With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready To Plan Your Unforgettable Indian Journey?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Connect with our local travel consultants to customize your package across Uttarakhand, Kashmir, Spiti, Kerala, Rajasthan, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/packages"
                className="w-full sm:w-auto px-8 py-3.5 bg-accent-gold hover:bg-yellow-400 text-slate-900 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Browse Tour Packages
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-extrabold tracking-wider uppercase transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-accent-gold" />
                Contact Our Experts
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
