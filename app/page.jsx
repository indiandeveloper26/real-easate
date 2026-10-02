"use client";

import React, { useState } from "react";
import {
  Phone,
  Heart,
  Search,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  Building2,
  KeyRound,
  Compass,
  TrendingUp,
  BedDouble,
  Maximize2,
  ArrowRight,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Dummy Data
const featuredProperties = [
  {
    id: 1,
    tag: "For Sale",
    tagColor: "bg-blue-600",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    title: "Green Valley Residency",
    location: "Lucknow, Uttar Pradesh",
    bhk: "3 BHK",
    size: "1450 Sq.Ft",
    price: "₹ 75,00,000",
  },
  {
    id: 2,
    tag: "For Sale",
    tagColor: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    title: "Royal Enclave Villas",
    location: "Lucknow, Uttar Pradesh",
    bhk: "4 BHK",
    size: "2800 Sq.Ft",
    price: "₹ 1,80,00,000",
  },
  {
    id: 3,
    tag: "For Rent",
    tagColor: "bg-indigo-600",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    title: "Skyline Apartments",
    location: "Lucknow, Uttar Pradesh",
    bhk: "2 BHK",
    size: "1100 Sq.Ft",
    price: "₹ 18,000/month",
  },
  {
    id: 4,
    tag: "For Sale",
    tagColor: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    title: "Green Park Plot",
    location: "Lucknow, Uttar Pradesh",
    bhk: "Plot",
    size: "1200 Sq.Ft",
    price: "₹ 36,00,000",
  },
];

const categories = [
  { icon: HomeIcon, title: "Buy Property", subtitle: "Find your dream home" },
  { icon: KeyRound, title: "Rent Property", subtitle: "Flexible living options" },
  { icon: Building2, title: "Commercial Spaces", subtitle: "For your business" },
  { icon: Compass, title: "Plots & Land", subtitle: "Build your future" },
  { icon: TrendingUp, title: "Investment Opportunities", subtitle: "Grow your wealth" },
];

const popularProjects = [
  {
    id: 1,
    tag: "Under Construction",
    title: "Omaxe Heights",
    location: "Gomti Nagar Extension, Lucknow",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    tag: "Ready to Move",
    title: "Eldeco City",
    location: "IIM Road, Lucknow",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    tag: "Under Construction",
    title: "Shalimar Titanium",
    location: "Vibhuti Khand, Lucknow",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    tag: "Ready to Move",
    title: "Rishita Manhattan",
    location: "Amar Shaheed Path, Lucknow",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
  },
];

export default function page() {
  const [activeTab, setActiveTab] = useState("Buy");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Header / Navbar */}
   

      {/* 2. Hero Section */}
      <section className="relative min-h-[580px] flex items-center bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Building"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white">
            <span className="text-xs tracking-widest uppercase font-semibold text-blue-400">
              Find Your Perfect Home
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mt-2 mb-4 leading-tight">
              Find Your <br />
              <span className="text-white">Dream Property</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed font-light">
              Buy, Rent or Invest in the best properties across Lucknow. We make your property journey simple, secure and stress-free.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl max-w-4xl border border-slate-100/50">
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-4 mb-4">
              {["Buy", "Rent", "Commercial"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location</p>
                  <select className="bg-transparent text-sm font-semibold text-slate-700 w-full outline-none">
                    <option>Select Location</option>
                    <option>Gomti Nagar</option>
                    <option>Hazratganj</option>
                    <option>Indira Nagar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <HomeIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Property Type</p>
                  <select className="bg-transparent text-sm font-semibold text-slate-700 w-full outline-none">
                    <option>All Types</option>
                    <option>Apartment / Flat</option>
                    <option>Villa</option>
                    <option>Plot / Land</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <IndianRupee className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Budget</p>
                  <select className="bg-transparent text-sm font-semibold text-slate-700 w-full outline-none">
                    <option>Select Budget</option>
                    <option>₹ 30L - 60L</option>
                    <option>₹ 60L - 1 Cr</option>
                    <option>₹ 1 Cr+</option>
                  </select>
                </div>
              </div>

              <button className="w-full h-full min-h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Trusted Badge */}
          <div className="absolute right-8 bottom-8 hidden lg:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Trusted by 10,000+</p>
              <p className="text-xs text-slate-500">Happy Families</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories / Quick Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Properties & Help Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Handpicked properties for you. Explore the best deals in top locations.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
          >
            View All Properties <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Properties Grid (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.slice(0, 3).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 text-white text-[11px] font-bold px-3 py-1 rounded-full ${property.tagColor}`}
                  >
                    {property.tag}
                  </span>
                  <button className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow backdrop-blur-sm transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                      {property.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {property.location}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 my-4 py-2 border-y border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-slate-400" /> {property.bhk}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-slate-400" /> {property.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">Price</span>
                      <span className="text-base font-extrabold text-slate-900">{property.price}</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-600 border border-slate-200 transition">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Sidebar Widget */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Need Help?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Our property experts are just a WhatsApp message away!
              </p>

              <div className="mt-6 space-y-3">
                <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
                <div className="relative text-center my-2">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold bg-white px-2">Or</span>
                </div>
                <button className="w-full py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition">
                  <CalendarCheck className="w-4 h-4" />
                  <span>

                    <Link href={"/request-property"}>
                        Book Site Visit
                    </Link>
                    
                

                  </span>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Best Price Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-indigo-500" />
                <span>Dedicated Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sell / Rent CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 px-8 py-10 sm:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="relative z-10 max-w-xl text-white">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-blue-300">
              Want to sell or rent your property?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-2">
              Get the Best Value for Your Property
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Reach thousands of genuine buyers and renters. <Link href={"/request-property"}>
              
              List your property</Link>
              
               with us today!
            </p>
          </div>
          <button className="relative z-10 bg-white hover:bg-slate-100 text-blue-900 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition">
            List Your Property <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 6. Popular Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Projects
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore our handpicked projects in the most sought-after locations.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition group"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-600">
                  {project.tag}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3" /> {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}