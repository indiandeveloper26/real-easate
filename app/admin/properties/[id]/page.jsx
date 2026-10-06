"use client";

import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Bath,
    BedDouble,
    Building2,
    Check,
    ChevronDown,
    ImagePlus,
    MapPin,
    ParkingSquare,
    ShieldCheck,
    Sparkles,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const propertyTypes = [
    "Apartment",
    "Independent House",
    "Villa",
    "Plot",
    "Office",
    "Shop",
    "Warehouse",
    "PG",
];

const furnishingOptions = [
    "Unfurnished",
    "Semi Furnished",
    "Fully Furnished",
];

const initialForm = {
    listingType: "sale",
    propertyType: "Apartment",
    title: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "Unfurnished",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    parking: false,
    lift: false,
    security: false,
    balcony: false,
    powerBackup: false,
    waterSupply: false,
};

const amenitiesList = [
    { key: "parking", label: "Parking", icon: ParkingSquare },
    { key: "lift", label: "Lift", icon: Building2 },
    { key: "security", label: "24/7 Security", icon: ShieldCheck },
    { key: "balcony", label: "Balcony", icon: Building2 },
    { key: "powerBackup", label: "Power Backup", icon: Sparkles },
    { key: "waterSupply", label: "24/7 Water Supply", icon: Sparkles },
];

