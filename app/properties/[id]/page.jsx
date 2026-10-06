"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPropertyQuery } from "../../../RTK/services/propertyApi";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Building2,
  RefreshCw,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Compass,
  Calendar,
  Sofa,
  Car,
  FileCheck,
  Sparkles,
  Mail,
  CheckCircle2,
  User,
} from "lucide-react";

// Optimized currency formatter outside render lifecycle
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatPrice = (price) => currencyFormatter.format(price || 0);

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const {
    data: property,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPropertyQuery(id, {
    skip: !id,
  });

  const handleSendInquiry = () => {
    if (!id) return;
    router.push(
      `/request-property?propertyId=${encodeURIComponent(String(id))}`
    );
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: property?.title || "Property Listing",
          text: `Check out this property: ${property?.title || ""}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else if (typeof navigator !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch {
        alert("Unable to copy link.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-10 w-40 rounded-2xl bg-slate-200" />
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="h-96 rounded-3xl bg-slate-200" />
              <div className="h-44 rounded-3xl bg-slate-200" />
              <div className="h-56 rounded-3xl bg-slate-200" />
            </div>
            <div className="hidden h-[500px] rounded-3xl bg-slate-200 lg:col-span-4 lg:block" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-900">
            <Building2 size={32} />
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Property Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {error?.data?.message || "Property details are currently unavailable."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:opacity-50"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
              {isFetching ? "Retrying..." : "Try Again"}
            </button>
            <button
              onClick={() => router.back()}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images =
    property?.images && property.images.length > 0
      ? property.images
      : property?.coverImage
        ? [property.coverImage]
        : ["/placeholder-property.jpg"];

  const currentImage = images[activeImageIndex] || images[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const contactPhone =
    property?.contactPhone || property?.agentPhone || "919876543210";

  const whatsappNumber = String(contactPhone).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Namaste! I am interested in "${property?.title || "Property"}" (ID: ${id}) located in ${property?.location?.city || "your area"}. Please share details.`
  );

  const specsList = [
    {
      label: "Property Type",
      value: property?.propertyType || "Not specified",
      icon: Building2,
    },
    {
      label: "Facing",
      value: property?.facing || "Not specified",
      icon: Compass,
    },
    {
      label: "Age of Property",
      value: property?.propertyAge || "Not specified",
      icon: Calendar,
    },
    {
      label: "Furnishing",
      value: property?.furnishing || "Not specified",
      icon: Sofa,
    },
    {
      label: "Parking",
      value: property?.parking || "Not specified",
      icon: Car,
    },
    {
      label: "Ownership",
      value: property?.ownership || "Not specified",
      icon: FileCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased">
      <main className="mx-auto max-w-6xl px-4 pb-36 pt-6 sm:px-6 lg:pb-16">
        {/* Navigation Bar */}
        <header className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-blue-900"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to listings
          </button>

          <div className="flex gap-2.5">
            <button
              onClick={handleShare}
              aria-label="Share property"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-blue-900"
            >
              <Share2 size={18} />
            </button>

            <button
              onClick={() => setIsSaved((prev) => !prev)}
              aria-label="Save property"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Heart
                size={18}
                className={
                  isSaved
                    ? "fill-rose-500 text-rose-500 transition-scale scale-110"
                    : "text-slate-600"
                }
              />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="space-y-6 lg:col-span-8">
            {/* Gallery Section */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
              <div className="group relative aspect-[16/10] overflow-hidden bg-slate-900 sm:aspect-[16/9]">
                <img
                  src={currentImage}
                  alt={property?.title || "Property Image"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Floating Badges */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    <Tag size={13} className="text-blue-400" />
                    {property?.listingType === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>

                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-blue-950 shadow-lg backdrop-blur-md">
                    <Sparkles size={13} className="text-amber-500" />
                    Verified Listing
                  </span>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition hover:bg-white hover:scale-110"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition hover:bg-white hover:scale-110"
                    >
                      <ChevronRight size={22} />
                    </button>

                    <span className="absolute bottom-4 right-4 rounded-full bg-slate-900/70 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-3.5 scrollbar-none">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${activeImageIndex === index
                          ? "border-blue-900 ring-2 ring-blue-900/20 scale-100 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Header / Title & Price Card */}
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    {property?.title}
                  </h1>

                  <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                    <MapPin size={18} className="shrink-0 text-blue-700" />
                    {property?.location?.city
                      ? `${property.location.city}, ${property.location?.state || "India"}`
                      : property?.location?.address || "Location on request"}
                  </p>
                </div>

                {/* Modern Price Badge */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-5 text-white shadow-lg shadow-blue-950/15 sm:min-w-48 sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Price
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {formatPrice(property?.price)}
                  </p>
                </div>
              </div>

              {/* Quick Specs Highlight Bar */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 p-4 text-center sm:flex-row sm:justify-start sm:gap-3 sm:text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/60 text-blue-900">
                    <BedDouble size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Bedrooms</p>
                    <p className="text-base font-black text-slate-900">
                      {property?.bedrooms ?? "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 p-4 text-center sm:flex-row sm:justify-start sm:gap-3 sm:text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/60 text-blue-900">
                    <Bath size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Bathrooms</p>
                    <p className="text-base font-black text-slate-900">
                      {property?.bathrooms ?? "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 p-4 text-center sm:flex-row sm:justify-start sm:gap-3 sm:text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100/60 text-blue-900">
                    <Maximize2 size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">Total Area</p>
                    <p className="text-base font-black text-slate-900">
                      {property?.area
                        ? typeof property.area === "number"
                          ? `${property.area.toLocaleString("en-IN")} sq.ft`
                          : property.area
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Overview Grid */}
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Property Features & Overview
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specsList.map((spec) => {
                  const Icon = spec.icon;

                  return (
                    <div
                      key={spec.label}
                      className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-slate-400">
                        <Icon size={16} className="text-blue-900 transition-transform group-hover:scale-110" />
                        <span className="text-xs font-medium">{spec.label}</span>
                      </div>
                      <p className="mt-2 text-sm font-bold capitalize text-slate-900">
                        {spec.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>


            {/* Property Amenities */}
            <section className="mt-8 rounded-2xl border border-gray-200 p-6">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Amenities & Facilities
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { key: "parking", label: "Parking" },
                  { key: "lift", label: "Lift" },
                  { key: "security", label: "Security" },
                  { key: "balcony", label: "Balcony" },
                  { key: "powerBackup", label: "Power Backup" },
                  { key: "waterSupply", label: "Water Supply" },
                ].map((item) => {
                  const available = property?.amenities?.[item.key];

                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-500"
                          }`}
                      >
                        {available ? "✓" : "—"}
                      </span>

                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Description */}
            <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                About this Property
              </h2>

              <div className="relative mt-4">
                <p
                  className={`text-sm leading-relaxed text-slate-600 ${!isDescExpanded ? "line-clamp-4" : ""
                    }`}
                >
                  {property?.description || "No specific description added for this listing. Please reach out directly to the owner/agent for more context."}
                </p>

                {property?.description && property.description.length > 180 && (
                  <button
                    onClick={() => setIsDescExpanded((prev) => !prev)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-900 transition hover:text-blue-700"
                  >
                    {isDescExpanded ? "Show Less" : "Read Full Description"}
                    {isDescExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/50">
                {/* Seller Info Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white font-black text-lg">
                    <User size={22} />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900">Owner / Listed Agent</h3>
                      <CheckCircle2 size={15} className="text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-400">Response time: &lt; 1 hour</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <a
                    href={`tel:${contactPhone}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-900 bg-white py-3.5 text-sm font-bold text-blue-900 transition hover:bg-blue-900 hover:text-white"
                  >
                    <Phone size={17} />
                    Call Owner Directly
                  </a>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
                  >
                    <MessageCircle size={17} />
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Send Inquiry Box */}
                <div className="mt-6 rounded-2xl bg-slate-50/80 p-5 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                      <Mail size={18} />
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      Request Callback
                    </h4>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Send your details to schedule a site visit or ask specific questions.
                  </p>

                  <button
                    type="button"
                    onClick={handleSendInquiry}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 active:scale-[0.98]"
                  >
                    Send Property Inquiry
                  </button>
                </div>

                <p className="mt-4 text-center text-[11px] font-medium text-slate-400">
                  Property ID: {String(id)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/90 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="mx-auto max-w-lg space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-900 py-3 text-sm font-black text-blue-900"
            >
              <Phone size={16} />
              Call
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md shadow-emerald-600/20"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 active:bg-slate-50"
            >
              <Share2 size={14} />
              Share
            </button>

            <button
              onClick={() => setIsSaved((prev) => !prev)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 active:bg-slate-50"
            >
              <Heart
                size={14}
                className={isSaved ? "fill-rose-500 text-rose-500" : ""}
              />
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={handleSendInquiry}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-900 py-2.5 text-xs font-black text-white shadow-md shadow-blue-900/20"
            >
              <Mail size={14} />
              Inquire
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}