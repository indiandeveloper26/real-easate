
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import Property from "../../../../models/Property";

import { cookies } from "next/headers";


import { verifyAdminToken } from "../../../../../lib/auth";





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