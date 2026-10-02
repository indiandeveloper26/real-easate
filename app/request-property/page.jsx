"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function PropertyRequestPage() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Customer Requirement Submitted:", formData);

    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-transparent text-sm text-slate-800 outline-none font-medium";

  const wrapperClass =
    "flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:bg-white transition";

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-7 sm:p-8 text-white">

          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-300 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Property Finder</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tell Us What You Are Looking For
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 font-light leading-5 max-w-2xl">
            Apni property requirement share karein. Hamare verified real
            estate agents aapke budget aur preferred location ke according
            suitable properties suggest karenge.
          </p>
        </div>

        {/* ================= SUCCESS ================= */}
        {submitted ? (
          <div className="p-10 sm:p-14 text-center">

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mt-5">
              Requirement Received!
            </h2>

            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-3 leading-6">
              Shukriya{" "}
              <span className="font-semibold text-slate-800">
                {formData.fullName}
              </span>
              ! Hamari team aapki{" "}
              <span className="font-semibold text-slate-800">
                {formData.propertyType}
              </span>{" "}
              requirement ke according suitable properties ke saath jald
              contact karegi.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">

              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition"
              >
                Submit Another Request
              </button>

              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Back to Home
              </button>

            </div>
          </div>
        ) : (

          /* ================= FORM ================= */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-7"
          >

            {/* ================= PURPOSE ================= */}
            <div>

              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">
                I want to
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                {["Buy", "Rent", "Lease", "Invest"].map((type) => (

                  <button
                    type="button"
                    key={type}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        purpose: type,
                      }))
                    }
                    className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                      formData.purpose === type
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {type}
                  </button>

                ))}

              </div>
            </div>

            {/* ================= PERSONAL DETAILS ================= */}
            <div>

              <h2 className="text-sm font-bold text-slate-800 mb-3">
                Your Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* NAME */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Full Name *
                  </label>

                  <div className={wrapperClass}>
                    <User className="w-4 h-4 text-slate-400 shrink-0" />

                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className={inputClass}
                    />
                  </div>

                </div>

                {/* PHONE */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Phone / WhatsApp *
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

                {/* EMAIL */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
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

                {/* CITY */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Target City *
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

            {/* ================= LOCATION ================= */}
            <div>

              <h2 className="text-sm font-bold text-slate-800 mb-3">
                Preferred Location
              </h2>

              <div className={wrapperClass}>

                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />

                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="e.g. Gomti Nagar, Indira Nagar, Hazratganj..."
                  className={inputClass}
                />

              </div>

              <p className="text-[11px] text-slate-400 mt-1.5">
                Multiple areas bhi enter kar sakte hain.
              </p>

            </div>

            {/* ================= PROPERTY DETAILS ================= */}
            <div>

              <h2 className="text-sm font-bold text-slate-800 mb-3">
                Property Requirements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* PROPERTY TYPE */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Property Type *
                  </label>

                  <div className={wrapperClass}>

                    <HomeIcon className="w-4 h-4 text-slate-400 shrink-0" />

                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Apartment / Flat">
                        Apartment / Flat
                      </option>

                      <option value="Independent House">
                        Independent House
                      </option>

                      <option value="Villa / Kothi">
                        Villa / Kothi
                      </option>

                      <option value="Residential Plot">
                        Residential Plot / Land
                      </option>

                      <option value="Commercial Shop">
                        Commercial Shop
                      </option>

                      <option value="Office Space">
                        Office Space
                      </option>

                      <option value="Commercial Land">
                        Commercial Land
                      </option>
                    </select>

                  </div>

                </div>

                {/* BHK */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
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
                      <option value="Any">Any</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5+ BHK">5+ BHK</option>
                    </select>

                  </div>

                </div>

                {/* PROPERTY SIZE */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Preferred Property Size
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
                        placeholder="e.g. 1200"
                        className={inputClass}
                      />
                    </div>

                    <select
                      name="sizeUnit"
                      value={formData.sizeUnit}
                      onChange={handleChange}
                      className="h-[42px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                    >
                      <option value="Sq. Ft.">Sq. Ft.</option>
                      <option value="Sq. Yd.">Sq. Yd.</option>
                      <option value="Sq. M.">Sq. M.</option>
                      <option value="Acre">Acre</option>
                    </select>

                  </div>

                </div>

                {/* BUDGET */}
                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Estimated Budget *
                  </label>

                  <div className={wrapperClass}>

                    <IndianRupee className="w-4 h-4 text-slate-400 shrink-0" />

                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="Under ₹ 30 Lakh">
                        Under ₹ 30 Lakh
                      </option>

                      <option value="₹ 30 Lakh - ₹ 50 Lakh">
                        ₹ 30 Lakh - ₹ 50 Lakh
                      </option>

                      <option value="₹ 50 Lakh - ₹ 1 Crore">
                        ₹ 50 Lakh - ₹ 1 Crore
                      </option>

                      <option value="₹ 1 Crore - ₹ 2 Crore">
                        ₹ 1 Crore - ₹ 2 Crore
                      </option>

                      <option value="₹ 2 Crore - ₹ 5 Crore">
                        ₹ 2 Crore - ₹ 5 Crore
                      </option>

                      <option value="₹ 5 Crore+">
                        ₹ 5 Crore+
                      </option>
                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= FURNISHING + POSSESSION ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* FURNISHING */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
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
                    <option value="Any">Any</option>
                    <option value="Fully Furnished">
                      Fully Furnished
                    </option>
                    <option value="Semi Furnished">
                      Semi Furnished
                    </option>
                    <option value="Unfurnished">
                      Unfurnished
                    </option>
                  </select>

                </div>

              </div>

              {/* POSSESSION */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Possession / Move-in
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
                    <option value="Immediately">
                      Immediately
                    </option>
                    <option value="Within 1 Month">
                      Within 1 Month
                    </option>
                    <option value="1 - 3 Months">
                      1 - 3 Months
                    </option>
                    <option value="3 - 6 Months">
                      3 - 6 Months
                    </option>
                    <option value="6+ Months">
                      6+ Months
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {/* ================= CONTACT PREFERENCE ================= */}
            <div>

              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Preferred Contact Method
              </label>

              <div className="grid grid-cols-3 gap-3">

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
                    className={`py-2.5 text-xs font-bold rounded-xl border transition ${
                      formData.contactPreference === type
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>

            {/* ================= SITE VISIT ================= */}
            <div>

              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Do you want a property site visit?
              </label>

              <div className="grid grid-cols-2 gap-3">

                {["Yes", "Not Now"].map((type) => (

                  <button
                    type="button"
                    key={type}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        siteVisit: type,
                      }))
                    }
                    className={`py-2.5 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 transition ${
                      formData.siteVisit === type
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {type}
                  </button>

                ))}

              </div>

            </div>

            {/* ================= MESSAGE ================= */}
            <div>

              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Any Specific Requirement?
              </label>

              <div className="relative">

                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />

                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="e.g. Near main road, metro, school, gated society, park facing, vastu compliant..."
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition placeholder-slate-400 resize-none"
                />

              </div>

            </div>

            {/* ================= SUBMIT ================= */}
            <div className="pt-1">

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition duration-200"
              >
                <Send className="w-4 h-4" />
                <span>Submit Requirement</span>
              </button>

              <p className="text-center text-[11px] text-slate-400 mt-3">
                Your information is safe and will only be used to help
                find suitable properties.
              </p>

            </div>

          </form>
        )}
      </div>
    </div>
  );
}