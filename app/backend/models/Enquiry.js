
import mongoose from "mongoose";

const propertyInquirySchema = new mongoose.Schema(
  {
    // Customer details - matches form payload
    name: {
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

    // Property details from the form
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
      index: true,
    },

    propertyTitle: {
      type: String,
      trim: true,
      default: "",
    },

    propertyPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    propertyLocation: {
      type: String,
      trim: true,
      default: "",
    },

    // Optional logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Inquiry preferences
    purpose: {
      type: String,
      enum: ["Buy", "Rent", "Lease", "Invest"],
      required: true,
      default: "Buy",
    },

    budget: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // Lead management
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
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },

    adminNotes: {
      type: String,
      maxlength: 3000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Dashboard filtering indexes
propertyInquirySchema.index({ status: 1, createdAt: -1 });
propertyInquirySchema.index({ propertyId: 1, createdAt: -1 });
propertyInquirySchema.index({ phone: 1, createdAt: -1 });

const PropertyInquiry =
  mongoose.models.PropertyInquiry ||
  mongoose.model("PropertyInquiry", propertyInquirySchema);

export default PropertyInquiry;

