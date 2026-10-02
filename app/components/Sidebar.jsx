"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  Briefcase,
  Info,
  PhoneCall,
  Heart,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Sidebar open hone par background scroll lock
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // ESC key press hone par close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/properties", icon: Building2 },
    { name: "Projects", href: "/projects", icon: Briefcase },
    { name: "About Us", href: "/about", icon: Info },
    { name: "admin/dadhboard", href: "/admin/ai-analytics", icon: PhoneCall },
  ];

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 rounded-xl text-white group-hover:bg-blue-700 transition">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-blue-900">
                Dream<span className="text-blue-600">Home</span>
              </span>
              <p className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Your Dream, Our Priority
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PHONE - Desktop */}
            <div className="hidden xl:flex items-center gap-2 pr-4 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">+91 98765 43210</p>
                <p className="text-[10px] text-slate-400">Call Us Anytime</p>
              </div>
            </div>

            {/* FAVORITE */}
            <Link
              href="/wishlist"
              className="hidden sm:flex p-2 text-slate-500 hover:text-rose-500 rounded-full hover:bg-slate-100 transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* LOGIN */}
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 transition"
            >
              Login
            </Link>

            {/* REGISTER */}
            <Link
              href="/register"
              className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shadow-blue-500/30 transition"
            >
              Register
            </Link>

            {/* MENU BUTTON */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR OVERLAY ================= */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 right-0 z-[60] h-[100dvh] w-[88%] sm:w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="shrink-0 flex items-center justify-between p-5 border-b border-slate-100">
          <Link
            href="/"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-blue-900">
                Dream<span className="text-blue-600">Home</span>
              </span>
              <p className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
                Your Dream, Our Priority
              </p>
            </div>
          </Link>

          {/* CLOSE */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SIDEBAR CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* NAV LINKS */}
          <nav className="space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* WISHLIST */}
          <div className="mt-5 pt-5 border-t border-slate-100">
            <Link
              href="/wishlist"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <span className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500" />
                Favorites / Wishlist
              </span>
              <span className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                3
              </span>
            </Link>
          </div>
        </div>

        {/* ================= SIDEBAR FOOTER ================= */}
        <div className="shrink-0 p-5 border-t border-slate-100 bg-slate-50/70">
          {/* PHONE (Direct Tel Link) */}
          <a
            href="tel:+919876543210"
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">+91 98765 43210</p>
              <p className="text-[11px] text-slate-400">Call Us Anytime</p>
            </div>
          </a>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <Link
              href="/login"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}