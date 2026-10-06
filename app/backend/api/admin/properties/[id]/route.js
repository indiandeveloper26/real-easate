
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import Property from "../../../../models/Property";

import { cookies } from "next/headers";


import { verifyAdminToken } from "../../../../../lib/auth";
import AdminUser from "../../../../models/AdminUser";





// =====================================
// GET SINGLE PROPERTY DETAILS
// =====================================
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid property ID" },
        { status: 400 }
      );
    }

    const property = await Property.findById(id)
      .select("-__v")
      .lean();

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Property details fetched successfully",
        property,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get single property error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch property details",
      },
      { status: 500 }
    );
  }
}






// =====================================
// DELETE OWN PROPERTY - ADMIN ONLY
// =====================================
export async function DELETE(request, { params }) {
  console.log("Property DELETE API called");

  try {
    await connectDB();

    // 1. Get admin token
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("admin_token")?.value;

    const authorization = request.headers.get("authorization");
    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : null;

    const token = cookieToken || bearerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please login as admin first" },
        { status: 401 }
      );
    }

    // 2. Verify token using existing auth helper
    const admin = verifyAdminToken(token);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired admin token. Please login again.",
        },
        { status: 401 }
      );
    }

    const adminId = admin.adminId;

    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin identity" },
        { status: 401 }
      );
    }

    // 3. Validate property ID
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid property ID" },
        { status: 400 }
      );
    }

    // 4. Find property first
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // 5. Identify owner field from supported schema fields.
    // Keep only fields that your Property schema actually uses.
    const ownerFields = [
      "createdBy",
      "owner",
      "userId",
      "adminId",
      "user",
    ];

    let ownerId = null;

    for (const field of ownerFields) {
      const value = property.get(field);

      if (value != null) {
        ownerId =
          typeof value === "object" && value._id
            ? value._id.toString()
            : value.toString();

        break;
      }
    }

    // 6. Fail closed if ownership is missing or does not match
    if (!ownerId) {
      console.error(
        "Property has no recognized owner field:",
        property._id.toString()
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Property owner is not configured. Add an owner ID to this property before deleting it.",
        },
        { status: 403 }
      );
    }

    if (ownerId !== adminId.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You can delete only your own properties",
        },
        { status: 403 }
      );
    }

    // 7. Delete the verified property
    await Property.deleteOne({
      _id: property._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your property has been deleted successfully",
        propertyId: property._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Property DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete property",
      },
      { status: 500 }
    );
  }
}










// ==========================================
// UPDATE PROPERTY
// ==========================================
export async function PUT(request, { params }) {
  try {
    await connectDB();

    // 1. Get property ID
    const { id } = await params;

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid property ID" },
        { status: 400 }
      );
    }

    // 2. Get admin token
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Admin authentication required" },
        { status: 401 }
      );
    }

    // 3. Verify token and admin role
    const decoded = verifyAdminToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid session or admin access denied" },
        { status: 401 }
      );
    }

    // 4. Resolve admin ID
    const adminId =
      decoded.id ||
      decoded._id ||
      decoded.adminId ||
      decoded.userId;

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Admin ID not found in token" },
        { status: 401 }
      );
    }

    // 5. Verify admin exists and is active
    const admin = await AdminUser.findById(adminId);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 404 }
      );
    }

    if (!admin.isActive || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin account is inactive or unauthorized" },
        { status: 403 }
      );
    }

    // 6. Find property
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // 7. Read request body
    const body = await request.json();

    const {
      listingType,
      propertyType,
      title,
      price,
      bedrooms,
      bathrooms,
      area,
      furnishing,
      location,
      images,
      coverImage,
      amenities,
      description,
    } = body;

    // 8. Validate required fields
    if (!["sale", "rent"].includes(listingType)) {
      return NextResponse.json(
        { success: false, message: "Invalid listing type" },
        { status: 400 }
      );
    }

    if (
      typeof propertyType !== "string" ||
      !propertyType.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Property type is required" },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Property title is required" },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    const numericArea = Number(area);

    if (
      price === "" ||
      price === null ||
      price === undefined ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid property price" },
        { status: 400 }
      );
    }

    if (
      area === "" ||
      area === null ||
      area === undefined ||
      !Number.isFinite(numericArea) ||
      numericArea <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid property area" },
        { status: 400 }
      );
    }

    if (
      !location ||
      typeof location.address !== "string" ||
      !location.address.trim() ||
      typeof location.city !== "string" ||
      !location.city.trim() ||
      typeof location.state !== "string" ||
      !location.state.trim() ||
      !String(location.pincode || "").trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Complete property location is required" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(images) ||
      images.length === 0 ||
      images.length > 10 ||
      !images.every(
        (image) =>
          typeof image === "string" && image.trim().length > 0
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide between 1 and 10 valid property image URLs",
        },
        { status: 400 }
      );
    }

    // 9. Update property fields
    property.listingType = listingType;
    property.propertyType = propertyType.trim();
    property.title = title.trim();
    property.price = numericPrice;
    property.bedrooms = Number(bedrooms || 0);
    property.bathrooms = Number(bathrooms || 0);
    property.area = numericArea;
    property.furnishing = furnishing || "Unfurnished";

    property.location = {
      address: location.address.trim(),
      city: location.city.trim(),
      state: location.state.trim(),
      pincode: String(location.pincode).trim(),
    };

    property.images = images;
    property.coverImage =
      typeof coverImage === "string" && images.includes(coverImage)
        ? coverImage
        : images[0];

    property.amenities = {
      parking: Boolean(amenities?.parking),
      lift: Boolean(amenities?.lift),
      security: Boolean(amenities?.security),
      balcony: Boolean(amenities?.balcony),
      powerBackup: Boolean(amenities?.powerBackup),
      waterSupply: Boolean(amenities?.waterSupply),
    };

    property.description =
      typeof description === "string" ? description.trim() : "";

    // Preserve owner and approval status
    await property.save();

    return NextResponse.json(
      {
        success: true,
        message: "Property updated successfully",
        property,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update property",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}