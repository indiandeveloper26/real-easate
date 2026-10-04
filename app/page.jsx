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
import { useGetRecentPropertiesQuery } from "../RTK/services/propertyApi";
import Image from "next/image";

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











  const { data, isLoading, isFetching, isError, refetch, } = useGetRecentPropertiesQuery();


  const properties = data?.properties || [];



  console.log('datata', properties)




























  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Header / Navbar */}


      {/* 2. Hero Section */}


      <section className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-center bg-slate-950 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/img.png"
          alt="Luxury Modern Villa Architecture"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-center scale-100 sm:scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Responsive Contrast Overlays */}
        {/* Mobile: Top-to-bottom dark gradient taaki mobile par text 100% sharp aur readable rahe */}
        <div className="absolute inset-0 bg-slate-950/75 sm:hidden" />

        {/* Desktop/Tablet: Left-to-right gradient jisse text safe rahe aur luxury house bhi clear dikhe */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Main Content Area */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 w-full flex flex-col justify-between">
          <div className="max-w-2xl text-white">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs tracking-wider uppercase font-bold text-blue-400 bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm">
              Find Your Perfect Home
            </span>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-3 mb-3 sm:mb-4 leading-[1.18] sm:leading-[1.15]">
              Find Your <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200">
                Dream Property
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed font-normal max-w-xl">
              Buy, Rent or Invest in the best properties across Lucknow. We make your property journey simple, secure and stress-free.
            </p>

            {/* Mobile Trusted Badge (Phone par content ke sath clean compact strip dikhegi) */}
            <div className="flex sm:hidden items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 w-fit">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                <strong className="text-white font-bold">10,000+</strong> Happy Families Trust Us
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Trusted Floating Badge */}
          <div className="absolute right-6 lg:right-8 bottom-8 hidden sm:flex items-center gap-3.5 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-white/20">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-inner shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 leading-none">
                Trusted by 10,000+
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1 leading-none">
                Happy Families
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories / Quick Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {categories.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 w-full">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">
                  {item.subtitle}
                </p>
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
                {/* WhatsApp Button */}
                <button
                  onClick={() => {
                    const phone = "919876543210"; // Apna WhatsApp number daalo
                    const message = "Hello, mujhe is property ke baare mein details chahiye.";

                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>

                {/* OR */}
                <div className="relative text-center my-2">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold bg-white px-2">
                    Or
                  </span>
                </div>

                {/* Book Site Visit */}
                <Link
                  href="/request-property"
                  className="w-full py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Site Visit</span>
                </Link>
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


      {/* Property Listing CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 sm:px-12 sm:py-12 shadow-xl">

          {/* Background Decoration */}
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Text Content */}
            <div className="max-w-2xl text-center md:text-left text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-blue-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Find Your Perfect Property
              </span>

              <h3 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                Discover Properties That
                <span className="block text-blue-400">
                  Feel Like Home
                </span>
              </h3>

              <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-slate-300">
                Explore available homes, apartments, plots and commercial
                properties. Compare prices, view photos and find a property
                that matches your needs.
              </p>

              <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Multiple Property Types
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Buy or Rent
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex w-full flex-col gap-3 sm:w-auto sm:min-w-52">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-400"
              >
                View Properties
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/request-property"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Find a Property
                <Search className="h-4 w-4" />
              </Link>
            </div>

          </div>
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
          <Link
            href={"/properties"}

          >
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
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