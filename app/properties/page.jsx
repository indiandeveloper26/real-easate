
"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Building2,
  Eye,
  Heart,
  Loader2,
  RefreshCw,
  AlertCircle,
  Phone,
  MessageCircle,
  Search,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  Check,
} from "lucide-react";
import Link from "next/link";

import {
  useGetPropertiesQuery,
  useGetFilteredPropertiesQuery,
} from "../../RTK/services/propertyApi";

const PROPERTY_TYPES = [
  "Apartment",
  "Independent House",
  "Villa",
  "Plot",
  "Office",
  "Shop",
  "Warehouse",
  "PG",
];

const PRICE_RANGES = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under ₹20 Lakh", min: "0", max: "2000000" },
  { label: "₹20L – ₹50L", min: "2000000", max: "5000000" },
  { label: "₹50L – ₹1 Crore", min: "5000000", max: "10000000" },
  { label: "₹1 Crore – ₹2 Crore", min: "10000000", max: "20000000" },
  { label: "Above ₹2 Crore", min: "20000000", max: "" },
];

const INITIAL_FILTERS = {
  listingType: "all",
  propertyTypes: [],
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "any",
  sortBy: "newest",
  search: "",
};

function formatPrice(value, listingType) {
  const number = Number(value || 0);

  if (!number) return "Price on Request";

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);

  return listingType?.toLowerCase() === "rent"
    ? `${formatted} / mo`
    : formatted;
}

function formatTimeAgo(dateString) {
  if (!dateString) return "Recently listed";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Recently listed";

  const diffDays = Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;

  return `${Math.floor(diffDays / 30)}mo ago`;
}

function hasActiveFilters(filters) {
  return (
    filters.listingType !== "all" ||
    filters.propertyTypes.length > 0 ||
    Boolean(filters.city.trim()) ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.bedrooms !== "any" ||
    Boolean(filters.search.trim()) ||
    filters.sortBy !== "newest"
  );
}

