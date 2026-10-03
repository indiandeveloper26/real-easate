import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

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
    },

    price: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      default: 0,
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

    location: {
      address: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },
    },

    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "hidden",
      ],
      default: "draft",
    },

    views: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property =
  mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);

export default Property;