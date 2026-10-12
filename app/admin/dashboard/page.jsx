
"use client";

import { useState } from "react";
import Link from "next/link";


import {
  Building2,
  Users,
  Eye,
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  MessageSquare,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { useGetAdminDashboardQuery } from "../../../RTK/services/propertyApi";

export default function AdminDashboard() {
  const [days, setDays] = useState(7);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminDashboardQuery(days);


  console.log("Dashboard API Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  const dashboard = data?.success ? data : null;
  const summary = dashboard?.summary;
  const properties = dashboard?.recentProperties || [];
  const inquiries = dashboard?.recentInquiries || [];
  const activity = dashboard?.activity || [];

  const cards = [
    {
      title: "Total Properties",
      value: summary?.totalProperties ?? 0,
      subtitle: `${summary?.pendingProperties ?? 0} pending`,
      icon: Building2,
      color: "blue",
    },
    {
      title: "Total Inquiries",
      value: summary?.totalInquiries ?? 0,
      subtitle: `${summary?.newInquiries ?? 0} new inquiries`,
      icon: Users,
      color: "emerald",
    },
    {
      title: "Property Views",
      value: summary?.totalViews ?? 0,
      subtitle: "Tracked views",
      icon: Eye,
      color: "violet",
    },
    {
      title: "Active Admins",
      value: summary?.activeAdmins ?? 0,
      subtitle: "Active accounts",
      icon: ShieldCheck,
      color: "amber",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading dashboard data...
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="m-6 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Dashboard data load nahi hua
        </h2>
        <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-red-600">
          {JSON.stringify(error?.data || error, null, 2)}
        </pre>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-7">
      <div className="mx-auto max-w-[1500px] space-y-7">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              DreamHome / Admin
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your properties, inquiries and business activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            const iconColors = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              violet: "bg-violet-50 text-violet-600",
              amber: "bg-amber-50 text-amber-600",
            };

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {Number(card.value).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${iconColors[card.color]}`}>
                    <Icon size={22} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  {card.subtitle}
                </p>
              </div>
            );
          })}
        </section>

        {/* Property and inquiry analytics */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Business Activity
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Daily property additions and incoming inquiries
                </p>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                {days} days
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {activity.map((item) => {
                const propertyMax = Math.max(
                  1,
                  ...activity.map((x) => x.properties)
                );
                const inquiryMax = Math.max(
                  1,
                  ...activity.map((x) => x.inquiries)
                );

                return (
                  <div
                    key={item.date}
                    className="grid grid-cols-[72px_1fr] items-center gap-3"
                  >
                    <span className="text-xs text-slate-500">
                      {item.date.slice(5)}
                    </span>

                    <div className="space-y-1.5">
                      <div className="flex h-2 items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${(item.properties / propertyMax) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-5 text-right text-xs text-slate-600">
                          {item.properties}
                        </span>
                      </div>

                      <div className="flex h-2 items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${(item.inquiries / inquiryMax) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="w-5 text-right text-xs text-slate-600">
                          {item.inquiries}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Properties
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Inquiries
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              Property Overview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Current database status
            </p>

            <div className="mt-6 space-y-5">
              {[
                {
                  label: "Approved",
                  count: summary.approvedProperties,
                  color: "bg-emerald-500",
                },
                {
                  label: "Pending",
                  count: summary.pendingProperties,
                  color: "bg-amber-500",
                },
                {
                  label: "Other statuses",
                  count: Math.max(
                    0,
                    summary.totalProperties -
                    summary.approvedProperties -
                    summary.pendingProperties
                  ),
                  color: "bg-slate-400",
                },
              ].map((item) => {
                const percent = summary.totalProperties
                  ? (item.count / summary.totalProperties) * 100
                  : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.label}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/admin/properties"
              className="mt-7 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Manage properties <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        {/* Recent properties */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Properties
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest properties from your database
              </p>
            </div>
            <Link
              href="/admin/properties"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          {properties.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No properties found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                      {property.coverImage ? (
                        <img
                          src={property.coverImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Building2 size={22} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {property.title || "Untitled Property"}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} />
                        {property.location?.city || "Location unavailable"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className="text-sm font-semibold text-slate-900">
                      ₹{Number(property.price || 0).toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize text-slate-600">
                      {property.status || "Unknown"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {property.listingType || ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent inquiries */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Inquiries
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest customer leads
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No inquiries found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {inquiry.name || "Customer"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {inquiry.propertyTitle || "General inquiry"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {inquiry.phone || inquiry.email || "No contact details"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {inquiry.status || "New"}
                    </span>
                    <Clock size={15} className="text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-right text-xs text-slate-400">
          Last generated:{" "}
          {dashboard.generatedAt
            ? new Date(dashboard.generatedAt).toLocaleString("en-IN")
            : "Unavailable"}
        </p>
      </div>
    </main>
  );
}
