
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
  X,
  Send,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatPrice = (price) => currencyFormatter.format(price || 0);

const initialInquiryForm = {
  name: "",
  phone: "",
  email: "",
  budget: "",
  purpose: "Buy",
  message: "",
};

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Inquiry modal states
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryForm, setInquiryForm] = useState(initialInquiryForm);

  const {
    data: property,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPropertyQuery(id, {
    skip: !id,
  });

  // Open inquiry form on the same page
  const handleSendInquiry = () => {
    setInquiryError("");
    setInquirySuccess(false);
    setShowInquiryForm(true);
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;

    setInquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError("");

    if (!inquiryForm.name.trim()) {
      setInquiryError("Please enter your full name.");
      return;
    }

    const phone = inquiryForm.phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setInquiryError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (
      inquiryForm.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email.trim())
    ) {
      setInquiryError("Please enter a valid email address.");
      return;
    }

    setInquiryLoading(true);

    try {
      const response = await fetch("/backend/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: String(id),
          propertyTitle: property?.title || "",
          propertyPrice: property?.price ?? null,
          propertyLocation: property?.location?.city || property?.location?.address || "",
          name: inquiryForm.name.trim(),
          phone,
          email: inquiryForm.email.trim(),
          budget: inquiryForm.budget,
          purpose: inquiryForm.purpose,
          message: inquiryForm.message.trim(),
          source: "property-detail-page",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to submit inquiry. Please try again."
        );
      }

      setInquirySuccess(true);
      setInquiryForm({ ...initialInquiryForm });
    } catch (err) {
      setInquiryError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setInquiryLoading(false);
    }
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
        // User cancelled sharing
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
            {error?.data?.message ||
              "Property details are currently unavailable."}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={isFetching ? "animate-spin" : ""}
              />
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
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
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
                    ? "scale-110 fill-rose-500 text-rose-500"
                    : "text-slate-600"
                }
              />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-8">
            {/* Gallery */}
            <section className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
              <div className="group relative aspect-[16/10] overflow-hidden bg-slate-900 sm:aspect-[16/9]">
                <img
                  src={currentImage}
                  alt={property?.title || "Property Image"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md">
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

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white"
                    >
                      <ChevronLeft size={22} />
                    </button>

                    <button
                      onClick={handleNextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-white"
                    >
                      <ChevronRight size={22} />
                    </button>

                    <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-3.5">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${activeImageIndex === index
                        ? "scale-100 border-blue-900 opacity-100 ring-2 ring-blue-900/20"
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

            {/* Title and Price */}
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

                <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-5 text-white shadow-lg shadow-blue-950/15 sm:min-w-48 sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                    Price
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {formatPrice(property?.price)}
                  </p>
                </div>
              </div>

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

            {/* Property Features */}
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
                        <Icon
                          size={16}
                          className="text-blue-900 transition-transform group-hover:scale-110"
                        />
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

            {/* Amenities */}
            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
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
                  {property?.description ||
                    "No specific description added for this listing. Please reach out directly to the owner/agent for more context."}
                </p>

                {property?.description &&
                  property.description.length > 180 && (
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
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-lg font-black text-white">
                    <User size={22} />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900">
                        Owner / Listed Agent
                      </h3>
                      <CheckCircle2 size={15} className="text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-400">
                      Response time: &lt; 1 hour
                    </p>
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

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                      <Mail size={18} />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">
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

      {/* Inquiry Modal: same page, no navigation */}
      {showInquiryForm && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !inquiryLoading
            ) {
              setShowInquiryForm(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-inquiry-title"
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-800">
                  Property Inquiry
                </p>
                <h2
                  id="property-inquiry-title"
                  className="mt-1 text-xl font-black text-slate-900"
                >
                  Tell us your requirements
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fill in your details to enquire about this property.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close inquiry form"
                disabled={inquiryLoading}
                onClick={() => setShowInquiryForm(false)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Selected property */}
              <div className="mb-5 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                  <img
                    src={
                      property?.coverImage ||
                      property?.images?.[0] ||
                      "/placeholder-property.jpg"
                    }
                    alt={property?.title || "Property"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-extrabold text-slate-900">
                    {property?.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={13} className="shrink-0" />
                    {property?.location?.city ||
                      property?.location?.address ||
                      "Location on request"}
                  </p>
                  <p className="mt-2 text-base font-black text-blue-900">
                    {formatPrice(property?.price)}
                  </p>
                </div>
              </div>

              {inquirySuccess ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 className="mt-4 text-xl font-black text-slate-900">
                    Inquiry submitted!
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your inquiry was accepted by the server. Keep your phone
                    available for follow-up.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShowInquiryForm(false);
                      setInquirySuccess(false);
                    }}
                    className="mt-6 w-full rounded-xl bg-blue-900 px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleInquirySubmit}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="inquiry-name"
                      className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                      Full Name *
                    </label>
                    <input
                      id="inquiry-name"
                      name="name"
                      value={inquiryForm.name}
                      onChange={handleInquiryChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={100}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-phone"
                      className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                      Mobile Number *
                    </label>
                    <input
                      id="inquiry-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      value={inquiryForm.phone}
                      onChange={(e) =>
                        setInquiryForm((prev) => ({
                          ...prev,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        }))
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-900/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-email"
                      className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                      Email (Optional)
                    </label>
                    <input
                      id="inquiry-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={inquiryForm.email}
                      onChange={handleInquiryChange}
                      placeholder="you@example.com"
                      maxLength={254}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-900/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="inquiry-purpose"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                      >
                        Purpose *
                      </label>
                      <select
                        id="inquiry-purpose"
                        name="purpose"
                        value={inquiryForm.purpose}
                        onChange={handleInquiryChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-800"
                      >
                        <option value="Buy">Buy Property</option>
                        <option value="Rent">Rent Property</option>
                        <option value="Lease">Lease Property</option>
                        <option value="Invest">Invest in Property</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-budget"
                        className="mb-1.5 block text-sm font-bold text-slate-700"
                      >
                        Your Budget
                      </label>
                      <select
                        id="inquiry-budget"
                        name="budget"
                        value={inquiryForm.budget}
                        onChange={handleInquiryChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-800"
                      >
                        <option value="">Select Budget</option>
                        <option value="Under ₹ 30 Lakh">Under ₹ 30 Lakh</option>
                        <option value="₹ 30 Lakh - ₹ 50 Lakh">₹ 30 Lakh - ₹ 50 Lakh</option>
                        <option value="₹ 50 Lakh - ₹ 1 Crore">₹ 50 Lakh - ₹ 1 Crore</option>
                        <option value="₹ 1 Crore - ₹ 2 Crore">₹ 1 Crore - ₹ 2 Crore</option>
                        <option value="₹ 2 Crore - ₹ 5 Crore">₹ 2 Crore - ₹ 5 Crore</option>
                        <option value="₹ 5 Crore+">₹ 5 Crore+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-message"
                      className="mb-1.5 block text-sm font-bold text-slate-700"
                    >
                      Message / Requirements
                    </label>
                    <textarea
                      id="inquiry-message"
                      name="message"
                      value={inquiryForm.message}
                      onChange={handleInquiryChange}
                      rows={3}
                      maxLength={2000}
                      placeholder="Tell us what you are looking for..."
                      className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-blue-900/10"
                    />
                  </div>

                  {inquiryError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
                    >
                      {inquiryError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {inquiryLoading ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Submit Property Inquiry
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-400">
                    Please provide the correct contact number for follow-up.
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

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