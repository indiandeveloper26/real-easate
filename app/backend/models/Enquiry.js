
import mongoose from "mongoose";

const propertyInquirySchema = new mongoose.Schema(
  {
    // Customer details
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Logged-in user, if available
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Specific property from which inquiry was submitted
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
      index: true,
    },

    // Buy / Rent / Lease / Invest
    purpose: {
      type: String,
      enum: ["Buy", "Rent", "Lease", "Invest"],
      required: true,
      default: "Buy",
    },

    // Location preferences
    city: {
      type: String,
      required: true,
      trim: true,
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    // Property requirements
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Apartment / Flat",
        "Independent House",
        "Villa / Kothi",
        "Residential Plot / Land",
        "Commercial Shop",
        "Office Space",
        "Commercial Land",
        "Other",
      ],
    },

    bhk: {
      type: String,
      default: "Any",
    },

    preferredSize: {
      value: {
        type: Number,
        min: 0,
        default: null,
      },
      unit: {
        type: String,
        enum: ["Sq. Ft.", "Sq. Yd.", "Sq. M.", "Acre", ""],
        default: "",
      },
    },

    budget: {
      type: String,
      required: true,
      enum: [
        "Under ₹ 30 Lakh",
        "₹ 30 Lakh - ₹ 50 Lakh",
        "₹ 50 Lakh - ₹ 1 Crore",
        "₹ 1 Crore - ₹ 2 Crore",
        "₹ 2 Crore - ₹ 5 Crore",
        "₹ 5 Crore+",
      ],
    },

    furnishing: {
      type: String,
      enum: [
        "Any",
        "Fully Furnished",
        "Semi Furnished",
        "Unfurnished",
      ],
      default: "Any",
    },

    possession: {
      type: String,
      enum: [
        "Any Time",
        "Immediately",
        "Within 1 Month",
        "1 - 3 Months",
        "3 - 6 Months",
        "6+ Months",
      ],
      default: "Any Time",
    },

    contactMethod: {
      type: String,
      enum: ["WhatsApp", "Call", "Email"],
      default: "WhatsApp",
    },

    siteVisit: {
      type: String,
      enum: ["Yes", "Not Now"],
      default: "Not Now",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // Lead management for admin
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Site Visit",
        "Converted",
        "Closed",
      ],
      default: "New",
      index: true,
    },

    source: {
      type: String,
      default: "Website",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },

    adminNotes: {
      type: String,
      default: "",
      maxlength: 3000,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for admin lead dashboard and filtering
propertyInquirySchema.index({ status: 1, createdAt: -1 });
propertyInquirySchema.index({ city: 1, purpose: 1, propertyType: 1 });
propertyInquirySchema.index({ propertyId: 1, createdAt: -1 });

const PropertyInquiry =
  mongoose.models.PropertyInquiry ||
  mongoose.model("PropertyInquiry", propertyInquirySchema);

export default PropertyInquiry;