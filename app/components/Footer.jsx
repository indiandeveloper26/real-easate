"use client";

import React from "react";
import {
  Home as HomeIcon,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <HomeIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Dream<span className="text-blue-500">Home</span>
                </span>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Your Dream, Our Priority
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Lucknow aur aas-paas ke areas mein verified properties, villas aur commercial plots khareedne aur rent karne ka sabse bharosemand platform.
            </p>

            {/* Social Icons (Pure SVG - No Import Errors) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition duration-300"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {["About Us", "Properties", "Featured Projects", "Our Agents", "Contact Us"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-400 transition flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Property Types
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                "Luxury Apartments",
                "Residential Villas",
                "Commercial Shops",
                "Plots & Land",
                "Studio Flats",
              ].map((type) => (
                <li key={type}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-blue-400 transition flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-500" />
                    <span>{type}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Contact Details
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Gomti Nagar, Lucknow, Uttar Pradesh 226010</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@dreamhome.com</span>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs text-slate-300 font-semibold mb-2">Subscribe for Updates</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DreamHome. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}