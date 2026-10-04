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
  CheckCircle2,
  X,
  Mail,
} from "lucide-react";

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const {
    data: property,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPropertyQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060c18] p-4 text-white">
        <div className="mx-auto max-w-xl animate-pulse space-y-4">
          <div className="h-72 w-full rounded-2xl bg-slate-800/60" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-20 rounded-xl bg-slate-800/60" />
            ))}
          </div>
          <div className="h-6 w-1/3 rounded-lg bg-slate-800/60" />
          <div className="h-8 w-3/4 rounded-lg bg-slate-800/60" />
          <div className="h-10 w-1/2 rounded-lg bg-slate-800/60" />
          <div className="h-32 w-full rounded-xl bg-slate-800/60" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    const message =
      error?.data?.message || "Property details could not be loaded.";

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060c18] p-5 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center">
          <Building2 className="mx-auto mb-3 text-red-500" size={40} />
          <h1 className="text-lg font-bold">Property Not Available</h1>
          <p className="mt-2 text-xs text-slate-400">{message}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin" : ""}
            />
            {isFetching ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // Media images list
  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.coverImage
      ? [property.coverImage]
      : ["/placeholder-property.jpg"];

  const currentImage = images[activeImageIndex] || images[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const contactPhone =
    property?.contactPhone || property?.agentPhone || "919876543210";
  const whatsappNumber = String(contactPhone).replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Namaste! I am interested in "${property.title}" (ID: ${id}) located in ${property.location?.city || "your area"}. Please share details.`
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setEnquirySent(true);
    setTimeout(() => {
      setEnquirySent(false);
      setIsEnquiryOpen(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-white">
      <main className="mx-auto max-w-lg px-4 pb-32 pt-3 sm:max-w-2xl sm:px-6">
        {/* TOP BAR / BACK NAVIGATION */}
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-medium text-slate-400">Property Details</span>
          <div className="w-9" />
        </div>

        {/* HERO IMAGE BANNER */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
          <img
            src={currentImage}
            alt={property.title}
            className="h-full w-full object-cover transition-all duration-300"
          />

          {/* Top-Right Favorite / Wishlist */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition active:scale-90"
          >
            <Heart
              size={18}
              className={isSaved ? "fill-rose-500 text-rose-500" : "text-white"}
            />
          </button>

          {/* Bottom Controls: Counter Pill & Navigation */}
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <button onClick={handlePrevImage} className="hover:opacity-75">
              <ChevronLeft size={14} />
            </button>
            <span>
              {activeImageIndex + 1} / {images.length}
            </span>
            <button onClick={handleNextImage} className="hover:opacity-75">
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="absolute bottom-3 right-3.5 flex items-center gap-1.5">
            <button
              onClick={handlePrevImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* THUMBNAILS ROW */}
        {images.length > 1 && (
          <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  activeImageIndex === idx
                    ? "border-blue-500 ring-2 ring-blue-500/30"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* LISTING TYPE TAG */}
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/40 bg-emerald-950/80 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <Tag size={12} />
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>

        {/* TITLE & LOCATION */}
        <h1 className="mt-2.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {property.title}
        </h1>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin size={14} className="shrink-0 text-slate-400" />
          {property.location?.city
            ? `${property.location?.city}, ${property.location?.state || "India"}`
            : property.location?.address || "Location on request"}
        </p>

        {/* PRICE & NEGOTIABLE BADGE */}
        <div className="mt-3.5 flex items-center justify-between">
          <div className="text-2xl font-extrabold text-white">
            {formatPrice(property.price)}
          </div>
          <span className="rounded-lg border border-emerald-800/30 bg-emerald-950/70 px-2.5 py-1 text-xs font-medium text-emerald-300">
            Negotiable
          </span>
        </div>

        {/* KEY SPECS (BEDS, BATHS, SQFT) */}
        <div className="mt-4 flex items-center gap-6 border-b border-slate-800/80 pb-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <BedDouble size={16} className="text-slate-400" />
            <span>{property.bedrooms ? `${property.bedrooms} Beds` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={16} className="text-slate-400" />
            <span>{property.bathrooms ? `${property.bathrooms} Baths` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-slate-400" />
            <span>
              {property.area
                ? typeof property.area === "number"
                  ? `${property.area.toLocaleString("en-IN")} Sq.Ft.`
                  : property.area
                : "3,500 Sq.Ft."}
            </span>
          </div>
        </div>

        {/* PROPERTY DETAILS GRID */}
        <section className="mt-5">
          <h2 className="text-sm font-semibold text-white">Property Details</h2>
          <div className="mt-3.5 grid grid-cols-3 gap-x-2 gap-y-4 text-xs">
            <div>
              <p className="text-slate-400">Property Type</p>
              <p className="mt-1 font-semibold capitalize text-white">
                {property.propertyType || "Villa"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Facing</p>
              <p className="mt-1 font-semibold text-white">
                {property.facing || "East"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Age of Property</p>
              <p className="mt-1 font-semibold text-white">
                {property.propertyAge || "2 Years"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Furnishing</p>
              <p className="mt-1 font-semibold capitalize text-white">
                {property.furnishing || "Semi-Furnished"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Parking</p>
              <p className="mt-1 font-semibold text-white">
                {property.parking || "2 Car"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Ownership</p>
              <p className="mt-1 font-semibold text-white">
                {property.ownership || "Freehold"}
              </p>
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="mt-6 border-t border-slate-800/80 pt-4">
          <h2 className="text-sm font-semibold text-white">Description</h2>
          <p
            className={`mt-2 text-xs leading-relaxed text-slate-300 ${
              !isDescExpanded ? "line-clamp-3" : ""
            }`}
          >
            {property.description ||
              "Spacious luxury villa with a beautiful garden, modern interiors and premium amenities. Located in a prime area, this property is perfect for families looking for comfort and luxury."}
          </p>
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            {isDescExpanded ? (
              <>
                Read Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Read More <ChevronDown size={14} />
              </>
            )}
          </button>
        </section>
      </main>

      {/* FIXED BOTTOM BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#050b14]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-lg space-y-2 sm:max-w-2xl">
          {/* Top Row: Call Owner & WhatsApp */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              <Phone size={15} />
              Call Owner
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-semibold text-black transition hover:bg-[#20ba5a] active:scale-[0.98]"
            >
              <MessageCircle size={15} className="fill-black" />
              WhatsApp
            </a>
          </div>

          {/* Bottom Row: Share, Save & Enquiry */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 active:scale-95"
            >
              <Share2 size={14} />
              Share
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 active:scale-95"
            >
              <Heart
                size={14}
                className={isSaved ? "fill-rose-500 text-rose-500" : ""}
              />
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 active:scale-95"
            >
              <Mail size={14} />
              Enquiry
            </button>
          </div>
        </div>
      </footer>

      {/* ENQUIRY MODAL */}
      {isEnquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#0b1320] p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsEnquiryOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-bold">Contact & Enquiry</h3>
            <p className="mt-1 text-xs text-slate-400">
              For: <span className="text-slate-200">{property.title}</span>
            </p>

            {enquirySent ? (
              <div className="my-8 text-center text-emerald-400">
                <CheckCircle2 size={40} className="mx-auto mb-2" />
                <p className="text-sm font-semibold">Enquiry Sent Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-slate-300">Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Aapka Naam"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">Message</label>
                  <textarea
                    rows={2}
                    placeholder="Interested in site visit..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}