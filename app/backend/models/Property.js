import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // =========================
    // OWNER
    // =========================
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
      index: true,
    },

    // =========================
    // LISTING TYPE
    // =========================
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
      index: true,
    },

    // =========================
    // PROPERTY DETAILS
    // =========================
    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Independent House",
        "Villa",
        "Plot",
        "Office",
        "Shop",
        "Warehouse",
        "PG",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    bedrooms: {
      type: Number,
      min: 0,
      default: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
      default: 0,
    },

    area: {
      type: Number,
      min: 0,
      required: true,
    },

    furnishing: {
      type: String,
      enum: [
        "Unfurnished",
        "Semi Furnished",
        "Fully Furnished",
      ],
      default: "Unfurnished",
    },

    // =========================
    // LOCATION
    // =========================
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{6}$/,
      },
    },

    // =========================
    // IMAGES
    // =========================
    images: [
      {
        type: String,
        trim: true,
      },
    ],

    coverImage: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // AMENITIES
    // =========================
    amenities: {
      parking: {
        type: Boolean,
        default: false,
      },

      lift: {
        type: Boolean,
        default: false,
      },

      security: {
        type: Boolean,
        default: false,
      },

      balcony: {
        type: Boolean,
        default: false,
      },

      powerBackup: {
        type: Boolean,
        default: false,
      },

      waterSupply: {
        type: Boolean,
        default: false,
      },
    },

    // =========================
    // DESCRIPTION
    // =========================
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // =========================
    // STATUS
    // =========================
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "sold",
        "rented",
        "inactive",
      ],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // ENGAGEMENT
    // =========================
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================
    // FEATURED
    // =========================
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // =========================
    // PUBLISHED
    // =========================
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// COMPOUND INDEXES
// =========================

propertySchema.index({
  "location.city": 1,
  "location.state": 1,
});

propertySchema.index({
  listingType: 1,
  propertyType: 1,
  status: 1,
});

propertySchema.index({
  createdAt: -1,
});

// =========================
// MODEL
// =========================

const Property =
  mongoose.models.Property ||
  mongoose.model("propertySchema", propertySchema);

export default Property;