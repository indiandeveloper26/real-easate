import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import Property from "../../../models/Property";
import AdminUser from "../../../models/AdminUser";
import { connectDB } from "../../../../lib/mongodb";

export async function POST(request) {
    try {
        // ==========================================
        // 1. CONNECT DATABASE
        // ==========================================

        await connectDB();

        // ==========================================
        // 2. GET ADMIN AUTH COOKIE
        // ==========================================

        const cookieStore = request.cookies;

        // IMPORTANT:
        // Apne login mein agar cookie ka naam
        // "adminToken" nahi hai to yahan change karo.

        const token = cookieStore.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin authentication required",
                },
                {
                    status: 401,
                }
            );
        }

        // ==========================================
        // 3. VERIFY JWT
        // ==========================================

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
        } catch (error) {
            console.error("JWT VERIFY ERROR:", error);

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired admin session",
                },
                {
                    status: 401,
                }
            );
        }

        // ==========================================
        // 4. GET ADMIN ID FROM TOKEN
        // ==========================================

        const adminId =
            decoded?.id ||
            decoded?._id ||
            decoded?.adminId ||
            decoded?.userId;

        if (!adminId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin ID not found in authentication token",
                },
                {
                    status: 401,
                }
            );
        }

        // ==========================================
        // 5. FIND CURRENT ADMIN
        // ==========================================

        const admin = await AdminUser.findById(adminId);

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin user not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ==========================================
        // 6. CHECK ADMIN STATUS
        // ==========================================

        if (!admin.isActive) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin account is inactive",
                },
                {
                    status: 403,
                }
            );
        }

        // ==========================================
        // 7. CHECK ADMIN ROLE
        // ==========================================

        if (admin.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only admin can create properties",
                },
                {
                    status: 403,
                }
            );
        }

        // ==========================================
        // 8. GET REQUEST BODY
        // ==========================================

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













        // ==========================================
        // 9. VALIDATION
        // ==========================================

        if (!listingType) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Listing type is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!["sale", "rent"].includes(listingType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid listing type",
                },
                {
                    status: 400,
                }
            );
        }

        if (!propertyType) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property type is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!title?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property title is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            price === undefined ||
            price === null ||
            price === ""
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property price is required",
                },
                {
                    status: 400,
                }
            );
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid property price",
                },
                {
                    status: 400,
                }
            );
        }

        // ==========================================
        // AREA
        // ==========================================

        if (
            area === undefined ||
            area === null ||
            area === ""
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property area is required",
                },
                {
                    status: 400,
                }
            );
        }

        const numericArea = Number(area);

        if (!Number.isFinite(numericArea) || numericArea <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid property area",
                },
                {
                    status: 400,
                }
            );
        }

        // ==========================================
        // LOCATION
        // ==========================================

        if (!location?.address?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property address is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!location?.city?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property city is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!location?.state?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property state is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!location?.pincode) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Property pincode is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ==========================================
        // IMAGES
        // ==========================================

        if (
            !Array.isArray(images) ||
            images.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "At least one property image is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (images.length > 10) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Maximum 10 images are allowed",
                },
                {
                    status: 400,
                }
            );
        }

        // ==========================================
        // CREATE PROPERTY
        // ==========================================

        const property = await Property.create({
            // IMPORTANT:
            // Current logged-in admin ID
            // dynamically comes from AdminUser
            owner: admin._id,

            listingType,

            propertyType,

            title: title.trim(),

            price: numericPrice,

            bedrooms: Number(bedrooms || 0),

            bathrooms: Number(bathrooms || 0),

            area: numericArea,

            furnishing:
                furnishing || "Unfurnished",

            location: {
                address: location.address.trim(),

                city: location.city.trim(),

                state: location.state.trim(),

                pincode:
                    String(location.pincode).trim(),
            },

            images,

            coverImage:
                coverImage || images[0],

            amenities: {
                parking:
                    Boolean(amenities?.parking),

                lift:
                    Boolean(amenities?.lift),

                security:
                    Boolean(amenities?.security),

                balcony:
                    Boolean(amenities?.balcony),

                powerBackup:
                    Boolean(amenities?.powerBackup),

                waterSupply:
                    Boolean(amenities?.waterSupply),
            },

            description:
                description?.trim() || "",

            status: "pending",

            publishedAt: null,
        });

        // ==========================================
        // SUCCESS
        // ==========================================

        return NextResponse.json(
            {
                success: true,

                message:
                    "Property submitted successfully",

                property,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        // ==========================================
        // ERROR
        // ==========================================

        console.error(
            "CREATE PROPERTY ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Failed to create property",

                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            {
                status: 500,
            }
        );
    }
}











export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = 100;
        const skip = (page - 1) * limit;

        const [properties, total] = await Promise.all([
            Property.find({})
                .select(`
          _id
          title
          coverImage
          images
          status
          listingType
          price
          bedrooms
          bathrooms
          area
          propertyType
          location.city
          location.state
        `)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Property.countDocuments({}),
        ]);

        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;

        return NextResponse.json(
            {
                success: true,
                properties,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasMore,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET PROPERTIES ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch properties",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}