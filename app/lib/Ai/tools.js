
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import mongoose from "mongoose";
import Property from "../../backend/models/Property.js";
import { getOrSetSearchCache } from "../config/propertyCache.js";
import { connectDB } from "../mongodb.js";

// =========================
// COMMON HELPERS
// =========================

const propertyTypes = [
  "Apartment",
  "Independent House",
  "Villa",
  "Plot",
  "Office",
  "Shop",
  "Warehouse",
  "PG",
];

const propertyFields = [
  "_id",
  "owner",
  "listingType",
  "propertyType",
  "title",
  "price",
  "bedrooms",
  "bathrooms",
  "area",
  "furnishing",
  "location",
  "images",
  "coverImage",
  "amenities",
  "description",
  "status",
  "views",
  "favoritesCount",
  "isFeatured",
  "publishedAt",
  "createdAt",
];

function formatProperty(property) {
  if (!property) return null;

  return {
    ...property,
    _id: String(property._id),
    owner: property.owner ? String(property.owner) : null,
  };
}

function jsonResult(data) {
  return JSON.stringify(data);
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// =========================
// TOOL 1: SEARCH PROPERTIES
// =========================










export const searchProperties = tool(
  async ({
    city = "",
    state = "",
    listingType,
    propertyType,
    minPrice = 0,
    maxPrice = 0,
    bedrooms = 0,
    bathrooms = 0,
    furnishing,
    parking,
    balcony,
  }) => {
    try {
      const filters = {
        city: city.trim().toLowerCase(),
        state: state.trim().toLowerCase(),
        listingType: listingType || "",
        propertyType: propertyType || "",
        minPrice,
        maxPrice,
        bedrooms,
        bathrooms,
        furnishing: furnishing || "",
        parking: typeof parking === "boolean" ? parking : null,
        balcony: typeof balcony === "boolean" ? balcony : null,
      };

      await connectDB()


      console.log("[TOOL CALL] search_properties", filters);

      const result = await getOrSetSearchCache(
        filters,
        async () => {
          console.log("[MONGODB] Executing property search");

          const filter = {};

          if (city.trim()) {
            filter["location.city"] = {
              $regex: city.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              ),
              $options: "i",
            };
          }

          if (state.trim()) {
            filter["location.state"] = {
              $regex: state.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              ),
              $options: "i",
            };
          }

          if (listingType) {
            filter.listingType = listingType;
          }

          if (propertyType) {
            filter.propertyType = propertyType;
          }

          if (minPrice > 0 || maxPrice > 0) {
            filter.price = {};

            if (minPrice > 0) {
              filter.price.$gte = minPrice;
            }

            if (maxPrice > 0) {
              filter.price.$lte = maxPrice;
            }
          }

          if (bedrooms > 0) {
            filter.bedrooms = { $gte: bedrooms };
          }

          if (bathrooms > 0) {
            filter.bathrooms = { $gte: bathrooms };
          }

          if (furnishing) {
            filter.furnishing = furnishing;
          }

          if (typeof parking === "boolean") {
            filter["amenities.parking"] = parking;
          }

          if (typeof balcony === "boolean") {
            filter["amenities.balcony"] = balcony;
          }

          console.log(
            "[MONGODB FILTER]",
            JSON.stringify(filter)
          );

          const properties = await Property.find(filter)
            .select(propertyFields.join(" "))
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(20)
            .lean();

          console.log("[MONGODB RESULTS]", properties.length);

          console.log(
            "[MATCHED CITIES]",
            properties.map((property) => property.location?.city)
          );

          const formattedProperties = properties.map(formatProperty);

          return {
            success: true,
            count: formattedProperties.length,
            properties: formattedProperties,
            message:
              formattedProperties.length > 0
                ? "Properties fetched successfully."
                : "No matching properties found.",
          };
        }
      );

      console.log("[TOOL RESULT COUNT]", result.count);

      return jsonResult(result);
    } catch (error) {
      console.error("[SEARCH PROPERTIES ERROR]", error);

      return jsonResult({
        success: false,
        count: 0,
        properties: [],
        message: "Failed to fetch properties.",
      });
    }


  },
  {
    name: "search_properties",
    description: `
Search real property records from MongoDB.

Always call this tool when the user asks to find or show properties.

Extract:

* city
* state
* listing type: sale or rent
* property type
* minimum and maximum budget
* bedrooms and bathrooms
* furnishing
* parking and balcony

Examples:
"Basti mein property dikhao"
=> city: Basti

"Basti mein 50 lakh tak villa"
=> city: Basti, maxPrice: 5000000, propertyType: Villa

"UP mein rent par property"
=> state: Uttar Pradesh, listingType: rent

Use the actual tool result as the source of truth.
Never invent property records.
`,
    schema: z.object({
      city: z.string().default(""),
      state: z.string().default(""),
      listingType: z.enum(["sale", "rent"]).optional(),
      propertyType: z.enum(propertyTypes).optional(),
      minPrice: z.number().min(0).default(0),
      maxPrice: z.number().min(0).default(0),
      bedrooms: z.number().min(0).default(0),
      bathrooms: z.number().min(0).default(0),
      furnishing: z.enum([
        "Unfurnished",
        "Semi Furnished",
        "Fully Furnished",
      ]).optional(),
      parking: z.boolean().optional(),
      balcony: z.boolean().optional(),
    }),
  }
);










