
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    Building2,
    MapPin,
    BedDouble,
    Bath,
    Maximize2,
    Eye,
    Pencil,
    Trash2,
    RefreshCw,
    Loader2,
    AlertCircle,
    X,
    Home,
    IndianRupee,
    CalendarDays,
    Tag,
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
    if (!date) return "Recently added";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Recently added";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
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
        console.log('property', property._id)

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
            <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-10 w-64 animate-pulse rounded-xl bg-blue-100" />
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
                            />
                        ))}
                    </div>
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
                        />
                    ))}
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-5 text-slate-900">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <AlertCircle size={30} />
                    </div>

                    <h2 className="text-xl font-bold">
                        Properties could not load
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error?.data?.message ||
                            "Please check your connection and API."}
                    </p>

                    <button
                        onClick={() => refetch()}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-3 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* PAGE HEADER */}
                <header className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold tracking-wide text-blue-700">
                            <Building2 size={15} />
                            DREAMHOME / ADMIN
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                            Property Management
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Manage, monitor and organize all your property listings
                            from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={isFetching ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                        <Link
                            href="/admin/properties"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Property
                        </Link>
                    </div>
                </header>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        icon={<Building2 size={21} />}
                        label="Properties on this page"
                        value={properties.length}
                        color="blue"
                    />

                    <SummaryCard
                        icon={<Home size={21} />}
                        label="Properties for sale"
                        value={properties.filter(
                            (property) =>
                                (property.listingType || "sale").toLowerCase() ===
                                "sale"
                        ).length}
                        color="indigo"
                    />

                    <SummaryCard
                        icon={<CalendarDays size={21} />}
                        label="Properties for rent"
                        value={properties.filter(
                            (property) =>
                                (property.listingType || "").toLowerCase() === "rent"
                        ).length}
                        color="sky"
                    />
                </div>

                {/* SEARCH AND FILTERS */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search by title, city, state or property type..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                            />

                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {[
                                { id: "all", label: "All Listings" },
                                { id: "sale", label: "For Sale" },
                                { id: "rent", label: "For Rent" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setFilter(tab.id);
                                        setPage(1);
                                    }}
                                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${filter === tab.id
                                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                        <p className="text-slate-500">
                            Showing{" "}
                            <strong className="font-bold text-slate-900">
                                {filteredProperties.length}
                            </strong>{" "}
                            properties on this page
                        </p>

                        {isFetching && (
                            <span className="inline-flex items-center gap-2 font-medium text-blue-600">
                                <Loader2 size={15} className="animate-spin" />
                                Updating listings...
                            </span>
                        )}
                    </div>
                </section>

                {/* PROPERTY LIST */}
                {filteredProperties.length === 0 ? (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Building2 size={32} />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            No properties found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Try another search, change the filter, or add a new
                            property listing.
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Clear search
                                </button>
                            )}

                            <Link
                                href="/admin/properties"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Add Property
                            </Link>
                        </div>
                    </section>
                ) : (
                    <div className="space-y-4">
                        {filteredProperties.map((property) => {
                            const isRent =
                                (property.listingType || "sale").toLowerCase() ===
                                "rent";

                            const image =
                                property.coverImage ||
                                property.images?.[0] ||
                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80";

                            return (
                                <article
                                    key={property._id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5"
                                >
                                    <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center">
                                        {/* PROPERTY IMAGE */}
                                        <div className="relative h-52 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-60 lg:h-40 lg:w-56">
                                            <img
                                                src={image}
                                                alt={property.title || "Property"}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <span
                                                className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ${isRent
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-emerald-600 text-white"
                                                    }`}
                                            >
                                                <Tag size={12} />
                                                {isRent ? "For Rent" : "For Sale"}
                                            </span>
                                        </div>

                                        {/* PROPERTY DETAILS */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                                    ID: {String(property._id).slice(-7)}
                                                </span>

                                                {property.propertyType && (
                                                    <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                                        {property.propertyType}
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="mt-3 line-clamp-2 text-lg font-extrabold text-slate-900 sm:text-xl">
                                                {property.title || "Untitled Property"}
                                            </h2>

                                            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                                <MapPin
                                                    size={15}
                                                    className="shrink-0 text-blue-600"
                                                />
                                                <span className="truncate">
                                                    {property.location?.city || "City not specified"}
                                                    {property.location?.state
                                                        ? `, ${property.location.state}`
                                                        : ""}
                                                </span>
                                            </p>

                                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-slate-600">
                                                {property.bedrooms !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <BedDouble size={16} className="text-blue-600" />
                                                        {property.bedrooms} Beds
                                                    </span>
                                                )}

                                                {property.bathrooms !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Bath size={16} className="text-blue-600" />
                                                        {property.bathrooms} Baths
                                                    </span>
                                                )}

                                                {property.area && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Maximize2 size={15} className="text-blue-600" />
                                                        {typeof property.area === "number"
                                                            ? `${property.area.toLocaleString("en-IN")} Sq.Ft.`
                                                            : property.area}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                                                <CalendarDays size={14} className="text-blue-500" />
                                                Added {formatDate(property.createdAt)}
                                            </div>
                                        </div>

                                        {/* PRICE AND ACTIONS */}
                                        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 lg:w-56 lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                                            <div className="rounded-xl bg-blue-50/70 p-3">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                    Listing Price
                                                </p>

                                                <p className="mt-1 break-words text-lg font-extrabold leading-7 text-blue-700">
                                                    {formatPrice(
                                                        property.price,
                                                        property.listingType
                                                    )}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <Link
                                                    href={`/properties/${property._id}`}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </Link>

                                                <Link
                                                    href={`/admin/properties?id=${property._id}`}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isDeleting && deletingId === property._id
                                                    }
                                                    onClick={() => handleDelete(property)}
                                                    className="col-span-2 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isDeleting && deletingId === property._id ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}

                                                    {isDeleting && deletingId === property._id
                                                        ? "Deleting..."
                                                        : "Delete Property"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* PAGINATION */}
                <footer className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-sm text-slate-500">
                        Page{" "}
                        <strong className="text-slate-900">{page}</strong>
                        {pagination?.totalPages
                            ? ` of ${pagination.totalPages}`
                            : ""}
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1 || isFetching}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <button
                            disabled={
                                isFetching ||
                                (pagination?.hasMore !== undefined
                                    ? !pagination.hasMore
                                    : properties.length === 0)
                            }
                            onClick={() => setPage((current) => current + 1)}
                            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next Page
                        </button>
                    </div>
                </footer>
            </div>
        </main>
    );
}

function SummaryCard({ icon, label, value, color }) {
    const colors = {
        blue: {
            icon: "border-blue-100 bg-blue-50 text-blue-600",
            number: "text-blue-700",
        },
        indigo: {
            icon: "border-indigo-100 bg-indigo-50 text-indigo-600",
            number: "text-indigo-700",
        },
        sky: {
            icon: "border-sky-100 bg-sky-50 text-sky-600",
            number: "text-sky-700",
        },
    };

    const theme = colors[color] || colors.blue;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{label}</p>

                <span className={`rounded-xl border p-2.5 ${theme.icon}`}>
                    {icon}
                </span>
            </div>

            <p className={`mt-4 text-3xl font-extrabold ${theme.number}`}>
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-400">
                Current page overview
            </p>
        </div>
    );
}

