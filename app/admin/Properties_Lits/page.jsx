"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Loader2,
  AlertCircle,
  Building2,
  RefreshCw,
  Heart,
  PhoneCall,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";

import { useGetPropertiesQuery } from "../../../RTK/services/propertyApi";

// Real-estate Indian format converter
function formatPrice(val) {
  const num = Number(val || 0);
  if (!num) return "Price on Request";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
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

  // ==========================================
  // INFINITE SCROLL (Untouched logic)
  // ==========================================
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

  // ==========================================
  // INITIAL LOADING SKELETON
  // ==========================================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />
              <div className="h-4 w-72 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertySkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (isError) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-[#f8fafc] p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-100">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-8 ring-rose-50/50">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Unable to load properties
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            We couldn't connect to our servers to fetch current listings.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
          >
            <RefreshCw size={15} />
            Try Again
          </button>

          {error?.data?.message && (
            <p className="mt-4 rounded-lg bg-rose-50 p-2.5 text-xs font-medium text-rose-600">
              {error.data.message}
            </p>
          )}
        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER BAR */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <Sparkles size={13} />
              Verified Marketplace
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Explore Properties
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover residential apartments, plots, and commercial spaces.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pagination?.total !== undefined && (
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm">
                Showing <span className="font-bold text-slate-900">{properties.length}</span> of{" "}
                <span className="font-bold text-slate-900">{pagination.total}</span> listings
              </div>
            )}
          </div>
        </div>

        {/* EMPTY STATE */}
        {properties.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Building2 size={32} />
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900">
              No matching properties found
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              There are currently no active listings matching your criteria. Check back soon!
            </p>
          </div>
        )}

        {/* PROPERTY GRID */}
        {properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* INFINITE SCROLL LOADER */}
        <div ref={loaderRef} className="flex min-h-24 items-center justify-center py-6">
          {isFetching && (
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              Loading more properties...
            </div>
          )}

          {!isFetching && !hasMore && properties.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="h-px w-12 bg-slate-200" />
              You've reached the end of the listings
              <span className="h-px w-12 bg-slate-200" />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

// ==========================================
// ENHANCED PROPERTY CARD
// ==========================================

function PropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false);

  const image =
    property.coverImage ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80";

  const isRent = property.listingType?.toLowerCase() === "rent";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={property.title || "Real Estate Listing"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

        {/* TOP BADGES */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {property.listingType && (
            <span className="rounded-lg bg-slate-950/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
              For {property.listingType}
            </span>
          )}

          {property.propertyType && (
            <span className="rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-800 backdrop-blur-md">
              {property.propertyType}
            </span>
          )}
        </div>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur transition hover:scale-110 active:scale-95"
        >
          <Heart
            size={15}
            className={`transition ${
              isSaved ? "fill-rose-500 text-rose-500" : "text-slate-600"
            }`}
          />
        </button>

        {/* BOTTOM IMAGE PRICE OVERLAY */}
        <div className="absolute bottom-2.5 left-3">
          <p className="text-lg font-black tracking-tight text-white drop-shadow-sm">
            {formatPrice(property.price)}
            {isRent && <span className="text-xs font-normal text-slate-200">/mo</span>}
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h2 className="line-clamp-1 font-bold text-slate-900 group-hover:text-blue-600 transition">
            {property.title || "Untitled Property"}
          </h2>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">
              {property.location?.city || "City Not Disclosed"}
              {property.location?.state ? `, ${property.location.state}` : ""}
            </span>
          </div>

          {/* AMENITY PILLS */}
          <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70 py-2 text-center">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-xs font-bold text-slate-800">
                {property.bedrooms || 0}
              </span>
              <span className="text-[10px] text-slate-400">Beds</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-xs font-bold text-slate-800">
                {property.bathrooms || 0}
              </span>
              <span className="text-[10px] text-slate-400">Baths</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-xs font-bold text-slate-800">
                {property.area || "—"}
              </span>
              <span className="text-[10px] text-slate-400">Sq.ft</span>
            </div>
          </div>
        </div>

        {/* CARD FOOTER & VIEW DETAILS */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
              property.status === "approved"
                ? "bg-emerald-50 text-emerald-700"
                : property.status === "rejected"
                ? "bg-rose-50 text-rose-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            ● {property.status || "Pending"}
          </span>

          <Link
            href={`/property/${property._id}`}
            className="text-xs font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// POLISHED SHIMMER SKELETON
// ==========================================

function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="aspect-[16/10] w-full animate-pulse bg-slate-200" />

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}