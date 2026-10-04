"use client";

import Link from "next/link";
import {
Building2,
Users,
MessageSquare,
IndianRupee,
TrendingUp,
TrendingDown,
ArrowUpRight,
ArrowRight,
Plus,
Eye,
MapPin,
CalendarDays,
Clock,
CheckCircle2,
Clock3,
XCircle,
BarChart3,
Home,
Sparkles,
Bell,
Download,
MoreHorizontal,
ListChecks,
UserRound,
} from "lucide-react";

const stats = [
{
title: "Total Properties",
value: "248",
change: "+12.8%",
positive: true,
description: "Compared to last month",
icon: Building2,
color: "blue",
},
{
title: "Total Inquiries",
value: "1,284",
change: "+18.4%",
positive: true,
description: "Compared to last month",
icon: MessageSquare,
color: "violet",
},
{
title: "Registered Users",
value: "8,549",
change: "+8.2%",
positive: true,
description: "Compared to last month",
icon: Users,
color: "emerald",
},
{
title: "Total Revenue",
value: "₹12.8L",
change: "-2.4%",
positive: false,
description: "Compared to last month",
icon: IndianRupee,
color: "orange",
},
];

const properties = [
{
id: "DH-1024",
name: "Luxury Modern Villa",
location: "Gomti Nagar, Lucknow",
price: "₹1.85 Cr",
type: "Villa",
status: "Published",
image:
"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=240&q=80",
},
{
id: "DH-1025",
name: "Premium City Apartment",
location: "Indiranagar, Bangalore",
price: "₹85 Lac",
type: "Apartment",
status: "Pending",
image:
"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=240&q=80",
},
{
id: "DH-1026",
name: "Contemporary Family Home",
location: "Noida, Sector 150",
price: "₹1.25 Cr",
type: "House",
status: "Published",
image:
"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=240&q=80",
},
{
id: "DH-1027",
name: "Premium Residential Plot",
location: "Ayodhya Road, Lucknow",
price: "₹42 Lac",
type: "Plot",
status: "Review",
image:
"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=240&q=80",
},
];

const inquiries = [
{
name: "Rahul Sharma",
initials: "RS",
color: "bg-blue-100 text-blue-700",
property: "Luxury Modern Villa",
time: "5 min ago",
status: "New",
},
{
name: "Priya Verma",
initials: "PV",
color: "bg-purple-100 text-purple-700",
property: "Premium City Apartment",
time: "24 min ago",
status: "Contacted",
},
{
name: "Amit Singh",
initials: "AS",
color: "bg-emerald-100 text-emerald-700",
property: "Contemporary Family Home",
time: "1 hour ago",
status: "New",
},
{
name: "Neha Gupta",
initials: "NG",
color: "bg-orange-100 text-orange-700",
property: "Premium Residential Plot",
time: "2 hours ago",
status: "Closed",
},
];

const activity = [
{
title: "New property submitted",
description: "Premium City Apartment",
time: "10 minutes ago",
icon: Building2,
color: "bg-blue-50 text-blue-600",
},
{
title: "New customer inquiry",
description: "Rahul Sharma requested a callback",
time: "25 minutes ago",
icon: MessageSquare,
color: "bg-violet-50 text-violet-600",
},
{
title: "Property approved",
description: "Contemporary Family Home",
time: "1 hour ago",
icon: CheckCircle2,
color: "bg-emerald-50 text-emerald-600",
},
];

const weeklyData = [
{ day: "Mon", inquiries: 42, properties: 25 },
{ day: "Tue", inquiries: 64, properties: 38 },
{ day: "Wed", inquiries: 48, properties: 30 },
{ day: "Thu", inquiries: 82, properties: 48 },
{ day: "Fri", inquiries: 60, properties: 35 },
{ day: "Sat", inquiries: 95, properties: 56 },
{ day: "Sun", inquiries: 73, properties: 42 },
];

const colorClasses = {
blue: "bg-blue-50 text-blue-600",
violet: "bg-violet-50 text-violet-600",
emerald: "bg-emerald-50 text-emerald-600",
orange: "bg-orange-50 text-orange-600",
};

