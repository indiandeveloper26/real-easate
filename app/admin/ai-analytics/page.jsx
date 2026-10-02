
"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  CalendarCheck,
  Flame,
  Sparkles,
  Search,
  Bell,
  ChevronDown,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  IndianRupee,
  Home,
  BedDouble,
  Ruler,
  Clock3,
  ArrowUpRight,
  CircleAlert,
  CalendarDays,
  Bot,
  X,
  RefreshCw,
  Eye,
  Send,
} from "lucide-react";

/* =========================================================
   DUMMY DATA
========================================================= */

const leads = [
  {
    id: 1,
    name: "Rahul Sharma",
    initials: "RS",
    phone: "+91 98765 43210",
    email: "rahul.sharma@gmail.com",
    city: "Lucknow",
    locality: "Gomti Nagar",
    purpose: "Buy",
    propertyType: "Apartment / Flat",
    bhk: "3 BHK",
    budget: "₹50 Lakh - ₹1 Crore",
    propertySize: "1500 Sq. Ft.",
    furnishing: "Semi Furnished",
    possession: "1 - 3 Months",
    contactPreference: "WhatsApp",
    siteVisit: "Yes",
    score: 87,
    priority: "Hot",
    intent: "High Purchase Intent",
    urgency: "High",
    status: "New",
    createdAt: "10 min ago",
    followUp: "Today, 11:30 AM",
    summary:
      "Customer is looking for a 3 BHK apartment in Gomti Nagar with a budget of ₹50L–₹1Cr. Customer prefers a gated society near a school and is ready for a site visit.",
    needs: [
      "Gated Society",
      "Near School",
      "3 BHK",
      "Semi Furnished",
    ],
    action:
      "Contact customer within 30 minutes and share 3–5 matching properties.",
    questions: [
      "Which specific part of Gomti Nagar do you prefer?",
      "Is bank financing required?",
      "What is the minimum required property size?",
    ],
  },
  {
    id: 2,
    name: "Priya Singh",
    initials: "PS",
    phone: "+91 91234 56780",
    email: "priya.singh@gmail.com",
    city: "Noida",
    locality: "Sector 137",
    purpose: "Buy",
    propertyType: "Villa / Kothi",
    bhk: "4 BHK",
    budget: "₹1 Crore - ₹2 Crore",
    propertySize: "2400 Sq. Ft.",
    furnishing: "Fully Furnished",
    possession: "Immediately",
    contactPreference: "Call",
    siteVisit: "Yes",
    score: 91,
    priority: "Hot",
    intent: "Very High Purchase Intent",
    urgency: "High",
    status: "Contacted",
    createdAt: "32 min ago",
    followUp: "Today, 12:15 PM",
    summary:
      "High-value buyer looking for an immediately available 4 BHK villa in Sector 137. Strong purchase intent with a defined budget and immediate possession requirement.",
    needs: [
      "4 BHK",
      "Villa",
      "Fully Furnished",
      "Immediate Possession",
    ],
    action:
      "Call immediately and schedule a property visit with premium listings.",
    questions: [
      "Preferred gated society?",
      "Is the buyer open to nearby sectors?",
    ],
  },
  {
    id: 3,
    name: "Amit Verma",
    initials: "AV",
    phone: "+91 99887 66554",
    email: "amit.verma@gmail.com",
    city: "Lucknow",
    locality: "Indira Nagar",
    purpose: "Buy",
    propertyType: "Apartment / Flat",
    bhk: "2 BHK",
    budget: "₹30 Lakh - ₹50 Lakh",
    propertySize: "1100 Sq. Ft.",
    furnishing: "Any",
    possession: "3 - 6 Months",
    contactPreference: "WhatsApp",
    siteVisit: "Not Now",
    score: 74,
    priority: "Warm",
    intent: "Medium Purchase Intent",
    urgency: "Medium",
    status: "AI Analyzed",
    createdAt: "1 hour ago",
    followUp: "Tomorrow, 10:00 AM",
    summary:
      "Customer wants an affordable 2 BHK apartment in Indira Nagar. Budget is clearly defined but customer is not currently ready for a site visit.",
    needs: [
      "2 BHK",
      "Affordable",
      "Indira Nagar",
      "Good Connectivity",
    ],
    action:
      "Send 3 suitable properties on WhatsApp and follow up tomorrow.",
    questions: [
      "Is loan financing required?",
      "Preferred floor?",
    ],
  },
  {
    id: 4,
    name: "Neha Gupta",
    initials: "NG",
    phone: "+91 90011 22334",
    email: "neha.gupta@gmail.com",
    city: "Gorakhpur",
    locality: "Medical Road",
    purpose: "Buy",
    propertyType: "Residential Plot",
    bhk: "N/A",
    budget: "₹30 Lakh - ₹50 Lakh",
    propertySize: "1800 Sq. Ft.",
    furnishing: "N/A",
    possession: "Any Time",
    contactPreference: "Call",
    siteVisit: "Yes",
    score: 68,
    priority: "Warm",
    intent: "Medium Purchase Intent",
    urgency: "Medium",
    status: "Site Visit",
    createdAt: "2 hours ago",
    followUp: "Today, 4:00 PM",
    summary:
      "Customer is interested in purchasing a residential plot around Medical Road with a budget up to ₹50L and has requested a site visit.",
    needs: [
      "Residential Plot",
      "1800 Sq. Ft.",
      "Medical Road",
      "Site Visit",
    ],
    action:
      "Confirm site visit timing and share available plot options.",
    questions: [
      "Preferred road width?",
      "Corner plot required?",
    ],
  },
  {
    id: 5,
    name: "Ravi Kumar",
    initials: "RK",
    phone: "+91 87766 55443",
    email: "ravi.kumar@gmail.com",
    city: "Kanpur",
    locality: "Kalyanpur",
    purpose: "Rent",
    propertyType: "Apartment / Flat",
    bhk: "2 BHK",
    budget: "Under ₹30 Lakh",
    propertySize: "1000 Sq. Ft.",
    furnishing: "Semi Furnished",
    possession: "Immediately",
    contactPreference: "WhatsApp",
    siteVisit: "Not Now",
    score: 48,
    priority: "Cold",
    intent: "Low Purchase Intent",
    urgency: "Low",
    status: "New",
    createdAt: "3 hours ago",
    followUp: "Tomorrow",
    summary:
      "Customer is currently looking for a 2 BHK rental apartment in Kalyanpur. Requirement is basic and immediate, but no site visit has been requested yet.",
    needs: [
      "2 BHK",
      "Rental",
      "Semi Furnished",
      "Immediate",
    ],
    action:
      "Send rental options and wait for customer response before calling.",
    questions: [
      "Maximum monthly rent?",
      "Preferred move-in date?",
    ],
  },
  {
    id: 6,
    name: "Sanjay Mishra",
    initials: "SM",
    phone: "+91 81122 33445",
    email: "sanjay.mishra@gmail.com",
    city: "Lucknow",
    locality: "Aliganj",
    purpose: "Invest",
    propertyType: "Commercial Shop",
    bhk: "N/A",
    budget: "₹1 Crore - ₹2 Crore",
    propertySize: "1200 Sq. Ft.",
    furnishing: "N/A",
    possession: "Any Time",
    contactPreference: "Call",
    siteVisit: "Yes",
    score: 82,
    priority: "Hot",
    intent: "High Investment Intent",
    urgency: "Medium",
    status: "Negotiation",
    createdAt: "Yesterday",
    followUp: "Today, 2:30 PM",
    summary:
      "Investor looking for a commercial shop in Aliganj with a budget between ₹1–2Cr. Strong interest in investment potential and rental yield.",
    needs: [
      "Commercial",
      "High Footfall",
      "Rental Yield",
      "Aliganj",
    ],
    action:
      "Share commercial properties with rental yield and ROI details.",
    questions: [
      "Expected rental yield?",
      "Preferred road frontage?",
    ],
  },
];

