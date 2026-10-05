"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin,
  IndianRupee,
  Phone,
  User,
  Home as HomeIcon,
  Send,
  CheckCircle2,
  Sparkles,
  Mail,
  Ruler,
  Sofa,
  CalendarDays,
  MessageSquare,
  Eye,
  Building2,
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

function PropertyRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Lucknow",
    locality: "",
    propertyType: "Apartment / Flat",
    purpose: "Buy",
    budget: "₹ 50 Lakh - ₹ 1 Crore",
    bhk: "2 BHK",
    propertySize: "",
    sizeUnit: "Sq. Ft.",
    furnishing: "Any",
    possession: "Any Time",
    contactPreference: "WhatsApp",
    siteVisit: "Yes",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const propertyId = searchParams.get("propertyId");

      const payload = {
        ...formData,
        propertyId: propertyId || null,
        propertySize:
          formData.propertySize === "" ? null : Number(formData.propertySize),
      };

      const response = await axios.post("/backend/api/inquiries", payload);

      if (response.data?.success) {
        setSubmitted(true);
      } else {
        setError(
          response.data?.message || "Requirement submit nahi ho saki."
        );
      }
    } catch (err) {
      console.error(
        "Property inquiry error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnotherRequest = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      city: "Lucknow",
      locality: "",
      propertyType: "Apartment / Flat",
      purpose: "Buy",
      budget: "₹ 50 Lakh - ₹ 1 Crore",
      bhk: "2 BHK",
      propertySize: "",
      sizeUnit: "Sq. Ft.",
      furnishing: "Any",
      possession: "Any Time",
      contactPreference: "WhatsApp",
      siteVisit: "Yes",
      message: "",
    });
    setSubmitted(false);
    setError("");
  };

  const inputClass =
    "w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none font-medium";

  const wrapperClass =
    "flex items-center gap-2.5 px-3.5 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-sm";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 overflow-hidden">
        
        {/* HEADER SECTION */}
        <div className="relative bg-slate-900 px-6 py-8 sm:px-10 sm:py-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Personalized Property Matchmaker</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Tell Us What You Are Looking For
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 font-normal leading-relaxed max-w-2xl">
              Apni property requirement share karein. Hamare verified property advisors aapke budget aur preferred location ke hisaab se best options connect karenge.
            </p>
          </div>
        </div>

        {/* SUCCESS VIEW */}
        {submitted ? (
          <div className="p-8 sm:p-14 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-5">
              Requirement Received Successfully!
            </h2>

            <p className="text-sm text-slate-600 max-w-lg mx-auto mt-3 leading-6">
              Shukriya <span className="font-semibold text-slate-900">{formData.fullName}</span>! Hamari expert team aapki{" "}
              <span className="font-semibold text-slate-900">{formData.propertyType}</span> requirement verify karke jald aapse connect karegi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleAnotherRequest}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
              >
                Submit Another Request
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="p-6 sm:p-9 space-y-8">
            
            {/* 1. PURPOSE SELECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  I Want To
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Select one</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "Buy", label: "Buy Property" },
                  { id: "Rent", label: "Rent / Lease" },
                  { id: "Lease", label: "Commercial" },
                  { id: "Invest", label: "Investment" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, purpose: item.id }))
                    }
                    className={`py-3 px-2 text-xs font-semibold rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                      formData.purpose === item.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.id}</span>
                    <span className={`text-[10px] ${formData.purpose === item.id ? "text-blue-100" : "text-slate-400"}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. PERSONAL DETAILS */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Your Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className={wrapperClass}>
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      maxLength={100}
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className={wrapperClass}>
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className={wrapperClass}>
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target City <span className="text-red-500">*</span>
                  </label>
                  <div className={wrapperClass}>
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Lucknow">Lucknow</option>
                      <option value="Gorakhpur">Gorakhpur</option>
                      <option value="Noida">Noida</option>
                      <option value="Kanpur">Kanpur</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Ayodhya">Ayodhya</option>
                      <option value="Prayagraj">Prayagraj</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. PREFERRED LOCATION */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preferred Locality / Area
              </label>
              <div className={wrapperClass}>
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="e.g. Gomti Nagar, Indira Nagar, Vibhuti Khand..."
                  className={inputClass}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Aap specific societies ya multiple local sectors mention kar sakte hain.
              </p>
            </div>

            {/* 4. PROPERTY CONFIGURATION */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Property Requirements
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className={wrapperClass}>
                    <HomeIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="propertyType"
                      required
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Apartment / Flat">Apartment / Flat</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Villa / Kothi">Villa / Kothi</option>
                      <option value="Residential Plot">Residential Plot / Land</option>
                      <option value="Commercial Shop">Commercial Shop</option>
                      <option value="Office Space">Office Space</option>
                      <option value="Commercial Land">Commercial Land</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    BHK / Configuration
                  </label>
                  <div className={wrapperClass}>
                    <HomeIcon className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Any">Any Configuration</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5+ BHK">5+ BHK</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Size (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`${wrapperClass} flex-1`}>
                      <Ruler className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="number"
                        name="propertySize"
                        min="0"
                        value={formData.propertySize}
                        onChange={handleChange}
                        placeholder="e.g. 1250"
                        className={inputClass}
                      />
                    </div>
                    <select
                      name="sizeUnit"
                      value={formData.sizeUnit}
                      onChange={handleChange}
                      className="h-[46px] px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
                    >
                      <option value="Sq. Ft.">Sq. Ft.</option>
                      <option value="Sq. Yd.">Sq. Yd.</option>
                      <option value="Sq. M.">Sq. M.</option>
                      <option value="Acre">Acre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Budget <span className="text-red-500">*</span>
                  </label>
                  <div className={wrapperClass}>
                    <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputClass}
                    >
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Furnishing Preference
                  </label>
                  <div className={wrapperClass}>
                    <Sofa className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="furnishing"
                      value={formData.furnishing}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Any">Any Furnishing</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi Furnished">Semi Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Possession Timeline
                  </label>
                  <div className={wrapperClass}>
                    <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      name="possession"
                      value={formData.possession}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Any Time">Any Time</option>
                      <option value="Immediately">Ready to Move (Immediately)</option>
                      <option value="Within 1 Month">Within 1 Month</option>
                      <option value="1 - 3 Months">1 - 3 Months</option>
                      <option value="3 - 6 Months">3 - 6 Months</option>
                      <option value="6+ Months">Under Construction (6+ Months)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. PREFERENCES & COMMUNICATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["WhatsApp", "Call", "Email"].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          contactPreference: type,
                        }))
                      }
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                        formData.contactPreference === type
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Interested in Site Visit?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Yes", "Not Now"].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, siteVisit: type }))
                      }
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition ${
                        formData.siteVisit === type
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {formData.siteVisit === type && <Check className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. ADDITIONAL NOTES */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Specific Requirements / Notes
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <textarea
                  name="message"
                  rows={3}
                  maxLength={2000}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Near metro station, gated society, corner flat, vastu compliant, high floor..."
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-sm resize-none"
                />
              </div>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-xs font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Requirement...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Property Inquiry</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Verified Advisors • No spam • Confidential details</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PropertyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            Loading inquiry form...
          </div>
        </div>
      }
    >
      <PropertyRequestForm />
    </Suspense>
  );
}