// =========================
// TOOL 2: PROPERTY DETAILS
// =========================

export const getPropertyDetails = tool(
  async ({ propertyId }) => {
    try {
      console.log("[TOOL 2] getPropertyDetails", propertyId);

      if (!isValidId(propertyId)) {
        return jsonResult({
          success: false,
          property: null,
          message: "Invalid property ID.",
        });
      }

      const property = await Property.findOne({
        _id: propertyId,
        status: "approved",
      })
        .select(propertyFields.join(" "))
        .lean();

      if (!property) {
        return jsonResult({
          success: false,
          property: null,
          message: "Property not found or not publicly available.",
        });
      }

      return jsonResult({
        success: true,
        property: formatProperty(property),
        message: "Property details fetched from MongoDB.",
      });
    } catch (error) {
      console.error("[PROPERTY DETAILS ERROR]", error);

      return jsonResult({
        success: false,
        property: null,
        message: "Could not fetch property details.",
      });
    }
  },
  {
    name: "get_property_details",
    description: `
Fetch the full details of one specific approved property by its ID.

Use this when the user asks about a property they selected,
such as its price, location, amenities, area, furnishing,
images, or description.

Use a real _id obtained from search results or conversation history.
Never invent an ID or property details.
`,
    schema: z.object({
      propertyId: z.string(),
    }),
  }
);

// =========================
// TOOL 3: COMPARE PROPERTIES
// =========================

export const compareProperties = tool(
  async ({ propertyIds }) => {
    try {
      console.log("[TOOL 3] compareProperties", propertyIds);

      const uniqueIds = [...new Set(propertyIds)];

      if (
        uniqueIds.length < 2 ||
        uniqueIds.length > 3 ||
        uniqueIds.some((id) => !isValidId(id))
      ) {
        return jsonResult({
          success: false,
          properties: [],
          message: "Provide 2 or 3 valid property IDs.",
        });
      }

      const properties = await Property.find({
        _id: { $in: uniqueIds },
        status: "approved",
      })
        .select(propertyFields.join(" "))
        .lean();

      if (properties.length !== uniqueIds.length) {
        return jsonResult({
          success: false,
          properties: properties.map(formatProperty),
          message:
            "Some properties were not found or are not publicly available.",
        });
      }

      return jsonResult({
        success: true,
        count: properties.length,
        properties: properties.map(formatProperty),
        comparisonFields: [
          "price",
          "propertyType",
          "listingType",
          "location",
          "bedrooms",
          "bathrooms",
          "area",
          "furnishing",
          "amenities",
        ],
        message: "Properties fetched for comparison.",
      });
    } catch (error) {
      console.error("[COMPARE PROPERTIES ERROR]", error);

      return jsonResult({
        success: false,
        properties: [],
        message: "Could not compare properties.",
      });
    }
  },
  {
    name: "compare_properties",
    description: `
Compare two or three specific properties.

Use when the user asks:
"Compare these two properties."
"Which of these houses is cheaper?"
"Compare price, area, bedrooms and amenities."

Use only actual property IDs from previous search results.
The agent should explain the differences using returned data,
not make unsupported claims about which property is best.
`,
    schema: z.object({
      propertyIds: z.array(z.string()).min(2).max(3),
    }),
  }
);