function SectionHeading({ title, subtitle, action }) {
return ( <div className="mb-5 flex flex-wrap items-center justify-between gap-3"> <div> <h2 className="text-base font-bold text-slate-900">{title}</h2>
{subtitle && ( <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
)} </div>
{action} </div>
);
}

function StatusBadge({ status }) {
const styles = {
Published: "bg-emerald-50 text-emerald-700",
Pending: "bg-amber-50 text-amber-700",
Review: "bg-blue-50 text-blue-700",
New: "bg-blue-50 text-blue-700",
Contacted: "bg-amber-50 text-amber-700",
Closed: "bg-emerald-50 text-emerald-700",
};

return (
<span
className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
>
{status} </span>
);
}

export default function AdminDashboard() {
const maxInquiries = Math.max(...weeklyData.map((item) => item.inquiries));

return ( <div className="min-h-screen bg-slate-50/80">
{/* TOP HEADER */} <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl"> <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 xl:px-8"> <div> <div className="flex items-center gap-2 text-xs text-slate-400"> <Home size={13} /> <span>/</span> <span>Admin</span> <span>/</span> <span className="font-medium text-blue-600">Dashboard</span> </div> <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
Dashboard Overview </h1> </div>

```
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Demo Environment
        </span>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="hidden items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:inline-flex"
        >
          <Download size={16} />
          Export / Print
        </button>
      </div>
    </div>
  </header>

  <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 xl:p-8">
    {/* WELCOME BANNER */}
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-xl shadow-blue-100 sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />
      <div className="pointer-events-none absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">
            <Sparkles size={14} />
            Real Estate Management
          </div>

          <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
            Welcome to DreamHome Admin
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Manage your properties, track customer inquiries, and monitor
            your real estate business from one place.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/properties"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              <Plus size={17} />
              Add Property
            </Link>

            <Link
              href="/admin/properties_List"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              View Listings
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="hidden shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm lg:flex">
          <Building2 size={76} strokeWidth={1.2} />
        </div>
      </div>
    </section>

    {/* STAT CARDS */}
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  colorClasses[stat.color]
                }`}
              >
                <Icon size={23} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  stat.positive ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {stat.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {stat.change}
              </span>

              <span className="text-xs text-slate-400">
                {stat.description}
              </span>
            </div>
          </div>
        );
      })}
    </section>

    {/* CHART AND PROPERTY STATUS */}
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* INQUIRIES CHART */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
        <SectionHeading
          title="Business Overview"
          subtitle="Weekly inquiry and property activity"
          action={
            <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              Last 7 days
            </span>
          }
        />

        <div className="mb-5 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            Inquiries
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
            Properties
          </div>
        </div>

        <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-2 sm:gap-4">
          {weeklyData.map((item) => (
            <div
              key={item.day}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
            >
              <div className="flex h-full w-full items-end justify-center gap-1 sm:gap-2">
                <div
                  title={`${item.inquiries} inquiries`}
                  className="w-[42%] max-w-7 rounded-t-md bg-blue-600 transition hover:bg-blue-700"
                  style={{
                    height: `${(item.inquiries / maxInquiries) * 100}%`,
                  }}
                />
                <div
                  title={`${item.properties} properties`}
                  className="w-[42%] max-w-7 rounded-t-md bg-cyan-300 transition hover:bg-cyan-400"
                  style={{
                    height: `${(item.properties / maxInquiries) * 100}%`,
                  }}
                />
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                {item.day}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-700">
          <TrendingUp size={16} className="shrink-0" />
          <span>
            Saturday recorded the highest inquiry volume in this demo.
          </span>
        </div>
      </div>

      {/* PROPERTY STATUS */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          title="Property Status"
          subtitle="Current listing distribution"
        />

        <div className="flex items-center gap-5 py-5">
          <div
            className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(#2563eb 0% 62%, #f59e0b 62% 82%, #10b981 82% 94%, #e2e8f0 94% 100%)",
            }}
          >
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-extrabold text-slate-900">
                248
              </span>
              <span className="text-[10px] text-slate-400">
                Properties
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            {[
              ["Published", "154", "bg-blue-600"],
              ["Pending", "50", "bg-amber-400"],
              ["Approved", "26", "bg-emerald-500"],
              ["Other", "18", "bg-slate-300"],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`h-2 w-2 rounded-full ${color}`}
                    />
                    {label}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/admin/properties_List"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Manage All Properties
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>

    {/* RECENT PROPERTIES */}
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        title="Recent Properties"
        subtitle="Recently added property listings"
        action={
          <Link
            href="/admin/properties_List"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        }
      />

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-y border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="py-4 pr-4 font-semibold">Property</th>
              <th className="px-4 py-4 font-semibold">Property ID</th>
              <th className="px-4 py-4 font-semibold">Type</th>
              <th className="px-4 py-4 font-semibold">Price</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="py-4 pl-4 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="transition hover:bg-slate-50/80"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="h-14 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0">
                      <p className="max-w-52 truncate text-sm font-bold text-slate-800">
                        {property.name}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={12} />
                        {property.location}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-xs font-medium text-slate-500">
                  {property.id}
                </td>

                <td className="px-4 py-4 text-sm text-slate-600">
                  {property.type}
                </td>

                <td className="px-4 py-4 text-sm font-bold text-slate-800">
                  {property.price}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={property.status} />
                </td>

                <td className="py-4 pl-4 text-right">
                  <Link
                    href="/admin/properties_List"
                    aria-label={`View ${property.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Eye size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile property cards */}
      <div className="space-y-3 md:hidden">
        {properties.map((property) => (
          <div
            key={property.id}
            className="rounded-xl border border-slate-100 p-3"
          >
            <div className="flex gap-3">
              <img
                src={property.image}
                alt={property.name}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={property.status} />
                  <span className="text-[10px] text-slate-400">
                    {property.id}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800">
                  {property.name}
                </h3>

                <p className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                  <MapPin size={13} className="mt-0.5 shrink-0" />
                  {property.location}
                </p>

                <p className="mt-2 text-sm font-extrabold text-blue-600">
                  {property.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* INQUIRIES AND ACTIVITY */}
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* RECENT INQUIRIES */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          title="Recent Inquiries"
          subtitle="Latest customer requests"
          action={
            <Link
              href="/admin/properties_List"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View all
            </Link>
          }
        />

        <div className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.name}
              className="flex items-center gap-3 py-4 first:pt-1 last:pb-1"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${inquiry.color}`}
              >
                {inquiry.initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {inquiry.name}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {inquiry.property}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={11} />
                  {inquiry.time}
                </p>
              </div>

              <StatusBadge status={inquiry.status} />
            </div>
          ))}
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeading
          title="Recent Activity"
          subtitle="Latest updates across your dashboard"
          action={
            <button
              type="button"
              aria-label="More activity options"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <MoreHorizontal size={20} />
            </button>
          }
        />

        <div className="space-y-5">
          {activity.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={19} />
                  </div>

                  {index !== activity.length - 1 && (
                    <div className="my-2 min-h-5 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  <p className="text-sm font-bold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock3 size={11} />
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* QUICK ACTIONS */}
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        title="Quick Actions"
        subtitle="Frequently used admin shortcuts"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Manage Properties",
            description: "Add and edit properties",
            icon: Building2,
            href: "/admin/properties",
            color: "bg-blue-50 text-blue-600",
          },
          {
            title: "Property Listings",
            description: "Review existing listings",
            icon: ListChecks,
            href: "/admin/properties_List",
            color: "bg-violet-50 text-violet-600",
          },
          {
            title: "AI Analytics",
            description: "Explore AI insights",
            icon: Sparkles,
            href: "/admin/ai-analytics",
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            title: "Admin Profile",
            description: "Manage your account",
            icon: UserRound,
            href: "/admin/profile",
            color: "bg-orange-50 text-orange-600",
          },
        ].map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
              >
                <Icon size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {action.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
              />
            </Link>
          );
        })}
      </div>
    </section>

    {/* FOOTER */}
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-5 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
      <p>
        © {new Date().getFullYear()} DreamHome Admin Dashboard.
        All rights reserved.
      </p>
      <p>Demo data · Connect APIs for live statistics</p>
    </footer>
  </main>
</div>


);
}
