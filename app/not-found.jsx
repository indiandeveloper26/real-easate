"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Search,
  ArrowLeft,
  Building2,
  Compass,
  Phone,
  MessageCircle,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Mini Brand Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Building2 className="w-5 h-5" />
          </div>
          <div>

            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Your Dream, Our Priority
            </p>
          </div>
        </Link>

        <a
          href="tel:+919876543210"
          className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <Phone className="w-3.5 h-3.5 text-blue-600" />
          <span>+91 98765 43210</span>
        </a>
      </header>

      {/* 2. Main Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-extrabold uppercase tracking-widest mb-6">
          <HelpCircle className="w-4 h-4 text-blue-600" /> 404 Error • Property Not Found
        </div>

        {/* Big Stylized 404 Graphic */}
        <div className="relative mb-6">
          <span className="text-8xl sm:text-9xl font-black text-slate-200/80 tracking-tighter select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-600/30 flex items-center justify-center animate-bounce">
              <Compass className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
          </div>
        </div>

        {/* Error Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-xl">
          Ye Property Ya Page Maujood Nahi Hai!
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
          Lagta hai jo URL aap dhoondh rahe hain wo move ho chuka hai ya fir list se hata diya gaya hai. Chaliye aapko sahi property par le chalte hain.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition active:scale-95"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/request-property"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <Search className="w-4 h-4 text-blue-600" /> Property Finder
          </Link>
        </div>

        {/* Quick Help Card */}
        <div className="mt-12 w-full max-w-xl bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quick Navigation / Best Deals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-slate-700 flex flex-col items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Flats / 3 BHK</span>
            </Link>
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-slate-700 flex flex-col items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-emerald-600" />
              <span>Luxury Villas</span>
            </Link>
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition text-slate-700 flex flex-col items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Commercial</span>
            </Link>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition flex flex-col items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Help</span>
            </a>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60">
        <p>© 2026 DreamHome. All rights reserved. • Gomti Nagar, Lucknow, Uttar Pradesh</p>
      </footer>
    </div>
  );
}