export default function UserPropertyListingsPage() {
  const [page, setPage] = useState(1);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  const [filtersApplied, setFiltersApplied] = useState(false);
  const [shownProperties, setShownProperties] = useState([]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [openSections, setOpenSections] = useState({
    listing: true,
    propertyType: true,
    location: true,
    price: true,
    bedrooms: true,
  });

  const loaderRef = useRef(null);
  const lastRequestedPageRef = useRef(1);

  // API 1: Original properties API.
  // Filter mode active hone par ye API skip hogi.
  const normalQuery = useGetPropertiesQuery(page, {
    skip: filtersApplied,
  });

  // API 2: Filter apply hone par hi call hogi.
  const filteredQuery = useGetFilteredPropertiesQuery(
    {
      ...appliedFilters,
      page,
      limit: 10,
    },
    {
      skip: !filtersApplied,
    }
  );

  const activeQuery = filtersApplied ? filteredQuery : normalQuery;

  const {
    currentData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = activeQuery;

  const pagination = currentData?.pagination;
  const hasMore = pagination?.hasMore ?? false;

  // API response ko properties list mein update karo.
  useEffect(() => {
    if (!currentData || !Array.isArray(currentData.properties)) {
      return;
    }

    const incoming = currentData.properties;

    setShownProperties((previous) => {
      if (page === 1) {
        return incoming;
      }

      const existingIds = new Set(
        previous.map((property) => property._id)
      );

      const uniqueIncoming = incoming.filter(
        (property) => !existingIds.has(property._id)
      );

      return [...previous, ...uniqueIncoming];
    });
  }, [currentData, page]);

  // Filter input update.
  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // Property type checkbox toggle.
  const togglePropertyType = (type) => {
    setFilters((previous) => {
      const exists = previous.propertyTypes.includes(type);

      return {
        ...previous,
        propertyTypes: exists
          ? previous.propertyTypes.filter((item) => item !== type)
          : [...previous.propertyTypes, type],
      };
    });
  };

  // Section open/close.
  const toggleSection = (section) => {
    setOpenSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  // Apply button: active filters ke hisaab se API switch hogi.
  const applyFilters = () => {
    if (
      filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      window.alert(
        "Minimum price maximum price se zyada nahi ho sakta."
      );
      return;
    }

    const nextFilters = {
      ...filters,
      listingType: selectedFilter,
      search: searchQuery.trim(),
    };

    const shouldUseFilteredAPI = hasActiveFilters(nextFilters);

    lastRequestedPageRef.current = 1;

    setShownProperties([]);
    setPage(1);

    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setFiltersApplied(shouldUseFilteredAPI);

    setShowMobileFilters(false);
  };

  // Reset: original API par wapas.
  const resetFilters = () => {
    lastRequestedPageRef.current = 1;

    setShownProperties([]);
    setPage(1);

    setFilters({ ...INITIAL_FILTERS });
    setAppliedFilters({ ...INITIAL_FILTERS });

    setSelectedFilter("all");
    setSearchQuery("");

    setFiltersApplied(false);
    setShowMobileFilters(false);
  };

  // Listing type buttons.
  const changeListingType = (type) => {
    setSelectedFilter(type);

    setFilters((previous) => ({
      ...previous,
      listingType: type,
    }));
  };

  // Sort change draft mein update hota hai.
  // Apply click par filtered API call hogi.
  const changeSort = (sortBy) => {
    setFilters((previous) => ({
      ...previous,
      sortBy,
    }));
  };

  // Infinite scrolling.
  useEffect(() => {
    const loader = loaderRef.current;

    if (
      !loader ||
      !hasMore ||
      isFetching ||
      isLoading ||
      !currentData
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        if (lastRequestedPageRef.current >= page + 1) return;

        lastRequestedPageRef.current = page + 1;
        setPage((previous) => previous + 1);
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [hasMore, isFetching, isLoading, currentData, page]);

  const activeFilterCount =
    (appliedFilters.listingType !== "all" ? 1 : 0) +
    appliedFilters.propertyTypes.length +
    (appliedFilters.city ? 1 : 0) +
    (appliedFilters.minPrice !== "" ||
      appliedFilters.maxPrice !== ""
      ? 1
      : 0) +
    (appliedFilters.bedrooms !== "any" ? 1 : 0) +
    (appliedFilters.search ? 1 : 0) +
    (appliedFilters.sortBy !== "newest" ? 1 : 0);

  if (isLoading && shownProperties.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError && shownProperties.length === 0) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-white p-6">
        <div className="max-w-md rounded-3xl border border-slate-200 p-8 text-center">
          <AlertCircle
            className="mx-auto mb-4 text-red-500"
            size={32}
          />

          <h2 className="font-bold text-[#0a1931]">
            Properties load nahi ho saki
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error?.data?.message || "Please try again."}
          </p>

          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-[#0a1931] px-5 py-3 text-sm font-bold text-white"
          >
            <RefreshCw className="mr-2 inline" size={15} />
            Retry
          </button>

          <button
            onClick={resetFilters}
            className="mt-3 block w-full text-sm font-semibold text-blue-600"
          >
            Reset filters
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-50 to-transparent" />

      <div className="relative mx-auto max-w-[1400px] space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Sparkles size={14} />
              DreamHome Real Estate
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a1931] sm:text-4xl">
              Explore Properties
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Find your ideal home using our property filters.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Showing</span>
            <strong className="text-[#0a1931]">
              {pagination?.totalProperties ?? shownProperties.length}
            </strong>
            <span className="text-slate-500">properties</span>
          </div>
        </header>

        {/* Search and top controls */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <form
            className="relative flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              applyFilters();
            }}
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search city, address, property name..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </form>

          <button
            onClick={() => setShowMobileFilters(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0a1931] px-5 py-3.5 text-sm font-bold text-white lg:hidden"
          >
            <SlidersHorizontal size={17} />
            Filters

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#0a1931]">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 sm:flex">
            {[
              { id: "all", label: "All" },
              { id: "sale", label: "Buy" },
              { id: "rent", label: "Rent" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => changeListingType(item.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${selectedFilter === item.id
                    ? "bg-[#0a1931] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* Desktop sidebar: fixed height, independent scroll */}
          <aside className="sticky top-5 hidden h-[calc(100vh-40px)] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 [scrollbar-width:thin]">
              <FilterPanel
                filters={filters}
                updateFilter={updateFilter}
                togglePropertyType={togglePropertyType}
                openSections={openSections}
                toggleSection={toggleSection}
                onApply={applyFilters}
                onReset={resetFilters}
                selectedFilter={selectedFilter}
                setSelectedFilter={changeListingType}
              />
            </div>
          </aside>

          {/* Mobile drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                aria-label="Close filters"
                onClick={() => setShowMobileFilters(false)}
                className="absolute inset-0 bg-slate-950/50"
              />

              <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden bg-white shadow-2xl">
                {/* Fixed drawer header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-5">
                  <h2 className="text-lg font-extrabold text-[#0a1931]">
                    Filter Properties
                  </h2>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="rounded-lg border border-slate-200 p-2"
                    aria-label="Close filters"
                  >
                    <X size={19} />
                  </button>
                </div>

                {/* Scrollable mobile filter content */}
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 [scrollbar-width:thin]">
                  <FilterPanel
                    filters={filters}
                    updateFilter={updateFilter}
                    togglePropertyType={togglePropertyType}
                    openSections={openSections}
                    toggleSection={toggleSection}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    selectedFilter={selectedFilter}
                    setSelectedFilter={changeListingType}
                  />
                </div>
              </aside>
            </div>
          )}

          {/* Property results */}
          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#0a1931]">
                  Available Properties
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filtersApplied
                    ? "Showing results from your applied filters"
                    : "Browse available properties"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Sort by
                </span>

                <select
                  value={filters.sortBy}
                  onChange={(event) => changeSort(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                <button
                  onClick={applyFilters}
                  className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {appliedFilters.listingType !== "all" && (
                  <FilterChip
                    label={
                      appliedFilters.listingType === "sale"
                        ? "For Sale"
                        : "For Rent"
                    }
                    onRemove={() => {
                      const next = {
                        ...appliedFilters,
                        listingType: "all",
                      };

                      setSelectedFilter("all");
                      setFilters((previous) => ({
                        ...previous,
                        listingType: "all",
                      }));

                      setAppliedFilters(next);
                      setPage(1);
                      lastRequestedPageRef.current = 1;
                      setShownProperties([]);
                      setFiltersApplied(hasActiveFilters(next));
                    }}
                  />
                )}

                {appliedFilters.propertyTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    onRemove={() => {
                      const next = {
                        ...appliedFilters,
                        propertyTypes: appliedFilters.propertyTypes.filter(
                          (item) => item !== type
                        ),
                      };

                      setFilters((previous) => ({
                        ...previous,
                        propertyTypes: next.propertyTypes,
                      }));

                      setAppliedFilters(next);
                      setPage(1);
                      lastRequestedPageRef.current = 1;
                      setShownProperties([]);
                      setFiltersApplied(hasActiveFilters(next));
                    }}
                  />
                ))}

                {appliedFilters.city && (
                  <FilterChip
                    label={appliedFilters.city}
                    onRemove={() => {
                      const next = {
                        ...appliedFilters,
                        city: "",
                      };

                      setFilters((previous) => ({
                        ...previous,
                        city: "",
                      }));

                      setAppliedFilters(next);
                      setPage(1);
                      lastRequestedPageRef.current = 1;
                      setShownProperties([]);
                      setFiltersApplied(hasActiveFilters(next));
                    }}
                  />
                )}

                {(appliedFilters.minPrice !== "" ||
                  appliedFilters.maxPrice !== "") && (
                    <FilterChip
                      label={`${appliedFilters.minPrice || "0"} – ${appliedFilters.maxPrice || "No limit"
                        } ₹`}
                      onRemove={() => {
                        const next = {
                          ...appliedFilters,
                          minPrice: "",
                          maxPrice: "",
                        };

                        setFilters((previous) => ({
                          ...previous,
                          minPrice: "",
                          maxPrice: "",
                        }));

                        setAppliedFilters(next);
                        setPage(1);
                        lastRequestedPageRef.current = 1;
                        setShownProperties([]);
                        setFiltersApplied(hasActiveFilters(next));
                      }}
                    />
                  )}

                {appliedFilters.bedrooms !== "any" && (
                  <FilterChip
                    label={`${appliedFilters.bedrooms} BHK`}
                    onRemove={() => {
                      const next = {
                        ...appliedFilters,
                        bedrooms: "any",
                      };

                      setFilters((previous) => ({
                        ...previous,
                        bedrooms: "any",
                      }));

                      setAppliedFilters(next);
                      setPage(1);
                      lastRequestedPageRef.current = 1;
                      setShownProperties([]);
                      setFiltersApplied(hasActiveFilters(next));
                    }}
                  />
                )}

                {appliedFilters.search && (
                  <FilterChip
                    label={`Search: ${appliedFilters.search}`}
                    onRemove={() => {
                      const next = {
                        ...appliedFilters,
                        search: "",
                      };

                      setSearchQuery("");
                      setFilters((previous) => ({
                        ...previous,
                        search: "",
                      }));

                      setAppliedFilters(next);
                      setPage(1);
                      lastRequestedPageRef.current = 1;
                      setShownProperties([]);
                      setFiltersApplied(hasActiveFilters(next));
                    }}
                  />
                )}

                <button
                  onClick={resetFilters}
                  className="px-2 text-xs font-bold text-red-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {isFetching && (
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-blue-600">
                <Loader2 size={15} className="animate-spin" />
                {filtersApplied
                  ? "Applying filters..."
                  : "Loading properties..."}
              </div>
            )}

            {isError && shownProperties.length > 0 && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Could not load more results. Please try again.

                <button
                  onClick={() => refetch()}
                  className="ml-2 font-bold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {shownProperties.length === 0 && !isFetching ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Building2
                  size={35}
                  className="mx-auto mb-4 text-slate-300"
                />

                <h3 className="font-bold text-[#0a1931]">
                  No properties found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  Try another city, price range or property type.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-[#0a1931] px-5 py-3 text-sm font-bold text-white"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {shownProperties.map((property) => (
                  <UserPropertyCard
                    key={property._id}
                    property={property}
                  />
                ))}
              </div>
            )}

            <div
              ref={loaderRef}
              className="flex min-h-20 items-center justify-center py-6"
            >
              {isFetching && shownProperties.length > 0 && (
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-semibold shadow-sm">
                  <Loader2
                    size={16}
                    className="animate-spin text-blue-600"
                  />
                  Loading more properties...
                </div>
              )}

              {!isFetching &&
                !hasMore &&
                shownProperties.length > 0 && (
                  <p className="text-xs font-medium text-slate-400">
                    You have reached the end of the listings.
                  </p>
                )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FilterPanel({
  filters,
  updateFilter,
  togglePropertyType,
  openSections,
  toggleSection,
  onApply,
  onReset,
  selectedFilter,
  setSelectedFilter,
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-600" />
          <h2 className="font-extrabold text-[#0a1931]">Filters</h2>
        </div>

        <button
          onClick={onReset}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Reset all
        </button>
      </div>

      <FilterSection
        title="Looking to"
        open={openSections.listing}
        onToggle={() => toggleSection("listing")}
      >
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1">
          {[
            { value: "all", label: "All" },
            { value: "sale", label: "Buy" },
            { value: "rent", label: "Rent" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedFilter(item.value)}
              className={`rounded-lg px-2 py-2.5 text-xs font-bold ${selectedFilter === item.value
                  ? "bg-[#0a1931] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Property Type"
        open={openSections.propertyType}
        onToggle={() => toggleSection("propertyType")}
      >
        <div className="space-y-3">
          {PROPERTY_TYPES.map((type) => {
            const checked = filters.propertyTypes.includes(type);

            return (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${checked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white"
                    }`}
                >
                  {checked && <Check size={12} />}
                </span>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePropertyType(type)}
                  className="sr-only"
                />

                <span
                  className={
                    checked ? "font-semibold text-[#0a1931]" : ""
                  }
                >
                  {type}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        title="Location"
        open={openSections.location}
        onToggle={() => toggleSection("location")}
      >
        <label className="relative block">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={filters.city}
            onChange={(event) =>
              updateFilter("city", event.target.value)
            }
            placeholder="Enter city"
            className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />
        </label>

        <p className="mt-2 text-[11px] text-slate-400">
          Example: Delhi, Basti, Lucknow
        </p>
      </FilterSection>

      <FilterSection
        title="Price Range"
        open={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => {
            const selected =
              filters.minPrice === range.min &&
              filters.maxPrice === range.max;

            return (
              <button
                key={range.label}
                onClick={() => {
                  updateFilter("minPrice", range.min);
                  updateFilter("maxPrice", range.max);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs transition ${selected
                    ? "border-blue-300 bg-blue-50 font-bold text-blue-700"
                    : "border-slate-100 text-slate-600 hover:border-slate-300"
                  }`}
              >
                {range.label}
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) =>
              updateFilter("minPrice", event.target.value)
            }
            placeholder="Min ₹"
            className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-xs outline-none focus:border-blue-500"
          />

          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) =>
              updateFilter("maxPrice", event.target.value)
            }
            placeholder="Max ₹"
            className="min-w-0 w-full rounded-xl border border-slate-200 px-2.5 py-3 text-xs outline-none focus:border-blue-500"
          />
        </div>
      </FilterSection>

      <FilterSection
        title="Bedrooms"
        open={openSections.bedrooms}
        onToggle={() => toggleSection("bedrooms")}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {["any", "1", "2", "3", "4+", "5+"].map((bedroom) => (
            <button
              key={bedroom}
              onClick={() => updateFilter("bedrooms", bedroom)}
              className={`rounded-lg border px-2 py-2.5 text-xs font-bold ${filters.bedrooms === bedroom
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {bedroom === "any" ? "Any" : `${bedroom} BHK`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Sticky buttons at bottom of scroll area */}
      <div className="sticky bottom-0 z-10 mt-5 space-y-2 border-t border-slate-100 bg-white py-3">
        <button
          onClick={onApply}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <Search size={16} />
          Apply Filters
        </button>

        <button
          onClick={onReset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>
    </>
  );
}

function FilterSection({ title, open, onToggle, children }) {
  return (
    <div className="border-t border-slate-100 py-4">
      <button
        type="button"
        onClick={onToggle}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-extrabold text-[#0a1931]">
          {title}
        </span>

        <ChevronDown
          size={16}
          className={`text-slate-400 transition ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && <div>{children}</div>}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
    >
      {label}
      <X size={12} />
    </button>
  );
}

function UserPropertyCard({ property }) {
  const [isSaved, setIsSaved] = useState(false);

  const image =
    property.coverImage ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80";

  const isRent =
    (property.listingType || "sale").toLowerCase() === "rent";

  const contactPhone =
    property.contactPhone ||
    property.agentPhone ||
    "919876543210";

  const whatsappNumber = String(contactPhone).replace(/\D/g, "");

  const whatsappMessage = encodeURIComponent(
    `Namaste! I am interested in your property: "${property.title}" located in ${property.location?.city || "your city"
    }. Please share details.`
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={property.title || "Property"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold text-white shadow-sm ${isRent ? "bg-[#0a1931]/95" : "bg-blue-600/95"
              }`}
          >
            {isRent ? "For Rent" : "For Sale"}
          </span>

          {property.propertyType && (
            <span className="rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800">
              {property.propertyType}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsSaved((previous) => !previous)}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:text-rose-500"
        >
          <Heart
            size={16}
            className={isSaved ? "fill-rose-500 text-rose-500" : ""}
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <div className="rounded-xl border border-slate-100 bg-white/95 px-3 py-2 text-sm font-extrabold text-[#0a1931] shadow-sm">
            {formatPrice(property.price, property.listingType)}
          </div>

          <div className="rounded-lg bg-[#0a1931]/85 px-2.5 py-1.5 text-[10px] font-bold text-white">
            {formatTimeAgo(property.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
        <div>
          <Link
            href={`/properties/${property._id}`}
            className="flex items-start justify-between gap-2"
          >
            <h2 className="line-clamp-2 text-base font-extrabold text-[#0a1931] transition hover:text-blue-600">
              {property.title || "Dream Property"}
            </h2>

            <ArrowUpRight
              size={18}
              className="mt-0.5 shrink-0 text-slate-400"
            />
          </Link>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={14} className="shrink-0 text-blue-600" />

            <span className="truncate">
              {property.location?.city || "Location not specified"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-sm font-bold text-[#0a1931]">
              <BedDouble size={14} className="text-blue-600" />
              {property.bedrooms ?? "-"}
            </div>
            <span className="text-[10px] text-slate-500">Beds</span>
          </div>

          <div className="flex flex-col items-center gap-1 border-x border-slate-200">
            <div className="flex items-center gap-1 text-sm font-bold text-[#0a1931]">
              <Bath size={14} className="text-blue-600" />
              {property.bathrooms ?? "-"}
            </div>
            <span className="text-[10px] text-slate-500">Baths</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-sm font-bold text-[#0a1931]">
              <Maximize2 size={13} className="text-blue-600" />
              <span className="max-w-16 truncate">
                {property.area ?? "-"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Area</span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <a
            href={`tel:${contactPhone}`}
            aria-label="Call owner"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            <Phone size={15} />
          </a>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
          >
            <MessageCircle size={15} />
          </a>

          <Link
            href={`/properties/${property._id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0a1931] px-3 py-3 text-xs font-extrabold text-white transition hover:bg-blue-700"
          >
            <Eye size={15} />
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

