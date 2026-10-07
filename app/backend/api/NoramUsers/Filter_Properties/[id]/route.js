
import { NextResponse } from "next/server";

import {connectDB} from "../../../../../lib/mongodb";
import Property from "../../../../models/Property";

export const dynamic = "force-dynamic";

const PROPERTY_TYPES = [
  "Apartment",
  "Independent House",
  "Villa",
  "Plot",
  "Office",
  "Shop",
  "Warehouse",
  "PG",
];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") || "10", 10) || 10
      )
    );

    const listingType = searchParams.get("listingType");
    const propertyTypesParam = searchParams.get("propertyTypes");
    const city = searchParams.get("city")?.trim();
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const bedroomsParam = searchParams.get("bedrooms");
    const sortBy = searchParams.get("sortBy") || "newest";
    const search = searchParams.get("search")?.trim();

    // Public listing filter
    const filter = {
      status: "approved",
    };

    // Sale / Rent
    if (listingType && listingType !== "all") {
      if (!["sale", "rent"].includes(listingType)) {
        return NextResponse.json(
          { success: false, message: "Invalid listing type" },
          { status: 400 }
        );
      }

      filter.listingType = listingType;
    }

    // Multiple property types
    if (propertyTypesParam) {
      const types = propertyTypesParam
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean);

      if (types.some((type) => !PROPERTY_TYPES.includes(type))) {
        return NextResponse.json(
          { success: false, message: "Invalid property type" },
          { status: 400 }
        );
      }

      if (types.length) {
        filter.propertyType = { $in: [...new Set(types)] };
      }
    }

    // City: case-insensitive exact match
    if (city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter["location.city"] = {
        $regex: `^${escapedCity}$`,
        $options: "i",
      };
    }

    // Price filters
    const minPrice =
      minPriceParam !== null && minPriceParam !== ""
        ? Number(minPriceParam)
        : undefined;

    const maxPrice =
      maxPriceParam !== null && maxPriceParam !== ""
        ? Number(maxPriceParam)
        : undefined;

    if (
      (minPrice !== undefined &&
        (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined &&
        (!Number.isFinite(maxPrice) || maxPrice < 0))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid price range" },
        { status: 400 }
      );
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum price cannot exceed maximum price",
        },
        { status: 400 }
      );
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Bedrooms: exact value or 4+ for four and above
    if (bedroomsParam && bedroomsParam !== "any") {
      if (/^\d+\+$/.test(bedroomsParam)) {
        const count = Number(bedroomsParam.slice(0, -1));

        if (!Number.isSafeInteger(count) || count < 0) {
          return NextResponse.json(
            { success: false, message: "Invalid bedrooms filter" },
            { status: 400 }
          );
        }

        filter.bedrooms = { $gte: count };
      } else if (/^\d+$/.test(bedroomsParam)) {
        const count = Number(bedroomsParam);

        if (!Number.isSafeInteger(count)) {
          return NextResponse.json(
            { success: false, message: "Invalid bedrooms filter" },
            { status: 400 }
          );
        }

        filter.bedrooms = count;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid bedrooms filter" },
          { status: 400 }
        );
      }
    }

    // Search by title, city, or address
    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        {
          "location.city": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          "location.address": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
    };

    const sort = sortOptions[sortBy] || sortOptions.newest;

    // Fetch matching data from MongoDB
    const [properties, totalProperties] = await Promise.all([
      Property.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Property.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProperties / limit);

    return NextResponse.json({
      success: true,
      properties,
      pagination: {
        currentPage: page,
        limit,
        totalProperties,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/properties:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}

