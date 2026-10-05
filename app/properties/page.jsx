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

  return isRent ? `${formatted} / month` : formatted;
}

// Relative listing time
function formatTimeAgo(dateString) {
  if (!dateString) return "Recently listed";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Listed today";
  if (diffDays === 1) return "Listed yesterday";
  if (diffDays < 30) return `Listed ${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Listed ${diffMonths}mo ago`;
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
        (p.propertyType || "").toLowerCase().includes(q);

      return matchesType && matchesSearch;
    });
  }, [properties, selectedFilter, searchQuery]);

  // Loading Skeleton (2 columns)
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-10 w-60 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 w-full animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
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
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 p-6 text-slate-800">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
          <AlertCircle size={36} className="mx-auto mb-3 text-rose-500" />
          <h2 className="text-base font-bold text-slate-900">Listings load nahi ho saki</h2>
          <p className="mt-1 text-xs text-slate-500">
            {error?.data?.message || "Kripya connection check karein aur dobara koshish karein."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 shadow-md shadow-blue-700/20 active:scale-95"
          >
            <RefreshCw size={14} /> Dobara Koshish Karein
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HERO TITLE & STATS */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
              <Sparkles size={12} className="text-blue-600" /> Verified Properties Marketplace
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Explore Dream Homes
            </h1>
            <p className="text-xs text-slate-500">
              Find luxury villas, modern apartments, and premium rental stays.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Available Listings:{" "}
            <span className="font-bold text-blue-900">
              {filteredProperties.length}
            </span>
          </div>
        </div>

        {/* SEARCH BAR & FILTER TABS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by city, title, or property type (e.g. Lucknow, Flat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", label: "All Properties" },
              { id: "sale", label: "For Sale" },
              { id: "rent", label: "For Rent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  selectedFilter === tab.id
                    ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROPERTY LISTINGS - 2 PER ROW */}
        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto mb-2 text-slate-400" size={34} />
            <h3 className="text-sm font-bold text-slate-700">
              Koi property nahi mili
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Apna search filter badal kar dobara check karein.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProperties.map((property) => (
              <UserPropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL SPINNER */}
        <div ref={loaderRef} className="flex min-h-16 items-center justify-center py-4">
          {isFetching && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Loader2 size={16} className="animate-spin text-blue-700" />
              Loading more properties...
            </div>
          )}
          {!isFetching && !hasMore && properties.length > 0 && (
            <p className="text-[11px] text-slate-400">
              Aapne sabhi properties dekh li hain.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}

// 2-ROW GRID COMPACT PROPERTY CARD
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
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      
      {/* CARD TOP: IMAGE */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-52">
        <img
          src={image}
          alt={property.title || "Property"}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Listing Badge */}
        <div className="absolute left-3 top-3">
          {isRent ? (
            <span className="rounded-lg bg-blue-700/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow">
              For Rent
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white shadow">
              <Tag size={11} /> For Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow backdrop-blur-md transition hover:bg-white active:scale-90"
        >
          <Heart
            size={15}
            className={isSaved ? "fill-rose-500 text-rose-500" : ""}
          />
        </button>

        {/* Floating Price Tag */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-slate-900/85 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow">
          {formatPrice(property.price, property.listingType)}
        </div>

        {/* Floating Time Ago */}
        <div className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-slate-200 backdrop-blur-sm">
          {formatTimeAgo(property.createdAt)}
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        
        <div>
          <Link
            href={`/properties/${property._id}`}
            className="block text-base font-bold text-slate-900 transition hover:text-blue-700 line-clamp-1"
          >
            {property.title || "Luxury Home with Garden"}
          </Link>

          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 truncate">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span>
              {property.location?.locality ? `${property.location.locality}, ` : ""}
              {property.location?.city || "Lucknow"}
            </span>
          </p>
        </div>

        {/* KEY SPECS (Beds, Baths, Area) */}
        <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-2.5 text-center text-xs text-slate-600">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <BedDouble size={14} className="text-slate-400" />
              <span>{property.bedrooms || "-"}</span>
            </div>
            <span className="text-[10px] text-slate-400">Beds</span>
          </div>

          <div className="flex flex-col items-center justify-center border-x border-slate-100">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Bath size={14} className="text-slate-400" />
              <span>{property.bathrooms || "-"}</span>
            </div>
            <span className="text-[10px] text-slate-400">Baths</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Maximize2 size={13} className="text-slate-400" />
              <span className="truncate">
                {property.area
                  ? typeof property.area === "number"
                    ? `${property.area}`
                    : property.area
                  : "1200"}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Sq.Ft.</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${contactPhone}`}
              title="Call Owner/Agent"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white"
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
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-900 active:scale-95"
          >
            <Eye size={13} />
            <span>View Details</span>
          </Link>
        </div>

      </div>

    </div>
  );
}