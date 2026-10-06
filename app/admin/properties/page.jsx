"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Building2,
    MapPin,
    Eye,
    Pencil,
    Trash2,
    RotateCw,
    Loader2,
    AlertCircle,
    Home,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import {
    useGetPropertiesQuery,
    useDeletePropertyMutation,
} from "../../../RTK/services/propertyApi";

function formatPrice(price, listingType) {
    const value = Number(price || 0);
    if (!value) return "Price on Request";

    const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);

    return listingType?.toLowerCase() === "rent"
        ? `${formatted} / month`
        : formatted;
}

function formatDate(date) {
    if (!date) return { date: "Recently added", time: "" };

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        return { date: "Recently added", time: "" };
    }

    return {
        date: parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
        time: parsedDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }),
    };
}

export default function AdminPropertyListingsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useGetPropertiesQuery(page);

    const [deleteProperty, { isLoading: isDeleting }] =
        useDeletePropertyMutation();

    const properties = data?.properties || [];
    const pagination = data?.pagination;



    console.log('data', properties)


    const filteredProperties = useMemo(() => {
        const query = search.trim().toLowerCase();

        return properties.filter((property) => {
            const listingType = (
                property.listingType || "sale"
            ).toLowerCase();

            const matchesFilter =
                filter === "all" || listingType === filter;

            const matchesSearch =
                !query ||
                (property.title || "").toLowerCase().includes(query) ||
                (property.propertyType || "").toLowerCase().includes(query) ||
                (property.location?.city || "").toLowerCase().includes(query) ||
                (property.location?.state || "").toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [properties, search, filter]);

    async function handleDelete(property) {
        console.log('property', property._id);

        const result = await Swal.fire({
            title: "Delete property?",
            text: `Are you sure you want to delete "${property.title || "this property"
                }"? This action may not be reversible.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#64748b",
            background: "#ffffff",
            color: "#172554",
        });

        if (!result.isConfirmed) return;

        try {
            setDeletingId(property._id);
            await deleteProperty(property._id).unwrap();

            await Swal.fire({
                title: "Deleted!",
                text: "Property deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: "#ffffff",
                color: "#172554",
            });

            await refetch();
        } catch (err) {
            Swal.fire({
                title: "Delete failed",
                text:
                    err?.data?.message ||
                    err?.message ||
                    "Property could not be deleted. Please check your API.",
                icon: "error",
                confirmButtonColor: "#2563eb",
                background: "#ffffff",
                color: "#172554",
            });
        } finally {
            setDeletingId(null);
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#f8fafc] p-6 text-slate-800">
                <div className="mx-auto max-w-[1400px] space-y-6">
                    <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-200" />
                    <div className="grid gap-4 sm:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-28 animate-pulse rounded-2xl bg-white border border-slate-100" />
                        ))}
                    </div>
                    <div className="h-96 animate-pulse rounded-2xl bg-white border border-slate-100" />
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc] p-5 text-slate-900">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertCircle size={30} />
                    </div>
                    <h2 className="text-xl font-bold">Properties could not load</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error?.data?.message || "Please check your connection and API."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <RotateCw size={16} />
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    const totalCount = properties.length;
    const activeCount = properties.filter((p) => (p.status || "active").toLowerCase() === "active").length;
    const pendingCount = properties.filter((p) => (p.status || "").toLowerCase() === "pending").length;
    const inactiveCount = properties.filter((p) => (p.status || "").toLowerCase() === "inactive").length;

    return (
        <main className="min-h-screen bg-[#f8fafd] p-4 sm:p-7 text-slate-800">
            <div className="mx-auto max-w-[1400px] space-y-6">

                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Property Listings
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Manage all properties listed on your platform
                        </p>
                    </div>

                    <Link
                        href="/admin/properties_List"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.99]"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        Add New Property
                    </Link>
                </div>

                {/* TOP 4 SUMMARY CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center justify-between rounded-2xl border border-blue-100/60 bg-gradient-to-r from-blue-50/60 to-white p-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Home size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Total Properties</p>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
                                    <span className="text-xs font-semibold text-emerald-600">↑ +12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-emerald-100/60 bg-gradient-to-r from-emerald-50/40 to-white p-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">✓</span>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Active</p>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-slate-900">{activeCount}</span>
                                    <span className="text-xs font-semibold text-emerald-600">↑ +8%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-amber-100/60 bg-gradient-to-r from-amber-50/40 to-white p-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Pending</p>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-slate-900">{pendingCount}</span>
                                    <span className="text-xs font-medium text-slate-400">↑ ~0%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-rose-100/60 bg-gradient-to-r from-rose-50/40 to-white p-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
                                <Trash2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Inactive</p>
                                <div className="mt-0.5 flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-slate-900">{inactiveCount}</span>
                                    <span className="text-xs font-semibold text-rose-500">↑ -33%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & SEARCH BAR */}
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
                    <div className="relative min-w-[260px] flex-1">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by title, location, or ID..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        aria-label="Filter by listing type"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-600 outline-none hover:border-slate-300"
                    >
                        <option value="all">All Types</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setFilter("all");
                            setPage(1);
                            refetch();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
                    >
                        <RotateCw size={14} className={isFetching ? "animate-spin text-blue-600" : "text-slate-500"} />
                        Reset
                    </button>
                </div>

                {/* PROPERTY LISTING TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] border-collapse text-left text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-[#fafbfe] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="w-10 py-3.5 pl-5 pr-2">
                                        <input type="checkbox" aria-label="Select all properties" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                                    </th>
                                    <th className="w-8 py-3.5 px-2 text-slate-400">#</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Property</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Type</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Location</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Price</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Status</th>
                                    <th className="py-3.5 px-4 font-semibold text-slate-600">Created At</th>
                                    <th className="py-3.5 px-4 text-center font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProperties.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-16 text-center">
                                            <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-base font-semibold text-slate-800">No properties found</p>
                                            <p className="text-xs text-slate-400 mt-1">Try changing your search term or filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProperties.map((property, index) => {
                                        const dateObj = formatDate(property.createdAt);
                                        const image =
                                            property.coverImage ||
                                            property.images?.[0] ||
                                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80";

                                        const status = (property.status || "active").toLowerCase();

                                        return (
                                            <tr key={property._id} className="transition-colors hover:bg-slate-50/70">
                                                <td className="py-3.5 pl-5 pr-2">
                                                    <input type="checkbox" aria-label={`Select ${property.title || "property"}`} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                                                </td>

                                                <td className="py-3.5 px-2 text-xs text-slate-400">
                                                    {index + 1}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={image}
                                                            alt={property.title || "Property"}
                                                            className="h-12 w-16 rounded-lg object-cover border border-slate-200 shadow-2xs"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900 line-clamp-1">
                                                                {property.title || "Untitled Property"}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400">
                                                                #PROP{String(property._id).slice(-4).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-start gap-2">
                                                        <Building2 size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {property.propertyType || "Apartment / Flat"}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400">
                                                                {property.bedrooms ? `${property.bedrooms} BHK • ` : ""}
                                                                {property.area ? `${property.area} Sq. Ft.` : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-start gap-1.5">
                                                        <MapPin size={15} className="mt-0.5 text-slate-400 shrink-0" />
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {property.location?.city || "Gomti Nagar"}
                                                            </p>
                                                            <p className="text-[11px] text-slate-400">
                                                                {property.location?.state || "Lucknow"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                                    {formatPrice(property.price, property.listingType)}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span
                                                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${status === "active"
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                : status === "pending"
                                                                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                                                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                                            }`}
                                                    >
                                                        {status}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-xs">
                                                    <p className="text-slate-700 font-medium">{dateObj.date}</p>
                                                    <p className="text-[11px] text-slate-400">{dateObj.time}</p>
                                                </td>

                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="inline-flex items-center justify-center gap-1.5">
                                                        <Link
                                                            href={`/properties/${property._id}`}
                                                            aria-label="View property details"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                                        >
                                                            <Eye size={15} />
                                                        </Link>

                                                        <Link
                                                            href={`/admin/properties/${property?._id}`}
                                                            aria-label="Edit property"
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                                                        >
                                                            <Pencil size={14} />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            aria-label="Delete property"
                                                            disabled={isDeleting && deletingId === property._id}
                                                            onClick={() => handleDelete(property)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                                                        >
                                                            {isDeleting && deletingId === property._id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={14} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* TABLE PAGINATION FOOTER */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-3.5 text-xs text-slate-500">
                        <p>
                            Showing{" "}
                            <span className="font-semibold text-slate-800">
                                {filteredProperties.length > 0 ? 1 : 0}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-slate-800">
                                {filteredProperties.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-800">
                                {pagination?.total || filteredProperties.length}
                            </span>{" "}
                            properties
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                aria-label="Previous page"
                                disabled={page <= 1 || isFetching}
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <button
                                aria-label="Page 1"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-semibold text-white shadow-2xs shadow-blue-500/30"
                            >
                                {page}
                            </button>

                            <button
                                aria-label="Next page"
                                disabled={
                                    isFetching ||
                                    (pagination?.hasMore !== undefined
                                        ? !pagination.hasMore
                                        : properties.length === 0)
                                }
                                onClick={() => setPage((current) => current + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}