export default function ListPropertyPage() {
    const [form, setForm] = useState(initialForm);

    // Existing Cloudinary image URLs from the database.
    const [existingImages, setExistingImages] = useState([]);

    // Newly selected files and their local previews.
    const [newImages, setNewImages] = useState([]);

    const [propertyId, setPropertyId] = useState("");
    const [loadingProperty, setLoadingProperty] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isEditMode = Boolean(propertyId);

    let params = useParams()

    // Read ?id=PROPERTY_ID and load property details.
    useEffect(() => {

        const { id } = params


        console.log('idid ', id)

        if (!id) return;

        setPropertyId(id);

        const fetchProperty = async () => {
            setLoadingProperty(true);

            try {
                const response = await fetch(
                    `/backend/api/admin/properties/${encodeURIComponent(id)}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message || data?.error || "Failed to load property"
                    );
                }

                // Supports common response shapes:
                // { property: {...} }, { data: {...} }, or direct property object.
                const property = data?.property ?? data?.data ?? data;

                if (!property || typeof property !== "object") {
                    throw new Error("Property data was not found");
                }

                const location = property.location || {};
                const amenities = property.amenities || {};

                setForm({
                    listingType: property.listingType || "sale",
                    propertyType: property.propertyType || "Apartment",
                    title: property.title || "",
                    price:
                        property.price !== undefined && property.price !== null
                            ? String(property.price)
                            : "",
                    bedrooms:
                        property.bedrooms !== undefined && property.bedrooms !== null
                            ? String(property.bedrooms)
                            : "",
                    bathrooms:
                        property.bathrooms !== undefined && property.bathrooms !== null
                            ? String(property.bathrooms)
                            : "",
                    area:
                        property.area !== undefined && property.area !== null
                            ? String(property.area)
                            : "",
                    furnishing: property.furnishing || "Unfurnished",
                    address: location.address || property.address || "",
                    city: location.city || property.city || "",
                    state: location.state || property.state || "",
                    pincode: location.pincode || property.pincode || "",
                    description: property.description || "",
                    parking: Boolean(amenities.parking),
                    lift: Boolean(amenities.lift),
                    security: Boolean(amenities.security),
                    balcony: Boolean(amenities.balcony),
                    powerBackup: Boolean(amenities.powerBackup),
                    waterSupply: Boolean(amenities.waterSupply),
                });

                const propertyImages = Array.isArray(property.images)
                    ? property.images
                    : [];

                // Handle either ["url"] or [{ url: "..." }] image formats.
                const imageUrls = propertyImages
                    .map((image) =>
                        typeof image === "string" ? image : image?.url
                    )
                    .filter(Boolean);

                // Include coverImage if it is not already in images.
                const coverImage =
                    typeof property.coverImage === "string"
                        ? property.coverImage
                        : property.coverImage?.url;

                if (coverImage && !imageUrls.includes(coverImage)) {
                    imageUrls.unshift(coverImage);
                }

                setExistingImages(imageUrls.slice(0, 10));

                toast.success("Property details loaded");
            } catch (error) {
                console.error("Fetch property error:", error);
                toast.error(error.message || "Unable to load property");
            } finally {
                setLoadingProperty(false);
            }
        };

        fetchProperty();
    }, []);

    const updateField = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleImages = (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (!files.length) return;

        const remainingSlots = 10 - existingImages.length - newImages.length;

        if (remainingSlots <= 0) {
            toast.error("Maximum 10 property photos allowed");
            return;
        }

        const selectedFiles = files.slice(0, remainingSlots);

        if (selectedFiles.length < files.length) {
            toast.error("Only 10 property photos are allowed");
        }

        const validFiles = selectedFiles.filter((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image`);
                return false;
            }

            return true;
        });

        const preparedFiles = validFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setNewImages((previous) => [...previous, ...preparedFiles]);
    };

    const removeImage = (type, index) => {
        if (type === "existing") {
            setExistingImages((previous) =>
                previous.filter((_, imageIndex) => imageIndex !== index)
            );
            return;
        }

        setNewImages((previous) => {
            const imageToRemove = previous[index];

            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview);
            }

            return previous.filter((_, imageIndex) => imageIndex !== index);
        });
    };

    const uploadNewImages = async () => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (newImages.length && (!cloudName || !uploadPreset)) {
            throw new Error("Cloudinary environment variables are missing");
        }

        const uploadedUrls = [];

        for (const item of newImages) {
            const imageData = new FormData();

            imageData.append("file", item.file);
            imageData.append("upload_preset", uploadPreset);

            const cloudinaryUrl =
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            const uploadResponse = await fetch(cloudinaryUrl, {
                method: "POST",
                body: imageData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok || !uploadData.secure_url) {
                throw new Error(
                    uploadData?.error?.message || "Image upload failed"
                );
            }

            uploadedUrls.push(uploadData.secure_url);
        }

        return uploadedUrls;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.title.trim()) {
            toast.error("Please enter property title");
            return;
        }

        if (!form.price.trim()) {
            toast.error("Please enter property price");
            return;
        }

        const numericPrice = Number(form.price.replace(/,/g, ""));

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            toast.error("Please enter a valid property price");
            return;
        }

        if (!form.city.trim()) {
            toast.error("Please enter city");
            return;
        }

        // Existing images count too; an edit does not require selecting
        // new files when the property already has photos.
        if (existingImages.length + newImages.length === 0) {
            toast.error("Please upload at least one property image");
            return;
        }

        setSubmitting(true);

        try {
            // Upload only newly selected files. Keep existing URLs as they are.
            const uploadedImageUrls = await uploadNewImages();
            const finalImageUrls = [...existingImages, ...uploadedImageUrls];

            const payload = {
                listingType: form.listingType,
                propertyType: form.propertyType,
                title: form.title.trim(),
                price: numericPrice,
                bedrooms: Number(form.bedrooms || 0),
                bathrooms: Number(form.bathrooms || 0),
                area: Number(form.area || 0),
                furnishing: form.furnishing,

                location: {
                    address: form.address.trim(),
                    city: form.city.trim(),
                    state: form.state.trim(),
                    pincode: form.pincode.trim(),
                },

                images: finalImageUrls,
                coverImage: finalImageUrls[0] || "",

                amenities: {
                    parking: Boolean(form.parking),
                    lift: Boolean(form.lift),
                    security: Boolean(form.security),
                    balcony: Boolean(form.balcony),
                    powerBackup: Boolean(form.powerBackup),
                    waterSupply: Boolean(form.waterSupply),
                },

                description: form.description.trim(),
            };

            const url = isEditMode
                ? `/backend/api/admin/properties/${encodeURIComponent(propertyId)}`
                : "/backend/api/admin/properties";

            const response = await fetch(url, {
                method: isEditMode ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            console.log("PROPERTY API STATUS:", response.status);
            console.log("PROPERTY API RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    (isEditMode
                        ? "Property update failed"
                        : "Property publish failed")
                );
            }

            toast.success(
                isEditMode
                    ? "Property updated successfully!"
                    : "Property published successfully!"
            );



            // Keep the updated property in edit mode.
            // Existing URLs are now the saved image list; new files are cleared.
            setExistingImages(finalImageUrls);

            setNewImages((previous) => {
                previous.forEach((item) => URL.revokeObjectURL(item.preview));
                return [];
            });
        } catch (error) {
            console.error("Save property error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const allImages = [
        ...existingImages.map((url, index) => ({
            key: `existing-${index}-${url}`,
            url,
            type: "existing",
            index,
        })),
        ...newImages.map((item, index) => ({
            key: `new-${index}-${item.preview}`,
            url: item.preview,
            type: "new",
            index,
        })),
    ];

    return (
        <main className="min-h-screen bg-[#f7faff] text-slate-900">
            {/* HEADER */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div>
                            <h1 className="text-base font-bold text-slate-900">
                                {isEditMode ? "Update Property" : "List Your Property"}
                            </h1>
                            <p className="text-xs text-slate-500">
                                {isEditMode
                                    ? "Update your property details"
                                    : "Find the right buyer or tenant"}
                            </p>
                        </div>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                        <ShieldCheck size={17} className="text-blue-600" />
                        <span className="text-sm font-medium text-slate-600">
                            Your information is secure
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                {/* INTRO */}
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        <Sparkles size={14} />
                        {isEditMode ? "Edit property listing" : "List your property"}
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        {isEditMode
                            ? "Update your property details"
                            : "Tell us about your property"}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Add accurate property details and high-quality photos to attract
                        genuine buyers and tenants.
                    </p>
                </div>

                {loadingProperty ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        <p className="font-semibold">Loading property details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-7 lg:grid-cols-[1fr_330px]">
                            {/* LEFT */}
                            <div className="space-y-7">
                                {/* SALE / RENT */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5">
                                        <h3 className="text-lg font-bold">What are you listing?</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Choose whether the property is for sale or rent.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {[
                                            {
                                                value: "sale",
                                                title: "Sell Property",
                                                description: "Find a buyer",
                                            },
                                            {
                                                value: "rent",
                                                title: "Rent Property",
                                                description: "Find a tenant",
                                            },
                                        ].map((item) => (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => updateField("listingType", item.value)}
                                                className={`rounded-xl border p-4 text-left transition ${form.listingType === item.value
                                                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                                                    : "border-slate-200 hover:border-blue-300"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold">{item.title}</p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    {form.listingType === item.value && (
                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                                                            <Check size={14} />
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* PROPERTY DETAILS */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">Property details</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Give buyers the basic information about your property.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-semibold">
                                                Property title
                                            </label>
                                            <input
                                                required
                                                value={form.title}
                                                onChange={(e) => updateField("title", e.target.value)}
                                                placeholder="Example: Modern 3 BHK Apartment"
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Property type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={form.propertyType}
                                                    onChange={(e) =>
                                                        updateField("propertyType", e.target.value)
                                                    }
                                                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                                >
                                                    {propertyTypes.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown
                                                    size={18}
                                                    className="pointer-events-none absolute right-4 top-3.5 text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                {form.listingType === "sale"
                                                    ? "Expected price"
                                                    : "Monthly rent"}
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3 text-sm font-semibold text-slate-500">
                                                    ₹
                                                </span>
                                                <input
                                                    required
                                                    value={form.price}
                                                    onChange={(e) =>
                                                        updateField("price", e.target.value)
                                                    }
                                                    placeholder="4500000"
                                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Bedrooms
                                            </label>
                                            <div className="relative">
                                                <BedDouble
                                                    size={18}
                                                    className="absolute left-4 top-3.5 text-slate-400"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.bedrooms}
                                                    onChange={(e) =>
                                                        updateField("bedrooms", e.target.value)
                                                    }
                                                    placeholder="3"
                                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Bathrooms
                                            </label>
                                            <div className="relative">
                                                <Bath
                                                    size={18}
                                                    className="absolute left-4 top-3.5 text-slate-400"
                                                />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={form.bathrooms}
                                                    onChange={(e) =>
                                                        updateField("bathrooms", e.target.value)
                                                    }
                                                    placeholder="2"
                                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Built-up area (sq.ft)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={form.area}
                                                onChange={(e) => updateField("area", e.target.value)}
                                                placeholder="1450"
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Furnishing
                                            </label>
                                            <select
                                                value={form.furnishing}
                                                onChange={(e) =>
                                                    updateField("furnishing", e.target.value)
                                                }
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            >
                                                {furnishingOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* LOCATION */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6 flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <MapPin size={19} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Property location</h3>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Where is your property located?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-semibold">
                                                Full address
                                            </label>
                                            <textarea
                                                value={form.address}
                                                onChange={(e) =>
                                                    updateField("address", e.target.value)
                                                }
                                                rows={3}
                                                placeholder="House no, street, locality..."
                                                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                City
                                            </label>
                                            <input
                                                required
                                                value={form.city}
                                                onChange={(e) => updateField("city", e.target.value)}
                                                placeholder="Gorakhpur"
                                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                State
                                            </label>
                                            <input
                                                value={form.state}
                                                onChange={(e) => updateField("state", e.target.value)}
                                                placeholder="Uttar Pradesh"
                                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold">
                                                Pincode
                                            </label>
                                            <input
                                                value={form.pincode}
                                                onChange={(e) =>
                                                    updateField(
                                                        "pincode",
                                                        e.target.value.replace(/\D/g, "").slice(0, 6)
                                                    )
                                                }
                                                placeholder="273001"
                                                maxLength={6}
                                                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* IMAGES */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">Property photos</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Add up to 10 high-quality photos.
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {allImages.length}/10 photos selected
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {allImages.map((image, index) => (
                                            <div
                                                key={image.key}
                                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`Property ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />

                                                {index === 0 && (
                                                    <span className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                                                        COVER
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(image.type, image.index)}
                                                    aria-label="Remove image"
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        ))}

                                        {allImages.length < 10 && (
                                            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50">
                                                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                                                    <ImagePlus size={20} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-700">
                                                    Add photos
                                                </span>
                                                <span className="mt-1 text-[10px] text-slate-400">
                                                    JPG / PNG
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImages}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </section>

                                {/* AMENITIES */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold">Amenities</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Select everything available at the property.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {amenitiesList.map(({ key, label, icon: Icon }) => {
                                            const active = form[key];

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => updateField(key, !active)}
                                                    className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${active
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-slate-200 hover:border-blue-200"
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${active
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-slate-100 text-slate-500"
                                                            }`}
                                                    >
                                                        <Icon size={17} />
                                                    </div>
                                                    <span className="flex-1 text-sm font-semibold">
                                                        {label}
                                                    </span>
                                                    {active && (
                                                        <Check size={17} className="text-blue-600" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* DESCRIPTION */}
                                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5">
                                        <h3 className="text-lg font-bold">Property description</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Tell potential buyers or tenants what makes your property
                                            special.
                                        </p>
                                    </div>

                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField("description", e.target.value)
                                        }
                                        maxLength={2000}
                                        rows={7}
                                        placeholder="Describe the property, nearby facilities, connectivity, neighbourhood, etc..."
                                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    />

                                    <div className="mt-2 text-right text-xs text-slate-400">
                                        {form.description.length}/2000
                                    </div>
                                </section>

                                {/* MOBILE SUBMIT */}
                                <button
                                    type="submit"
                                    disabled={submitting || loadingProperty}
                                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
                                >
                                    {submitting ? (
                                        "Please wait..."
                                    ) : (
                                        <>
                                            {isEditMode ? "Update Property" : "Publish Property"}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* RIGHT PREVIEW */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-24 space-y-5">
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <div className="border-b border-slate-100 px-5 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                        Preview
                                                    </p>
                                                    <p className="mt-1 text-sm font-semibold">
                                                        Your listing
                                                    </p>
                                                </div>
                                                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                                    <Building2 size={17} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                                                {allImages[0]?.url ? (
                                                    <img
                                                        src={allImages[0].url}
                                                        alt="Property preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <ImagePlus
                                                            size={30}
                                                            className="mx-auto text-slate-300"
                                                        />
                                                        <p className="mt-2 text-xs text-slate-400">
                                                            Cover photo
                                                        </p>
                                                    </div>
                                                )}

                                                <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">
                                                    {form.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
                                                </span>
                                            </div>

                                            <div className="pt-4">
                                                <p className="text-xl font-bold text-slate-950">
                                                    {form.price
                                                        ? `₹${form.price}`
                                                        : "₹45,00,000"}
                                                </p>
                                                <h4 className="mt-1 line-clamp-1 font-bold">
                                                    {form.title || "Modern 3 BHK Apartment"}
                                                </h4>

                                                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                    <MapPin size={13} />
                                                    {form.city || "Your property location"}
                                                </div>

                                                <div className="mt-4 grid grid-cols-3 divide-x rounded-xl border border-slate-100 bg-slate-50 py-3">
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold">
                                                            {form.bedrooms || "3"}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-slate-400">
                                                            Beds
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold">
                                                            {form.bathrooms || "2"}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-slate-400">
                                                            Baths
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs font-bold">
                                                            {form.area || "1450"}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-slate-400">
                                                            Sq.ft
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                                        <div className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                                                <Sparkles size={17} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-blue-950">
                                                    Get more enquiries
                                                </h4>
                                                <p className="mt-1 text-xs leading-5 text-blue-800/70">
                                                    Add clear photos and a detailed description to make
                                                    your property stand out.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || loadingProperty}
                                        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting ? (
                                            "Please wait..."
                                        ) : (
                                            <>
                                                {isEditMode ? "Update Property" : "Publish Property"}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[11px] leading-5 text-slate-400">
                                        By publishing, you agree that the information provided is
                                        accurate and can be displayed publicly.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}