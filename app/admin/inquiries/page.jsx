"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Sparkles,
  RefreshCw,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  IndianRupee,
  Home,
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  Filter,
} from "lucide-react";
import { useGetAdminInquiriesQuery } from "../../../RTK/store/api/admin/inquiries";

export default function AdminInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminInquiriesQuery({
    status: statusFilter,
    search: searchQuery,
  });

  const stats = data?.stats;
  const inquiries = data?.inquiries || [];

  // Client-side quick filter for smooth real-time response
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "All"
          ? true
          : (item.status || "New").toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.fullName || "").toLowerCase().includes(q) ||
        (item.phone || "").toLowerCase().includes(q) ||
        (item.city || "").toLowerCase().includes(q) ||
        (item.locality || "").toLowerCase().includes(q) ||
        (item.propertyType || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, searchQuery]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Inquiries Load Nahi Ho Saki
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Server ya network issue ki wajah se leads fetch nahi ho payi. Dobara koshish karein.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-900/20 hover:bg-blue-800 transition active:scale-95"
          >
            <RefreshCw className="h-4 w-4" /> Koshish Karein
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* TOP HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-900/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>CRM Lead Pipeline</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Property Inquiries & Leads
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
              Website users dwara submit ki gayi personalized property requirements aur follow-up details.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-blue-400" : ""}`} />
            <span>{isFetching ? "Syncing..." : "Refresh Leads"}</span>
          </button>
        </div>

        {/* METRIC STATS CARDS */}
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 sm:gap-4">
          <Stat
            title="Total Leads"
            value={stats?.total}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="border-blue-100 bg-blue-50/50"
          />
          <Stat
            title="New Requests"
            value={stats?.new}
            icon={<Clock className="h-5 w-5 text-amber-600" />}
            color="border-amber-100 bg-amber-50/50"
          />
          <Stat
            title="Site Visits"
            value={stats?.siteVisits}
            icon={<CalendarCheck className="h-5 w-5 text-indigo-600" />}
            color="border-indigo-100 bg-indigo-50/50"
          />
          <Stat
            title="Converted"
            value={stats?.converted}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            color="border-emerald-100 bg-emerald-50/50"
          />
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone number, city, or property type..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", "New", "Contacted", "Converted"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                  statusFilter === tab
                    ? "bg-blue-900 text-white shadow-sm shadow-blue-900/30"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* INQUIRIES DATA TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              {/* TABLE HEAD */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Requirement</th>
                  <th className="py-3.5 px-4">Budget & Area</th>
                  <th className="py-3.5 px-4">Target Location</th>
                  <th className="py-3.5 px-4">Status & Visit</th>
                  <th className="py-3.5 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>

              {/* TABLE BODY */}
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((item) => {
                  const rawPhone = item.phone || "";
                  const cleanPhone = rawPhone.replace(/\D/g, "");
                  const whatsappMsg = encodeURIComponent(
                    `Namaste ${item.fullName || "Customer"}, we received your property inquiry for ${item.propertyType || "Property"} in ${item.city || "your city"}. How can we assist you?`
                  );

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {item.fullName || "Anonymous Buyer"}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {item.phone}
                        </div>
                        {item.email && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {item.email}
                          </div>
                        )}
                      </td>

                      {/* Requirement */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Home className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                          <span>{item.propertyType || "Any Property"}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                          <span className="rounded-md bg-blue-50 px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
                            {item.purpose || "Buy"}
                          </span>
                          {item.bhk && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                              {item.bhk}
                            </span>
                          )}
                          {item.furnishing && item.furnishing !== "Any" && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                              {item.furnishing}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Budget & Area */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{item.budget || "Not Specified"}</span>
                        </div>
                        {item.propertySize && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            {item.propertySize} {item.sizeUnit || "Sq. Ft."}
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1 font-medium text-slate-800">
                          <MapPin className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                          <span>{item.city || "Lucknow"}</span>
                        </div>
                        {item.locality && (
                          <div className="text-[11px] text-slate-500 pl-4 truncate max-w-[200px]">
                            {item.locality}
                          </div>
                        )}
                      </td>

                      {/* Status & Site Visit */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <StatusBadge status={item.status || "New"} />
                          <div>
                            {item.siteVisit === "Yes" ? (
                              <span className="inline-block rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                                Visit Req.
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                No visit
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Call Button */}
                          <a
                            href={`tel:${cleanPhone}`}
                            title="Direct Call"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {/* WhatsApp Button */}
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Message on WhatsApp"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Empty State */}
                {filteredInquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <Inbox className="mx-auto h-10 w-10 text-slate-300" />
                      <h3 className="mt-2 text-sm font-bold text-slate-700">
                        Koi Inquiry Nahi Mili
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Aapke search ya filter criteria ke hisaab se koi matching lead available nahi hai.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredInquiries.length}</strong> inquiries
            </span>
            <span className="text-[11px] text-slate-400">
              Live updates enabled
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}

// Stat Card Sub-component
function Stat({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${color}`}>
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        {value ?? 0}
      </p>
    </div>
  );
}

// Status Color Pill
function StatusBadge({ status }) {
  const s = (status || "New").toLowerCase();

  if (s === "converted" || s === "closed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Converted
      </span>
    );
  }

  if (s === "contacted" || s === "in progress") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Contacted
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> New Lead
    </span>
  );
}