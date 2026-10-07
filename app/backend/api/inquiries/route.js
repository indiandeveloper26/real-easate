import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import PropertyInquiry from "../../models/Enquiry";

export const runtime = "nodejs";




export async function POST(request) {
    console.log("📩 Property inquiry API calling...");

    try {
        const body = await request.json();

        const {
            propertyId,
            propertyTitle,
            propertyPrice,
            propertyLocation,
            name,
            phone,
            email,
            budget,
            purpose,
            message,
            source,
        } = body;

        console.log("📩 Inquiry received:", {
            propertyId,
            propertyTitle,
            name,
            phone,
            source,
        });

        // 1. Required field validation
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name aur phone number required hain.",
                },
                { status: 400 }
            );
        }

        if (name.trim().length > 100) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name maximum 100 characters ka ho sakta hai.",
                },
                { status: 400 }
            );
        }

        // 2. Indian phone validation
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

        // Normalize Indian phone number
        const finalPhone = normalizedPhone.replace(/^(?:\+91|91)/, "");

        // 3. Email validation
        const normalizedEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        if (
            normalizedEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid email address enter karein.",
                },
                { status: 400 }
            );
        }

        // 4. Purpose validation
        const allowedPurposes = ["Buy", "Rent", "Lease", "Invest"];

        if (!allowedPurposes.includes(purpose)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid property purpose.",
                },
                { status: 400 }
            );
        }

        // 5. Budget validation
        const allowedBudgets = [
            "Under ₹ 30 Lakh",
            "₹ 30 Lakh - ₹ 50 Lakh",
            "₹ 50 Lakh - ₹ 1 Crore",
            "₹ 1 Crore - ₹ 2 Crore",
            "₹ 2 Crore - ₹ 5 Crore",
            "₹ 5 Crore+",
        ];

        if (
            typeof budget !== "string" ||
            !allowedBudgets.includes(budget)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid budget select karein.",
                },
                { status: 400 }
            );
        }

        // 6. Property ID validation
        if (
            propertyId &&
            (typeof propertyId !== "string" ||
                !mongoose.isValidObjectId(propertyId))
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid property ID.",
                },
                { status: 400 }
            );
        }

        // 7. Property price validation
        let finalPropertyPrice = null;

        if (
            propertyPrice !== null &&
            propertyPrice !== undefined &&
            propertyPrice !== ""
        ) {
            if (
                typeof propertyPrice !== "number" ||
                !Number.isFinite(propertyPrice) ||
                propertyPrice < 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid property price.",
                    },
                    { status: 400 }
                );
            }

            finalPropertyPrice = propertyPrice;
        }

        // 8. Connect MongoDB
        await connectDB();

        // 9. Save inquiry
        const inquiry = await PropertyInquiry.create({
            name: name.trim(),
            phone: finalPhone,
            email: normalizedEmail,

            propertyId: propertyId || null,
            propertyTitle:
                typeof propertyTitle === "string"
                    ? propertyTitle.trim().slice(0, 200)
                    : "",
            propertyPrice: finalPropertyPrice,
            propertyLocation:
                typeof propertyLocation === "string"
                    ? propertyLocation.trim().slice(0, 300)
                    : "",

            budget,
            purpose,
            message:
                typeof message === "string"
                    ? message.trim().slice(0, 2000)
                    : "",

            source:
                typeof source === "string" && source.trim()
                    ? source.trim().slice(0, 100)
                    : "Website",

            status: "New",
        });

        console.log("✅ Property inquiry saved:", inquiry._id);

        // 10. Success response
        return NextResponse.json(
            {
                success: true,
                message: "Property inquiry successfully submit ho gayi!",
                data: {
                    id: inquiry._id,
                    status: inquiry.status,
                    propertyId: inquiry.propertyId,
                    createdAt: inquiry.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Property inquiry API error:", error);

        if (
            error.name === "ValidationError" ||
            error.name === "CastError"
        ) {
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