// =========================
// TOOL 4: FEATURED PROPERTIES
// =========================

export const getFeaturedProperties = tool(
  async ({ city = "", listingType, propertyType, limit = 6 }) => {
    try {
      console.log("[TOOL 4] getFeaturedProperties");

      const filter = {
        status: "approved",
        isFeatured: true,
      };

      if (city.trim()) {
        filter["location.city"] = {
          $regex: city.trim(),
          $options: "i",
        };
      }

      if (listingType) {
        filter.listingType = listingType;
      }

      if (propertyType) {
        filter.propertyType = propertyType;
      }

      const properties = await Property.find(filter)
        .select(propertyFields.join(" "))
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      return jsonResult({
        success: true,
        count: properties.length,
        properties: properties.map(formatProperty),
        message:
          properties.length > 0
            ? "Featured properties fetched."
            : "No featured properties match this request.",
      });
    } catch (error) {
      console.error("[FEATURED PROPERTIES ERROR]", error);

      return jsonResult({
        success: false,
        count: 0,
        properties: [],
        message: "Could not fetch featured properties.",
      });
    }
  },
  {
    name: "get_featured_properties",
    description: `
Find featured, approved properties from MongoDB.

Use when the user asks for featured properties,
top listings, or highlighted properties.

Optionally filter by city, sale/rent, and property type.
Only return real records with isFeatured true and status approved.
`,
    schema: z.object({
      city: z.string().default(""),
      listingType: z.enum(["sale", "rent"]).optional(),
      propertyType: z.enum(propertyTypes).optional(),
      limit: z.number().int().min(1).max(10).default(6),
    }),
  }
);

// =========================
// TOOL 5: SIMILAR PROPERTIES
// =========================

export const getSimilarProperties = tool(
  async ({ propertyId, limit = 5 }) => {
    try {
      console.log("[TOOL 5] getSimilarProperties", propertyId);

      if (!isValidId(propertyId)) {
        return jsonResult({
          success: false,
          properties: [],
          message: "Invalid property ID.",
        });
      }

      const baseProperty = await Property.findOne({
        _id: propertyId,
        status: "approved",
      })
        .select(
          "_id listingType propertyType price bedrooms location.city location.state"
        )
        .lean();

      if (!baseProperty) {
        return jsonResult({
          success: false,
          properties: [],
          message: "Base property not found or not publicly available.",
        });
      }

      const filter = {
        _id: { $ne: baseProperty._id },
        status: "approved",
        listingType: baseProperty.listingType,
        propertyType: baseProperty.propertyType,
      };

      if (baseProperty.location?.city) {
        filter["location.city"] = {
          $regex: `^${baseProperty.location.city.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}$`,
          $options: "i",
        };
      }

      // Price range: approximately 25% below to 25% above.
      if (baseProperty.price > 0) {
        filter.price = {
          $gte: baseProperty.price * 0.75,
          $lte: baseProperty.price * 1.25,
        };
      }

      const properties = await Property.find(filter)
        .select(propertyFields.join(" "))
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      return jsonResult({
        success: true,
        basePropertyId: String(baseProperty._id),
        count: properties.length,
        properties: properties.map(formatProperty),
        message:
          properties.length > 0
            ? "Similar approved properties fetched."
            : "No similar properties found.",
      });
    } catch (error) {
      console.error("[SIMILAR PROPERTIES ERROR]", error);

      return jsonResult({
        success: false,
        properties: [],
        message: "Could not find similar properties.",
      });
    }
  },
  {
    name: "get_similar_properties",
    description: `
Find properties similar to a specific approved property.

Use when the user asks:
"Show me similar properties."
"Do you have another villa like this?"
"Show alternatives in the same city."

Uses the property's actual listing type, property type,
city and approximate price range.
Requires a real property ID from search results.
`,
    schema: z.object({
      propertyId: z.string(),
      limit: z.number().int().min(1).max(10).default(5),
    }),
  }
);

// Export all tools for the LangChain agent.
export const propertyTools = [
  searchProperties,
  getPropertyDetails,
  compareProperties,
  getFeaturedProperties,
  getSimilarProperties,
];