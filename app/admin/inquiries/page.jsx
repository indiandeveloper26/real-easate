
"use client";

import React, { useState, useEffect, useRef } from "react";

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
} from "lucide-react";

import { useGetAdminInquiriesQuery } from "../../../RTK/store/api/admin/inquiries";

const STATUS_OPTIONS = [
  "All",
  "New",
  "Contacted",
  "Qualified",
  "Site Visit",
  "Converted",
  "Closed",
];

const PAGE_SIZE = 10;

export default function AdminInquiriesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [inquiries, setInquiries] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const requestLockRef = useRef(false);

  // Debounce search input.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch current page and automatically refetch when
  // arguments change or the component mounts.
  const {
    currentData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminInquiriesQuery(
    {
      status: statusFilter,
      search: debouncedSearch,
      page,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const stats = currentData?.stats;

  // Reset pagination when filters change.
  useEffect(() => {
    setInquiries([]);
    setHasMore(false);
    setPage(1);
    requestLockRef.current = false;
  }, [statusFilter, debouncedSearch]);

  // Apply the API response for the active page.
  useEffect(() => {
    if (!currentData?.success) return;

    if (currentData.pagination?.page !== page) return;

    const incoming = currentData.inquiries || [];

    console.log("[ADMIN INQUIRIES]", {
      requestedPage: page,
      apiCount: currentData.count,
      apiLimit: currentData.pagination?.limit,
      incomingCount: incoming.length,
      totalMatching: currentData.pagination?.total,
      hasMore: currentData.pagination?.hasMore,
    });

    setInquiries((previous) => {
      // Page 1 replaces old results.
      if (page === 1) {
        return incoming.slice(0, PAGE_SIZE);
      }

      // Other pages append only unique records.
      const existingIds = new Set(
        previous.map((item) => String(item._id))
      );

      const uniqueIncoming = incoming.filter(
        (item) => !existingIds.has(String(item._id))
      );

      return [...previous, ...uniqueIncoming];
    });

    setHasMore(Boolean(currentData.pagination?.hasMore));
    requestLockRef.current = false;
  }, [currentData, page]);

  // Release the lock after the request finishes.
  useEffect(() => {
    if (!isFetching) {
      requestLockRef.current = false;
    }
  }, [isFetching]);

  // Load the next page only when clicked.
  const loadMore = () => {
    if (
      requestLockRef.current ||
      isFetching ||
      !hasMore ||
      !currentData?.pagination?.hasMore ||
      currentData.pagination.page !== page
    ) {
      return;
    }

    const nextPage = currentData.pagination.nextPage;

    if (!nextPage) {
      setHasMore(false);
      return;
    }

    requestLockRef.current = true;
    setPage(nextPage);
  };

  const handleRefresh = async () => {
    requestLockRef.current = false;

    // Purana data clear MAT karo.
    // setInquiries([]) remove kar diya.
    // setHasMore(false) bhi remove kar diya.

    try {
      if (page !== 1) {
        setPage(1);
        return;
      }

      await refetch();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };



  if (isLoading && !currentData) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-slate-200" />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  if (isError && inquiries.length === 0) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500" />

          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Inquiries Load Nahi Ho Saki
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Server ya network issue ho sakta hai. Dobara koshish karein.
          </p>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              CRM Lead Pipeline
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Property Inquiries & Leads
            </h1>

            <p className="mt-1 text-xs font-light text-slate-300 sm:text-sm">
              Manage property inquiries, customer details and follow-ups.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-blue-400" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh Leads"}
          </button>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-4">
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
        </section>

        {/* SEARCH AND FILTERS */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, phone, email, property or location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {STATUS_OPTIONS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${statusFilter === tab
                    ? "bg-blue-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {/* INQUIRIES TABLE */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3.5">Customer Details</th>
                  <th className="px-4 py-3.5">Property</th>
                  <th className="px-4 py-3.5">Budget</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Quick Contact</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {inquiries.map((item) => {
                  const cleanPhone = (item.phone || "").replace(/\D/g, "");

                  const whatsappPhone =
                    cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                  const whatsappMsg = encodeURIComponent(
                    `Namaste ${item.name || "Customer"}, we received your inquiry for ${item.propertyTitle || "Property"
                    } in ${item.propertyLocation || "your preferred location"
                    }. How can we assist you?`
                  );

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-bold text-slate-900">
                          {item.name || "Customer"}
                        </div>

                        <div className="mt-0.5 font-mono text-[11px] text-slate-500">
                          {item.phone || "No phone"}
                        </div>

                        {item.email && (
                          <div className="mt-0.5 max-w-[180px] truncate text-[10px] text-slate-400">
                            {item.email}
                          </div>
                        )}

                        {item.createdAt && (
                          <div className="mt-1 text-[10px] text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-1.5 font-semibold text-slate-800">
                          <Home className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700" />
                          <span>{item.propertyTitle || "Property Inquiry"}</span>
                        </div>

                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {item.purpose || "Buy"}
                          </span>

                          {item.source && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                              {item.source}
                            </span>
                          )}
                        </div>

                        {item.propertyPrice != null && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            Property price: ₹
                            {Number(item.propertyPrice).toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 font-bold text-slate-900">
                          <IndianRupee className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          <span>{item.budget || "Not specified"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-1 font-medium text-slate-800">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                          <span>{item.propertyLocation || "Not specified"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status || "New"} />

                        {item.message && (
                          <p
                            title={item.message}
                            className="mt-2 max-w-[180px] truncate text-[10px] text-slate-500"
                          >
                            {item.message}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={cleanPhone ? `tel:${cleanPhone}` : undefined}
                            title="Call customer"
                            aria-label="Call customer"
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white ${!cleanPhone ? "pointer-events-none opacity-40" : ""
                              }`}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          <a
                            href={
                              whatsappPhone
                                ? `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`
                                : undefined
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Message on WhatsApp"
                            aria-label="Message on WhatsApp"
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white ${!whatsappPhone ? "pointer-events-none opacity-40" : ""
                              }`}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {isFetching && inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                      <p className="mt-2 text-xs text-slate-500">
                        Loading inquiries...
                      </p>
                    </td>
                  </tr>
                )}

                {!isFetching && inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <Inbox className="mx-auto h-10 w-10 text-slate-300" />

                      <h3 className="mt-2 text-sm font-bold text-slate-700">
                        Koi Inquiry Nahi Mili
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Search ya status filter change karke dekhein.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-500 sm:flex-row">
            <span>
              Loaded{" "}
              <strong className="text-slate-800">{inquiries.length}</strong>{" "}
              of{" "}
              <strong className="text-slate-800">
                {currentData?.pagination?.total ?? 0}
              </strong>{" "}
              matching inquiries
            </span>

            {isFetching && inquiries.length > 0 && (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Updating inquiries...
              </span>
            )}

            {!isFetching && hasMore && inquiries.length > 0 && (
              <button
                type="button"
                onClick={loadMore}
                disabled={isFetching || requestLockRef.current}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Load More
              </button>
            )}

            {!hasMore && inquiries.length > 0 && !isFetching && (
              <span className="font-medium text-emerald-700">
                All inquiries loaded
              </span>
            )}

            {isError && inquiries.length > 0 && (
              <button
                onClick={handleRefresh}
                className="font-semibold text-rose-600 hover:underline"
              >
                Reload data
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {value ?? 0}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    New: "border-amber-200 bg-amber-50 text-amber-700",
    Contacted: "border-blue-200 bg-blue-50 text-blue-700",
    Qualified: "border-violet-200 bg-violet-50 text-violet-700",
    "Site Visit": "border-indigo-200 bg-indigo-50 text-indigo-700",
    Converted: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Closed: "border-slate-200 bg-slate-100 text-slate-600",
  };

  const dotStyles = {
    New: "bg-amber-500",
    Contacted: "bg-blue-500",
    Qualified: "bg-violet-500",
    "Site Visit": "bg-indigo-500",
    Converted: "bg-emerald-500",
    Closed: "bg-slate-500",
  };

  const label = styles[status] ? status : "New";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[label]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[label]}`} />
      {label}
    </span>
  );
}

