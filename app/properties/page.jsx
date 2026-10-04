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
  SlidersHorizontal,
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
  if (diffDays < 30) return `Listed ${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Listed ${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
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

  // Loading Skeleton
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#050b14] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-10 w-60 animate-pulse rounded-xl bg-slate-800/60" />
          <div className="h-12 w-full animate-pulse rounded-2xl bg-slate-800/40" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 w-full animate-pulse rounded-2xl border border-slate-800/60 bg-[#081222]"
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
      <main className="flex min-h-[75vh] items-center justify-center bg-[#050b14] p-6 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0a1426] p-6 text-center shadow-xl">
          <AlertCircle size={36} className="mx-auto mb-3 text-rose-500" />
          <h2 className="text-base font-bold">Listings load nahi ho saki</h2>
          <p className="mt-1 text-xs text-slate-400">
            {error?.data?.message || "Kripya connection check karein aur dobara koshish karein."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold hover:bg-blue-700"
          >
            <RefreshCw size={14} /> Dobara Koshish Karein
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030914] px-3.5 py-6 text-white sm:px-6 sm:py-9">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* HERO TITLE & DISCOVERY HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-400 backdrop-blur-md">
              <Sparkles size={12} /> Verified Properties Marketplace
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Explore Dream Homes
            </h1>
            <p className="text-xs text-slate-400">
              Find luxury villas, modern apartments, and premium rental stays.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Available Listings:{" "}
            <span className="font-bold text-white">
              {filteredProperties.length}
            </span>
          </div>
        </div>

        {/* SEARCH BAR & CATEGORY TABS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by city, title, or property type (e.g. Bhopal, Villa)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-800 bg-[#081224] py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 shadow-inner focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", label: "All Properties" },
              { id: "sale", label: "For Sale" },
              { id: "rent", label: "For Rent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${selectedFilter === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "border border-slate-800/80 bg-[#081224] text-slate-400 hover:text-white"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROPERTY LISTINGS */}
        {filteredProperties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-[#07101f] p-12 text-center">
            <Building2 className="mx-auto mb-2 text-slate-600" size={34} />
            <h3 className="text-sm font-bold text-slate-300">
              Koi property nahi mili
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Apna search filter badal kar dobara check karein.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredProperties.map((property) => (
              <UserPropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL SPINNER */}
        <div ref={loaderRef} className="flex min-h-16 items-center justify-center py-4">
          {isFetching && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Loader2 size={15} className="animate-spin text-blue-500" />
              Loading more properties...
            </div>
          )}
          {!isFetching && !hasMore && properties.length > 0 && (
            <p className="text-[11px] text-slate-600">
              Aapne sabhi properties dekh li hain.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}

// USER-FACING CARD COMPONENT
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
    <div className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#071020] p-3.5 transition-all duration-200 hover:border-slate-700 hover:bg-[#0a1529] sm:flex-row sm:items-center">

      {/* LEFT: IMAGE & PROPERTY HIGHLIGHTS */}
      <div className="flex w-full items-start gap-4 sm:w-auto sm:items-center">

        {/* IMAGE CONTAINER */}
        <div className="relative h-28 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:h-28 sm:w-44">
          <img
            src={image}
            alt={property.title || "Property"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Listing Pill on top of image */}
          <div className="absolute left-2 top-2">
            {isRent ? (
              <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-md">
                For Rent
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow backdrop-blur-md">
                <Tag size={10} /> For Sale
              </span>
            )}
          </div>

          {/* Mobile Wishlist Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition sm:hidden"
          >
            <Heart
              size={13}
              className={isSaved ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        </div>

        {/* DETAILS SECTION */}
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/properties/${property._id}`}
            className="block text-sm font-bold text-white transition hover:text-blue-400 sm:text-base line-clamp-1"
          >
            {property.title || "Luxury Home with Garden"}
          </Link>

          <p className="flex items-center gap-1 text-[11px] text-slate-400 truncate">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span>
              {property.location?.city || "Bhopal"},{" "}
              {property.location?.state || "Madhya Pradesh"}
            </span>
          </p>

          {/* PRICE DISPLAY */}
          <div className="pt-0.5 text-base font-extrabold text-white sm:text-lg">
            {formatPrice(property.price, property.listingType)}
          </div>

          {/* KEY SPECS (Beds, Baths, Area) */}
          <div className="flex items-center gap-3.5 pt-0.5 text-[11px] font-medium text-slate-400">
            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <BedDouble size={13} className="text-slate-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath size={13} className="text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize2 size={13} className="text-slate-400" />
              <span>
                {property.area
                  ? typeof property.area === "number"
                    ? `${property.area.toLocaleString("en-IN")} Sq.Ft.`
                    : property.area
                  : "3,500 Sq.Ft."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: TIME, WHATSAPP, CALL & VIEW DETAILS */}
      <div className="flex w-full items-center justify-between gap-3 border-t border-slate-800/70 pt-2.5 sm:w-auto sm:flex-col sm:items-end sm:border-0 sm:pt-0">

        {/* Listed Timestamp */}
        <span className="text-[11px] text-slate-400">
          {formatTimeAgo(property.createdAt)}
        </span>

        {/* QUICK USER ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Wishlist Button (Desktop) */}
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-[#0d182a] text-slate-300 transition hover:border-slate-700 hover:text-white sm:flex"
            title="Save to Wishlist"
          >
            <Heart
              size={15}
              className={isSaved ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>

          {/* Call Agent Quick Icon */}
          <a
            href={`tel:${contactPhone}`}
            title="Call Owner/Agent"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 transition hover:bg-blue-600 hover:text-white"
          >
            <Phone size={14} />
          </a>

          {/* WhatsApp Direct Icon */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
          >
            <MessageCircle size={15} />
          </a>

          {/* MAIN PROMINENT BUTTON: View Details */}
          <Link
            href={`/properties/${property._id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 active:scale-95"
          >
            <Eye size={14} />
            <span>View Details</span>
          </Link>
        </div>

      </div>

    </div>
  );
}