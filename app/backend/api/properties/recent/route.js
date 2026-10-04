
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import Property from "../../../models/Property";

// =====================================
// GET RECENT 10 PROPERTIES FOR HOMEPAGE
// =====================================
export async function GET() {
    console.log('api acling okokokokko')

    try {
        await connectDB();

        const properties = await Property.find({

        })
            .sort({ publishedAt: -1, createdAt: -1 })
            .limit(10)
            .select(
                "title price listingType propertyType bedrooms bathrooms area location images coverImage amenities isFeatured publishedAt createdAt"
            )
            .lean();

        return NextResponse.json(
            {
                success: true,
                count: properties.length,
                properties,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Recent Properties API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch recent properties",
            },
            { status: 500 }
        );
    }
}

