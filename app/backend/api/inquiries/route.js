import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import PropertyInquiry from "../../models/Enquiry";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const body = await request.json();

        const {
            fullName,
            phone,
            email,
            city,
            locality,
            propertyType,
            purpose,
            budget,
            bhk,
            propertySize,
            sizeUnit,
            furnishing,
            possession,
            contactPreference,
            siteVisit,
            message,
            propertyId,
        } = body;


        console.log("📩 Inquiry received:", body);

        // Required fields
        if (!fullName?.trim() || !phone?.trim() || !city?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, phone aur city required hain.",
                },
                { status: 400 }
            );
        }

        // Indian phone validation
        const normalizedPhone = phone.replace(/[\s()-]/g, "");

        if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(normalizedPhone)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid Indian mobile number enter karein.",
                },
                { status: 400 }
            );
        }

        if (
            !["Buy", "Rent", "Lease", "Invest"].includes(purpose)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid property purpose." },
                { status: 400 }
            );
        }

        const allowedPropertyTypes = [
            "Apartment / Flat",
            "Independent House",
            "Villa / Kothi",
            "Residential Plot",
            "Commercial Shop",
            "Office Space",
            "Commercial Land",
        ];

        if (!allowedPropertyTypes.includes(propertyType)) {
            return NextResponse.json(
                { success: false, message: "Invalid property type." },
                { status: 400 }
            );
        }

        const allowedBudgets = [
            "Under ₹ 30 Lakh",
            "₹ 30 Lakh - ₹ 50 Lakh",
            "₹ 50 Lakh - ₹ 1 Crore",
            "₹ 1 Crore - ₹ 2 Crore",
            "₹ 2 Crore - ₹ 5 Crore",
            "₹ 5 Crore+",
        ];

        if (!allowedBudgets.includes(budget)) {
            return NextResponse.json(
                { success: false, message: "Invalid budget." },
                { status: 400 }
            );
        }

        if (
            propertyId &&
            !mongoose.isValidObjectId(propertyId)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid property ID." },
                { status: 400 }
            );
        }

        if (
            propertySize !== "" &&
            propertySize !== null &&
            propertySize !== undefined &&
            (!Number.isFinite(Number(propertySize)) ||
                Number(propertySize) < 0)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid property size." },
                { status: 400 }
            );
        }

        await connectDB();

        const inquiry = await PropertyInquiry.create({
            fullName: fullName.trim(),
            phone: normalizedPhone,
            email: email?.trim() || "",
            city: city.trim(),
            locality: locality?.trim() || "",
            propertyType,
            purpose,
            budget,
            bhk: bhk || "Any",
            propertySize:
                propertySize !== "" &&
                    propertySize !== null &&
                    propertySize !== undefined
                    ? Number(propertySize)
                    : null,
            sizeUnit: sizeUnit || "Sq. Ft.",
            furnishing: furnishing || "Any",
            possession: possession || "Any Time",
            contactPreference: contactPreference || "WhatsApp",
            siteVisit: siteVisit || "Yes",
            message: message?.trim() || "",
            propertyId: propertyId || null,
            source: "Website",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Property requirement successfully submit ho gayi!",
                data: {
                    id: inquiry._id,
                    status: inquiry.status,
                    createdAt: inquiry.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Property inquiry API error:", error);

        if (error.name === "ValidationError" || error.name === "CastError") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Submitted data valid nahi hai.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Server error. Please try again.",
            },
            { status: 500 }
        );
    }
}