/* =========================================================
   RECOMMENDED PROPERTIES
========================================================= */

const recommendedProperties = [
  {
    id: 1,
    title: "Premium 3 BHK Apartment",
    location: "Gomti Nagar Extension, Lucknow",
    price: "₹82 Lakh",
    size: "1520 Sq. Ft.",
    match: 94,
    type: "Apartment",
  },
  {
    id: 2,
    title: "Luxury 3 BHK Residence",
    location: "Sushant Golf City, Lucknow",
    price: "₹96 Lakh",
    size: "1680 Sq. Ft.",
    match: 91,
    type: "Apartment",
  },
  {
    id: 3,
    title: "Modern 3 BHK Flat",
    location: "Vibhuti Khand, Lucknow",
    price: "₹78 Lakh",
    size: "1450 Sq. Ft.",
    match: 88,
    type: "Apartment",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminDashboardPage() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        lead.name.toLowerCase().includes(searchValue) ||
        lead.city.toLowerCase().includes(searchValue) ||
        lead.locality.toLowerCase().includes(searchValue);

      const matchesPriority =
        priorityFilter === "All" ||
        lead.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [search, priorityFilter]);

  const stats = [
    {
      title: "Total Leads",
      value: "248",
      change: "+18.5%",
      icon: Users,
      description: "vs last month",
    },
    {
      title: "Hot Leads",
      value: "42",
      change: "+12.4%",
      icon: Flame,
      description: "high intent",
    },
    {
      title: "AI Analyzed",
      value: "231",
      change: "+24.8%",
      icon: Sparkles,
      description: "93% of leads",
    },
    {
      title: "Site Visits",
      value: "31",
      change: "+8.2%",
      icon: CalendarCheck,
      description: "this month",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f5f7fb] text-slate-800">

      {/* =================================================
          HEADER
      ================================================= */}


      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="w-full">

        <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto">

          {/* GREETING */}

          <div className="mb-6 sm:mb-7">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">

              <div className="min-w-0">

                <p className="text-xs sm:text-sm text-slate-400 mb-1">
                  Thursday, October 2, 2026
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                  Good Morning, Admin 👋
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Here's what's happening with your real estate leads today.
                </p>

              </div>

              <button className="w-full sm:w-auto self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition">

                <RefreshCw className="w-4 h-4" />

                Refresh Data

              </button>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-7">

            {stats.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition min-w-0"
                >

                  <div className="flex items-start justify-between gap-2">

                    <div className="min-w-0">

                      <p className="text-[10px] sm:text-xs font-semibold text-slate-400 truncate">
                        {stat.title}
                      </p>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                        {stat.value}
                      </h3>

                    </div>

                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-3">

                    <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-600">

                      <ArrowUpRight className="w-3 h-3" />

                      {stat.change}

                    </span>

                    <span className="text-[9px] sm:text-[10px] text-slate-400">
                      {stat.description}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

          {/* =================================================
              AI BANNER
          ================================================= */}

          <div className="bg-gradient-to-r from-[#101d38] to-[#162b52] rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-7 overflow-hidden relative">

            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              <div className="flex items-start gap-3 sm:gap-4 min-w-0">

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/20 border border-blue-400/20 flex items-center justify-center shrink-0">

                  <Sparkles className="w-5 h-5 text-blue-300" />

                </div>

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2 mb-1">

                    <h3 className="font-bold text-sm">
                      AI Lead Intelligence
                    </h3>

                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      ACTIVE
                    </span>

                  </div>

                  <p className="text-xs text-slate-300 max-w-2xl leading-5">
                    AI analyzed 231 leads and identified{" "}
                    <span className="text-white font-bold">
                      42 high-intent customers
                    </span>
                    . 8 leads need immediate follow-up today.
                  </p>

                </div>

              </div>

              <button
                onClick={() => setPriorityFilter("Hot")}
                className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition shrink-0"
              >
                View Hot Leads
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_360px] gap-6">

            {/* =================================================
                LEADS
            ================================================= */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-w-0">

              <div className="p-4 sm:p-5 border-b border-slate-100">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Recent Leads
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Customer requirements analyzed by AI
                    </p>

                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto max-w-full">

                    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">

                      {["All", "Hot", "Warm", "Cold"].map((filter) => (

                        <button
                          key={filter}
                          onClick={() => setPriorityFilter(filter)}
                          className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] font-bold transition whitespace-nowrap ${
                            priorityFilter === filter
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {filter}
                        </button>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[780px]">

                  <thead>

                    <tr className="bg-slate-50 border-b border-slate-100">

                      <th className="text-left px-4 sm:px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Customer
                      </th>

                      <th className="text-left px-4 sm:px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Requirement
                      </th>

                      <th className="text-left px-4 sm:px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        AI Score
                      </th>

                      <th className="text-left px-4 sm:px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Status
                      </th>

                      <th className="text-right px-4 sm:px-5 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredLeads.map((lead) => (

                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/70 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {lead.initials}
                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-bold text-slate-800 whitespace-nowrap">
                                {lead.name}
                              </p>

                              <div className="flex items-center gap-1 mt-1">

                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />

                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {lead.locality}, {lead.city}
                                </span>

                              </div>

                            </div>

                          </div>

                        </td>

                        {/* REQUIREMENT */}

                        <td className="px-4 sm:px-5 py-4">

                          <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                            {lead.bhk}{" "}
                            {lead.propertyType === "Apartment / Flat"
                              ? "Apartment"
                              : lead.propertyType}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">
                            {lead.budget}
                          </p>

                        </td>

                        {/* SCORE */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="w-9 h-9 rounded-full border-4 border-blue-100 flex items-center justify-center shrink-0">

                              <span className="text-[10px] font-extrabold text-blue-700">
                                {lead.score}
                              </span>

                            </div>

                            <span
                              className={`text-[9px] px-2 py-1 rounded-md font-bold ${
                                lead.priority === "Hot"
                                  ? "bg-red-50 text-red-600"
                                  : lead.priority === "Warm"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {lead.priority}
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 sm:px-5 py-4">

                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 whitespace-nowrap">

                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                lead.status === "New"
                                  ? "bg-blue-500"
                                  : lead.status === "Contacted"
                                  ? "bg-purple-500"
                                  : lead.status === "Site Visit"
                                  ? "bg-amber-500"
                                  : lead.status === "Negotiation"
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                              }`}
                            />

                            {lead.status}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-4 sm:px-5 py-4 text-right">

                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-[10px] font-bold transition whitespace-nowrap"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>

                        </td>

                      </tr>

                    ))}

                    {filteredLeads.length === 0 && (

                      <tr>

                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center"
                        >

                          <p className="text-sm font-semibold text-slate-500">
                            No leads found
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Try another search or filter.
                          </p>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {/* FOOTER */}

              <div className="px-4 sm:px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">

                <p className="text-[10px] text-slate-400">
                  Showing {filteredLeads.length} of 248 leads
                </p>

                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  View All Leads →
                </button>

              </div>

            </section>

            {/* =================================================
                RIGHT COLUMN
            ================================================= */}

            <div className="space-y-6">

              {/* FOLLOW UPS */}

              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">

                  <div>

                    <h2 className="font-bold text-slate-900 text-sm">
                      Today's Follow-ups
                    </h2>

                    <p className="text-[10px] text-slate-400 mt-1">
                      Leads requiring attention
                    </p>

                  </div>

                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">

                    <Clock3 className="w-4 h-4" />

                  </div>

                </div>

                <div className="p-4 space-y-3">

                  {leads
                    .filter((lead) => lead.followUp.includes("Today"))
                    .slice(0, 4)
                    .map((lead) => (

                      <div
                        key={lead.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition"
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex items-center gap-2 min-w-0">

                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                              {lead.initials}
                            </div>

                            <div className="min-w-0">

                              <p className="text-[11px] font-bold text-slate-800 truncate">
                                {lead.name}
                              </p>

                              <p className="text-[9px] text-slate-400 truncate">
                                {lead.bhk} • {lead.locality}
                              </p>

                            </div>

                          </div>

                          <span className="text-[9px] font-bold text-red-500 whitespace-nowrap">
                            {lead.followUp.replace("Today, ", "")}
                          </span>

                        </div>

                        <div className="flex gap-2 mt-3">

                          <button className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 hover:text-blue-600 transition">

                            <Phone className="w-3 h-3 inline mr-1" />

                            Call

                          </button>

                          <button className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 hover:text-emerald-600 transition">

                            <MessageCircle className="w-3 h-3 inline mr-1" />

                            WhatsApp

                          </button>

                        </div>

                      </div>

                    ))}

                </div>

              </section>

              {/* AI SUMMARY */}

              <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="p-4 sm:p-5 border-b border-slate-100">

                  <div className="flex items-center gap-2">

                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">

                      <Bot className="w-4 h-4" />

                    </div>

                    <div>

                      <h2 className="font-bold text-sm">
                        AI Summary
                      </h2>

                      <p className="text-[10px] text-slate-400">
                        Today's lead intelligence
                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-4 sm:p-5 space-y-4">

                  <DemandStat
                    label="High Intent"
                    value="42"
                    color="red"
                    width="68%"
                  />

                  <DemandStat
                    label="Medium Intent"
                    value="76"
                    color="amber"
                    width="52%"
                  />

                  <DemandStat
                    label="Low Intent"
                    value="113"
                    color="emerald"
                    width="38%"
                  />

                  <div className="pt-3 border-t border-slate-100">

                    <p className="text-[10px] text-slate-400 leading-5">

                      AI detected that most high-intent leads are looking
                      for{" "}

                      <strong className="text-slate-700">
                        2–3 BHK apartments
                      </strong>{" "}
                      in Lucknow and Noida.

                    </p>

                  </div>

                </div>

              </section>

            </div>

          </div>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* LEAD ANALYTICS */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

                <div>

                  <h2 className="font-bold text-slate-900">
                    Lead Analytics
                  </h2>

                  <p className="text-[10px] text-slate-400 mt-1">
                    Lead generation over the last 7 days
                  </p>

                </div>

                <select className="w-full sm:w-auto text-[10px] font-bold border border-slate-200 rounded-lg px-2.5 py-2 outline-none bg-white">

                  <option>Last 7 Days</option>

                  <option>Last 30 Days</option>

                  <option>Last 90 Days</option>

                </select>

              </div>

              <div className="h-[190px] flex items-end gap-2 sm:gap-5 px-1 sm:px-2">

                {[
                  ["Mon", 45],
                  ["Tue", 62],
                  ["Wed", 52],
                  ["Thu", 78],
                  ["Fri", 66],
                  ["Sat", 84],
                  ["Sun", 72],
                ].map(([day, value]) => (

                  <div
                    key={day}
                    className="flex-1 h-full flex flex-col justify-end items-center gap-2 min-w-0"
                  >

                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">
                      {value}
                    </span>

                    <div
                      className="w-full max-w-[32px] bg-blue-500 rounded-t-lg"
                      style={{
                        height: `${value * 1.65}px`,
                      }}
                    />

                    <span className="text-[8px] sm:text-[9px] text-slate-400">
                      {day}
                    </span>

                  </div>

                ))}

              </div>

            </section>

            {/* PROPERTY DEMAND */}

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

              <div className="mb-5">

                <h2 className="font-bold text-slate-900">
                  Property Demand
                </h2>

                <p className="text-[10px] text-slate-400 mt-1">
                  What customers are looking for
                </p>

              </div>

              <div className="space-y-4">

                <DemandBar
                  label="Apartment / Flat"
                  value="42%"
                  width="42%"
                />

                <DemandBar
                  label="Residential Plot"
                  value="23%"
                  width="23%"
                />

                <DemandBar
                  label="Villa / Kothi"
                  value="18%"
                  width="18%"
                />

                <DemandBar
                  label="Commercial"
                  value="11%"
                  width="11%"
                />

                <DemandBar
                  label="Other"
                  value="6%"
                  width="6%"
                />

              </div>

            </section>

          </div>

          {/* =================================================
              RECENT ACTIVITY
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-6 overflow-hidden">

            <div className="p-4 sm:p-5 border-b border-slate-100">

              <h2 className="font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="text-[10px] text-slate-400 mt-1">
                Latest actions from your team
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              <ActivityItem
                icon={Sparkles}
                title="AI analyzed a new lead"
                description="Rahul Sharma • Lead Score 87"
                time="10 minutes ago"
              />

              <ActivityItem
                icon={Phone}
                title="Lead contacted"
                description="Priya Singh • 4 BHK Villa"
                time="32 minutes ago"
              />

              <ActivityItem
                icon={CalendarCheck}
                title="Site visit scheduled"
                description="Neha Gupta • Medical Road"
                time="2 hours ago"
              />

              <ActivityItem
                icon={MessageCircle}
                title="WhatsApp message sent"
                description="Amit Verma • 2 BHK Apartment"
                time="3 hours ago"
              />

            </div>

          </section>

        </div>

      </main>

      {/* =================================================
          LEAD DETAIL MODAL
      ================================================= */}

      {selectedLead && (

        <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">

          <div className="bg-white w-full max-w-5xl max-h-[96vh] sm:max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">

            {/* MODAL HEADER */}

            <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold shrink-0">
                  {selectedLead.initials}
                </div>

                <div className="min-w-0">

                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900 truncate">
                    {selectedLead.name}
                  </h2>

                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                    Lead #{selectedLead.id} • Created {selectedLead.createdAt}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center shrink-0"
              >

                <X className="w-4 h-4" />

              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="overflow-y-auto p-4 sm:p-7">

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_350px] gap-5 sm:gap-6">

                {/* LEFT */}

                <div className="space-y-5 sm:space-y-6 min-w-0">

                  {/* CUSTOMER */}

                  <div>

                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                      Customer Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      <InfoBox
                        icon={Phone}
                        label="Phone"
                        value={selectedLead.phone}
                      />

                      <InfoBox
                        icon={Mail}
                        label="Email"
                        value={selectedLead.email}
                      />

                      <InfoBox
                        icon={MapPin}
                        label="Location"
                        value={`${selectedLead.locality}, ${selectedLead.city}`}
                      />

                      <InfoBox
                        icon={MessageCircle}
                        label="Preferred Contact"
                        value={selectedLead.contactPreference}
                      />

                    </div>

                  </div>

                  {/* REQUIREMENT */}

                  <div>

                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                      Property Requirement
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                      <InfoBox
                        icon={Home}
                        label="Property"
                        value={selectedLead.propertyType}
                      />

                      <InfoBox
                        icon={BedDouble}
                        label="Configuration"
                        value={selectedLead.bhk}
                      />

                      <InfoBox
                        icon={IndianRupee}
                        label="Budget"
                        value={selectedLead.budget}
                      />

                      <InfoBox
                        icon={Ruler}
                        label="Size"
                        value={selectedLead.propertySize}
                      />

                      <InfoBox
                        icon={CalendarDays}
                        label="Possession"
                        value={selectedLead.possession}
                      />

                      <InfoBox
                        icon={Eye}
                        label="Site Visit"
                        value={selectedLead.siteVisit}
                      />

                    </div>

                  </div>

                  {/* AI SUMMARY */}

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">

                    <div className="flex items-center gap-2 mb-3">

                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">

                        <Sparkles className="w-4 h-4" />

                      </div>

                      <div>

                        <h3 className="text-sm font-bold text-slate-900">
                          AI Lead Analysis
                        </h3>

                        <p className="text-[10px] text-slate-400">
                          Generated by AI Agent
                        </p>

                      </div>

                    </div>

                    <p className="text-xs leading-6 text-slate-600">
                      {selectedLead.summary}
                    </p>

                  </div>

                  {/* NEEDS */}

                  <div>

                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                      AI Detected Requirements
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {selectedLead.needs.map((need) => (

                        <span
                          key={need}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold"
                        >
                          {need}
                        </span>

                      ))}

                    </div>

                  </div>

                  {/* QUESTIONS */}

                  <div>

                    <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                      AI Suggested Questions
                    </h3>

                    <div className="space-y-2">

                      {selectedLead.questions.map((question, index) => (

                        <div
                          key={question}
                          className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl"
                        >

                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {index + 1}
                          </span>

                          <p className="text-xs text-slate-600">
                            {question}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="space-y-4">

                  {/* SCORE */}

                  <div className="bg-[#0b1730] text-white rounded-2xl p-5">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          AI Lead Score
                        </p>

                        <div className="flex items-end gap-2 mt-2">

                          <span className="text-4xl font-extrabold">
                            {selectedLead.score}
                          </span>

                          <span className="text-sm text-slate-400 mb-1">
                            / 100
                          </span>

                        </div>

                      </div>

                      <div className="w-14 h-14 rounded-full border-4 border-red-400/30 flex items-center justify-center shrink-0">

                        <Flame className="w-6 h-6 text-red-400" />

                      </div>

                    </div>

                    <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-red-400 rounded-full"
                        style={{
                          width: `${selectedLead.score}%`,
                        }}
                      />

                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4">

                      <span className="px-2.5 py-1 bg-red-500/15 text-red-300 rounded-lg text-[9px] font-bold">
                        {selectedLead.priority} LEAD
                      </span>

                      <span className="text-[9px] text-slate-400">
                        {selectedLead.intent}
                      </span>

                    </div>

                  </div>

                  {/* ACTION */}

                  <div className="border border-amber-200 bg-amber-50 rounded-2xl p-5">

                    <div className="flex items-center gap-2 mb-3">

                      <CircleAlert className="w-4 h-4 text-amber-600" />

                      <h3 className="text-xs font-bold text-amber-900">
                        Recommended Action
                      </h3>

                    </div>

                    <p className="text-xs leading-5 text-amber-800">
                      {selectedLead.action}
                    </p>

                  </div>

                  {/* QUICK ACTIONS */}

                  <div className="bg-white border border-slate-200 rounded-2xl p-4">

                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">
                      Quick Actions
                    </p>

                    <div className="grid grid-cols-2 gap-2">

                      <button className="py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-blue-700">
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </button>

                      <button className="py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600">
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </button>

                      <button className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200">
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </button>

                      <button className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        Site Visit
                      </button>

                    </div>

                  </div>

                  {/* RECOMMENDED */}

                  <div className="border border-slate-200 rounded-2xl p-4">

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h3 className="text-xs font-bold">
                          AI Recommended
                        </h3>

                        <p className="text-[9px] text-slate-400 mt-1">
                          Matching properties
                        </p>

                      </div>

                      <Sparkles className="w-4 h-4 text-blue-500" />

                    </div>

                    <div className="space-y-3">

                      {recommendedProperties.map((property) => (

                        <div
                          key={property.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >

                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <p className="text-[10px] font-bold text-slate-800">
                                {property.title}
                              </p>

                              <p className="text-[9px] text-slate-400 mt-1">
                                {property.location}
                              </p>

                            </div>

                            <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md shrink-0">
                              {property.match}%
                            </span>

                          </div>

                          <div className="flex items-center justify-between mt-3">

                            <span className="text-[10px] font-bold text-slate-700">
                              {property.price}
                            </span>

                            <span className="text-[9px] text-slate-400">
                              {property.size}
                            </span>

                          </div>

                          <button className="w-full mt-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-blue-600 hover:bg-blue-50">
                            View Property
                          </button>

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="px-4 sm:px-7 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <span className="text-[10px] text-slate-400">
                  Current Status:
                </span>

                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[9px] font-bold">
                  {selectedLead.status}
                </span>

              </div>

              <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2">

                <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-bold whitespace-nowrap">
                  Change Status
                </button>

                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 whitespace-nowrap">

                  <Send className="w-3 h-3" />

                  Send Properties

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================================
   DEMAND BAR
========================================================= */

function DemandBar({ label, value, width }) {
  return (
    <div>

      <div className="flex items-center justify-between mb-1.5">

        <span className="text-[10px] font-semibold text-slate-600">
          {label}
        </span>

        <span className="text-[10px] font-bold text-slate-800">
          {value}
        </span>

      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   DEMAND STAT
========================================================= */

function DemandStat({
  label,
  value,
  color,
  width,
}) {
  const colorClasses = {
    red: {
      text: "text-red-600",
      bg: "bg-red-500",
    },
    amber: {
      text: "text-amber-600",
      bg: "bg-amber-400",
    },
    emerald: {
      text: "text-emerald-600",
      bg: "bg-emerald-500",
    },
  };

  const selected = colorClasses[color];

  return (
    <div>

      <div className="flex items-center justify-between">

        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className={`text-sm font-extrabold ${selected.text}`}>
          {value}
        </span>

      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">

        <div
          className={`h-full ${selected.bg} rounded-full`}
          style={{ width }}
        />

      </div>

    </div>
  );
}

/* =========================================================
   ACTIVITY ITEM
========================================================= */

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
}) {
  return (
    <div className="px-4 sm:px-5 py-4 flex items-start sm:items-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

        <Icon className="w-4 h-4" />

      </div>

      <div className="flex-1 min-w-0">

        <p className="text-xs font-bold text-slate-700 truncate">
          {title}
        </p>

        <p className="text-[10px] text-slate-400 mt-1 truncate">
          {description}
        </p>

      </div>

      <span className="text-[9px] text-slate-400 whitespace-nowrap">
        {time}
      </span>

    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl min-w-0">

      <div className="flex items-center gap-2 mb-1.5">

        <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 truncate">
          {label}
        </span>

      </div>

      <p className="text-xs font-semibold text-slate-700 break-words">
        {value}
      </p>

    </div>
  );
}

