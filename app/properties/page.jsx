"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Building2,
  Eye,
  Heart,
  Loader2,
  RefreshCw,
  AlertCircle,
  Tag,
  Phone,
  MessageCircle,
  Search,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useGetPropertiesQuery } from "../../RTK/services/propertyApi";

// Real-estate Indian Currency Formatter
function formatPrice(val, listingType) {
  const num = Number(val || 0);
  if (!num) return "Price on Request";

  const isRent = listingType?.toLowerCase() === "rent";
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

  return isRent ? `${formatted} / mo` : formatted;
}

// Relative listing time
function formatTimeAgo(dateString) {
  if (!dateString) return "Recently listed";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

export default function UserPropertyListingsPage() {
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const loaderRef = useRef(null);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPropertiesQuery(page);

  const properties = data?.properties || [];
  const pagination = data?.pagination;
  const hasMore = pagination?.hasMore ?? false;

  // Infinite Scroll Handler
  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // Client Side Filtering & Search
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesType =
        selectedFilter === "all"
          ? true
          : (p.listingType || "").toLowerCase() === selectedFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.title || "").toLowerCase().includes(q) ||
        (p.location?.city || "").toLowerCase().includes(q) ||
        (p.location?.locality || "").toLowerCase().includes(q) ||
        (p.propertyType || "").toLowerCase().includes(q);

      return matchesType && matchesSearch;
    });
  }, [properties, selectedFilter, searchQuery]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-3">
            <div className="h-6 w-36 animate-pulse rounded-full bg-slate-100" />
            <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-100" />
          </div>
          <div className="h-14 w-full animate-pulse rounded-2xl bg-slate-100" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-96 w-full animate-pulse rounded-3xl border border-slate-100 bg-slate-50/60"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (isError) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-white p-6 text-slate-800">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-lg font-bold text-[#0a1931]">Listings load nahi ho saki</h2>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            {error?.data?.message || "Server se connect karne mein samasya aayi. Kripya dobara try karein."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0a1931] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-[#0a1931]/10 active:scale-95 cursor-pointer"
          >
            <RefreshCw size={14} /> Retry Loading
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Top Gradient Glow Accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-50/60 via-white to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        
        {/* HERO TITLE & STATS */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-blue-700">
              <Sparkles size={13} className="text-blue-600" />
              <span>Verified Real Estate Marketplace</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a1931]">
              Explore Dream Properties
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Find verified villas, luxury apartments, and ready-to-move stays.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Available Homes:{" "}
            <span className="font-extrabold text-[#0a1931]">
              {filteredProperties.length}
            </span>
          </div>
        </div>

        {/* SEARCH BAR & FILTER PILLS */}
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by city, title, or property type (e.g. Lucknow, 2 BHK, Flat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-xs transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: "all", label: "All Properties" },
              { id: "sale", label: "For Sale" },
              { id: "rent", label: "For Rent" },
            ].map((tab) => {
              const active = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                    active
                      ? "bg-[#0a1931] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PROPERTY LISTINGS GRID (2 PER ROW) */}
        {filteredProperties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-14 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400">
              <Building2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-[#0a1931]">
              Koi property nahi mili
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Apna search term badal kar ya filter reset karke dobara check karein.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map((property) => (
              <UserPropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL LOADER */}
        <div ref={loaderRef} className="flex min-h-16 items-center justify-center py-6">
          {isFetching && (
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-[#0a1931] shadow-xs">
              <Loader2 size={15} className="animate-spin text-blue-600" />
              Loading more properties...
            </div>
          )}
          {!isFetching && !hasMore && properties.length > 0 && (
            <p className="text-xs font-medium text-slate-400">
              ✓ Aapne sabhi verified properties dekh li hain.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}

// PREMIUM 2-COLUMN PROPERTY CARD
function UserPropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false);

  const image =
    property.coverImage ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80";

  const listingType = (property.listingType || "sale").toLowerCase();
  const isRent = listingType === "rent";
  const contactPhone = property?.contactPhone || property?.agentPhone || "919876543210";
  const whatsappNumber = String(contactPhone).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Namaste! I am interested in your property: "${property.title}" located in ${property.location?.city || "your city"}. Please share details.`
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5">
      
      {/* CARD TOP: IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 sm:aspect-[16/9]">
        <img
          src={image}
          alt={property.title || "Property"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5">
          {isRent ? (
            <span className="rounded-lg bg-[#0a1931]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              For Rent
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
              <Tag size={11} /> For Sale
            </span>
          )}

          {property.propertyType && (
            <span className="hidden sm:inline-block rounded-lg bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-slate-800 shadow-xs">
              {property.propertyType}
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          title="Save Property"
          className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white active:scale-90 cursor-pointer"
        >
          <Heart
            size={15}
            className={isSaved ? "fill-rose-500 text-rose-500" : "transition group-hover:text-rose-500"}
          />
        </button>

        {/* Bottom Floating Price & Time Ago */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <div className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs sm:text-sm font-extrabold text-[#0a1931] shadow-sm border border-slate-100">
            {formatPrice(property.price, property.listingType)}
          </div>

          <div className="rounded-lg bg-[#0a1931]/80 backdrop-blur-md px-2 py-1 text-[10px] font-medium text-white shadow-xs">
            {formatTimeAgo(property.createdAt)}
          </div>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        
        <div>
          <Link
            href={`/properties/${property._id}`}
            className="group/title flex items-start justify-between gap-2"
          >
            <h2 className="text-base font-bold text-[#0a1931] transition group-hover/title:text-blue-600 line-clamp-1">
              {property.title || "Luxury Property"}
            </h2>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-slate-300 transition group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-blue-600"
            />
          </Link>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <MapPin size={13} className="shrink-0 text-blue-600" />
            <span>
              {property.location?.locality ? `${property.location.locality}, ` : ""}
              {property.location?.city || "Lucknow"}
            </span>
          </p>
        </div>

        {/* KEY SPECS (Beds, Baths, Area) */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50/80 border border-slate-100 py-2.5 px-3 text-center text-xs">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 font-bold text-[#0a1931]">
              <BedDouble size={14} className="text-blue-600" />
              <span>{property.bedrooms || "-"}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Beds</span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-200/60">
            <div className="flex items-center gap-1 font-bold text-[#0a1931]">
              <Bath size={14} className="text-blue-600" />
              <span>{property.bathrooms || "-"}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Baths</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 font-bold text-[#0a1931]">
              <Maximize2 size={13} className="text-blue-600" />
              <span className="truncate">
                {property.area
                  ? typeof property.area === "number"
                    ? `${property.area}`
                    : property.area
                  : "1200"}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Sq.Ft.</span>
          </div>
        </div>

        {/* ACTIONS BAR */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${contactPhone}`}
              title="Call Owner / Agent"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              <Phone size={14} />
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
            >
              <MessageCircle size={15} />
            </a>
          </div>

          <Link
            href={`/properties/${property._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0a1931] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700 active:scale-95"
          >
            <Eye size={13} />
            <span>View Details</span>
          </Link>
        </div>

      </div>

    </div>
  );
}