"use client";

import { useState } from "react";
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

export default function ListPropertyPage() {
  const [form, setForm] = useState({
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
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const newFiles = [...images, ...files].slice(0, 10);

    setImages(newFiles);

    const newPreviews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = images.filter(
      (_, i) => i !== index
    );

    const newPreviews = previews.filter(
      (_, i) => i !== index
    );

    setImages(newImages);
    setPreviews(newPreviews);
  };















  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter property title");
      return;
    }

    if (!form.price.trim()) {
      alert("Please enter property price");
      return;
    }

    if (!form.city.trim()) {
      alert("Please enter city");
      return;
    }

    if (!images.length) {
      alert("Please upload at least one property image");
      return;
    }

    setSubmitting(true);

    try {
      // =========================
      // 1. UPLOAD IMAGES
      // =========================

      const uploadedImageUrls = [];

      for (const image of images) {
        const imageData = new FormData();

        imageData.append("file", image);

        imageData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudinaryUrl =
          `https://api.cloudinary.com/v1_1/` +
          `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}` +
          `/image/upload`;

        console.log("Cloudinary URL:", cloudinaryUrl);

        const uploadResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: imageData,
        });

        const uploadData = await uploadResponse.json();

        console.log("CLOUDINARY RESPONSE:", uploadData);

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData?.error?.message || "Image upload failed"
          );
        }

        if (!uploadData.secure_url) {
          throw new Error("Cloudinary did not return image URL");
        }

        uploadedImageUrls.push(uploadData.secure_url);
      }

      // =========================
      // 2. PROPERTY PAYLOAD
      // =========================

      const payload = {
        listingType: form.listingType,
        propertyType: form.propertyType,

        title: form.title.trim(),

        price: Number(form.price.replace(/,/g, "")),

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

        images: uploadedImageUrls,

        coverImage: uploadedImageUrls[0],

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

      console.log("=================================");
      console.log("PROPERTY PAYLOAD:");
      console.log(payload);
      console.log("=================================");

      // =========================
      // 3. PUBLISH PROPERTY
      // =========================

      const response = await fetch(
        "/backend/api/admin/properties",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(payload),
        }
      );

      // IMPORTANT:
      // Backend ka actual response read karo

      const data = await response.json();

      console.log("=================================");
      console.log("PROPERTY API STATUS:", response.status);
      console.log("PROPERTY API RESPONSE:", data);
      console.log("=================================");

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          "Property publish failed"
        );
      }

      console.log("PROPERTY CREATED:", data);


      toast.success("Property published successfully!")


      // Optional: form reset
      // setForm({
      //   listingType: "sale",
      //   propertyType: "Apartment",
      //   title: "",
      //   price: "",
      //   bedrooms: "",
      //   bathrooms: "",
      //   area: "",
      //   furnishing: "Unfurnished",
      //   address: "",
      //   city: "",
      //   state: "",
      //   pincode: "",
      //   description: "",
      //   parking: false,
      //   lift: false,
      //   security: false,
      //   balcony: false,
      //   powerBackup: false,
      //   waterSupply: false,
      // });

      // setImages([]);
      // setPreviews([]);

    } catch (error) {
      console.error("Publish property error:", error);

      toast.error("Something went wrong while publishing property")

    } finally {
      setSubmitting(false);
    }
  };





















  return (
    <main className="min-h-screen bg-[#f7faff] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-base font-bold text-slate-900">
                List Your Property
              </h1>

              <p className="text-xs text-slate-500">
                Find the right buyer or tenant
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <ShieldCheck
              size={17}
              className="text-blue-600"
            />

            <span className="text-sm font-medium text-slate-600">
              Your information is secure
            </span>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">

        {/* INTRO */}
        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Sparkles size={14} />
            List your property
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Tell us about your property
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Add accurate property details and high-quality photos
            to attract genuine buyers and tenants.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="grid gap-7 lg:grid-cols-[1fr_330px]">

            {/* LEFT */}
            <div className="space-y-7">

              {/* SALE / RENT */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5">
                  <h3 className="text-lg font-bold">
                    What are you listing?
                  </h3>

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
                      onClick={() =>
                        updateField(
                          "listingType",
                          item.value
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${form.listingType === item.value
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-blue-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">

                        <div>
                          <p className="font-bold">
                            {item.title}
                          </p>

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
                  <h3 className="text-lg font-bold">
                    Property details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Give buyers the basic information about your property.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* TITLE */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold">
                      Property title
                    </label>

                    <input
                      value={form.title}
                      onChange={(e) =>
                        updateField(
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Example: Modern 3 BHK Apartment"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* TYPE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Property type
                    </label>

                    <div className="relative">

                      <select
                        value={form.propertyType}
                        onChange={(e) =>
                          updateField(
                            "propertyType",
                            e.target.value
                          )
                        }
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      >
                        {propertyTypes.map((type) => (
                          <option key={type}>
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

                  {/* PRICE */}
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
                        value={form.price}
                        onChange={(e) =>
                          updateField(
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="45,00,000"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                    </div>
                  </div>

                  {/* BEDROOM */}
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
                          updateField(
                            "bedrooms",
                            e.target.value
                          )
                        }
                        placeholder="3"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                    </div>
                  </div>

                  {/* BATHROOM */}
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
                          updateField(
                            "bathrooms",
                            e.target.value
                          )
                        }
                        placeholder="2"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                    </div>
                  </div>

                  {/* AREA */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Built-up area
                    </label>

                    <div className="relative">

                      <input
                        value={form.area}
                        onChange={(e) =>
                          updateField(
                            "area",
                            e.target.value
                          )
                        }
                        placeholder="1450"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-20 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      <span className="absolute right-4 top-3.5 text-xs font-semibold text-slate-400">
                        sq.ft
                      </span>

                    </div>
                  </div>

                  {/* FURNISHING */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Furnishing
                    </label>

                    <select
                      value={form.furnishing}
                      onChange={(e) =>
                        updateField(
                          "furnishing",
                          e.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    >
                      {furnishingOptions.map(
                        (option) => (
                          <option key={option}>
                            {option}
                          </option>
                        )
                      )}
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
                    <h3 className="text-lg font-bold">
                      Property location
                    </h3>

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
                        updateField(
                          "address",
                          e.target.value
                        )
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
                      value={form.city}
                      onChange={(e) =>
                        updateField(
                          "city",
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        updateField(
                          "state",
                          e.target.value
                        )
                      }
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
                          e.target.value
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
                  <h3 className="text-lg font-bold">
                    Property photos
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add up to 10 high-quality photos.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

                  {previews.map(
                    (preview, index) => (
                      <div
                        key={preview}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                      >

                        <img
                          src={preview}
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
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm opacity-0 transition group-hover:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    )
                  )}

                  {images.length < 10 && (
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
                  <h3 className="text-lg font-bold">
                    Amenities
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Select everything available at the property.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  {[
                    {
                      key: "parking",
                      label: "Parking",
                      icon: ParkingSquare,
                    },
                    {
                      key: "lift",
                      label: "Lift",
                      icon: Building2,
                    },
                    {
                      key: "security",
                      label: "24/7 Security",
                      icon: ShieldCheck,
                    },
                    {
                      key: "balcony",
                      label: "Balcony",
                      icon: Building2,
                    },
                    {
                      key: "powerBackup",
                      label: "Power Backup",
                      icon: Sparkles,
                    },
                    {
                      key: "waterSupply",
                      label: "24/7 Water Supply",
                      icon: Sparkles,
                    },
                  ].map(
                    ({
                      key,
                      label,
                      icon: Icon,
                    }) => {
                      const active = form[key];

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            updateField(
                              key,
                              !active
                            )
                          }
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
                            <Check
                              size={17}
                              className="text-blue-600"
                            />
                          )}

                        </button>
                      );
                    }
                  )}

                </div>
              </section>

              {/* DESCRIPTION */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5">
                  <h3 className="text-lg font-bold">
                    Property description
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tell potential buyers or tenants what makes
                    your property special.
                  </p>
                </div>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
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

              {/* MOBILE BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60 lg:hidden"
              >
                {submitting
                  ? "Publishing..."
                  : (
                    <>
                      Publish Property
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

                      {previews[0] ? (
                        <img
                          src={previews[0]}
                          alt="Preview"
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
                        {form.listingType === "sale"
                          ? "FOR SALE"
                          : "FOR RENT"}
                      </span>

                    </div>

                    <div className="pt-4">

                      <p className="text-xl font-bold text-slate-950">
                        {form.price
                          ? `₹${form.price}`
                          : "₹45,00,000"}
                      </p>

                      <h4 className="mt-1 line-clamp-1 font-bold">
                        {form.title ||
                          "Modern 3 BHK Apartment"}
                      </h4>

                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} />
                        {form.city ||
                          "Your property location"}
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

                {/* TIP */}
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
                        Add at least 5 clear photos and a detailed
                        description to make your property stand out.
                      </p>
                    </div>

                  </div>
                </div>

                {/* DESKTOP BUTTON */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting
                    ? "Publishing..."
                    : (
                      <>
                        Publish Property
                        <ArrowRight size={18} />
                      </>
                    )}
                </button>

                <p className="text-center text-[11px] leading-5 text-slate-400">
                  By publishing, you agree that the information
                  provided is accurate and can be displayed publicly.
                </p>

              </div>
            </aside>

          </div>
        </form>
      </div>
    </main>
  );
}