
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { connectDB } from "../mongodb";




import Property from "../../backend/models/Property";



function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getCollection(name) {
    await connectDB();

    const mongoose = await import("mongoose");
    const db = mongoose.default.connection.db;

    if (!db) {
        throw new Error("MongoDB connection is not ready");
    }

    return db.collection(name);
}

function normalizeProperty(property) {
    const imageValue =
        property.image ||
        property.thumbnail ||
        (Array.isArray(property.images) ? property.images[0] : "");

    return {
        _id: String(property._id),
        title: property.title || property.name || "Property",
        slug: property.slug || "",
        price: Number(property.price ?? property.priceValue ?? 0),
        location:
            property.location ||
            property.city ||
            property.address ||
            "",
        bhk: property.bhk ?? property.bedrooms ?? "",
        area: property.area ?? property.areaSqFt ?? "",
        image: typeof imageValue === "string" ? imageValue : "",
    };
}

// =====================================
// SEARCH PROPERTIES
// =====================================


// =====================================
// SEARCH PROPERTIES FROM YOUR MODEL
// =====================================
export const searchProperties = tool(
  async ({ location, maxPrice, bhk, listingType, propertyType }) => {
    try {
      await connectDB();

      // Your actual Mongoose Property model
      const query = {
        status: "approved",
      };

      // City / State / Address
      if (location?.trim()) {
        const escapedLocation = location
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        query.$or = [
          {
            "location.city": {
              $regex: escapedLocation,
              $options: "i",
            },
          },
          {
            "location.state": {
              $regex: escapedLocation,
              $options: "i",
            },
          },
          {
            "location.address": {
              $regex: escapedLocation,
              $options: "i",
            },
          },
        ];
      }

      // Maximum budget
      if (Number(maxPrice) > 0) {
        query.price = {
          $lte: Number(maxPrice),
        };
      }

      // Bedrooms / BHK
      if (Number(bhk) > 0) {
        query.bedrooms = Number(bhk);
      }

      // Sale / Rent
      if (listingType !== "any") {
        query.listingType = listingType;
      }

      // Apartment / Villa / Plot etc.
      if (propertyType !== "any") {
        query.propertyType = propertyType;
      }

      console.log("🏡 Property query:", JSON.stringify(query, null, 2));

      const properties = await Property.find(query)
        .sort({
          isFeatured: -1,
          publishedAt: -1,
          createdAt: -1,
        })
        .limit(20)
        .lean();

      console.log("✅ Properties found:", properties.length);

      // Return only fields that exist in your schema
      const result = properties.map((p) => ({
        _id: String(p._id),
        title: p.title,
        price: p.price,
        listingType: p.listingType,
        propertyType: p.propertyType,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        furnishing: p.furnishing,

        location: {
          address: p.location?.address || "",
          city: p.location?.city || "",
          state: p.location?.state || "",
          pincode: p.location?.pincode || "",
        },

        coverImage: p.coverImage || p.images?.[0] || "",
        images: p.images || [],
        description: p.description || "",
        amenities: p.amenities || {},
        isFeatured: Boolean(p.isFeatured),
      }));

      return JSON.stringify({
        success: true,
        count: result.length,
        properties: result,
      });
    } catch (error) {
      console.error("❌ Property search failed:", error);

      return JSON.stringify({
        success: false,
        count: 0,
        properties: [],
        error: "Property search failed",
      });
    }
  },
  {
    name: "search_properties",
    description: `
      Search real properties from the MongoDB Property model.

      If the user says "Lucknow property dikhao",
      immediately search location="Lucknow".

      If budget is not specified, use maxPrice=0.
      If BHK is not specified, use bhk=0.
      If sale or rent is not specified, use listingType="any".
      If property type is not specified, use propertyType="any".

      Never invent property listings.
      Return only actual matching database properties.
    `,
    schema: z.object({
      location: z.string().describe("City or area, e.g. Lucknow"),
      maxPrice: z.number().describe("Maximum price in INR; 0 means any budget"),
      bhk: z.number().describe("Bedrooms; 0 means any BHK"),
      listingType: z.enum(["sale", "rent", "any"]),
      propertyType: z.enum([
        "Apartment",
        "Independent House",
        "Villa",
        "Plot",
        "Office",
        "Shop",
        "Warehouse",
        "PG",
        "any",
      ]),
    }),
  }
);


// =====================================
// CREATE PROPERTY LEAD
// =====================================
export const createLead = tool(
    async ({ name, phone, requirement, location, budget }) => {
        const collection = await getCollection("leads");

        const result = await collection.insertOne({
            name: name.trim(),
            phone: phone.trim(),
            requirement: requirement.trim(),
            location: location.trim(),
            budget,
            source: "ai-chatbot",
            createdAt: new Date(),
            status: "new",
        });

        return JSON.stringify({
            success: true,
            leadId: String(result.insertedId),
            message: "Customer enquiry saved successfully.",
        });
    },
    {
        name: "create_property_lead",
        description:
            "Save a customer enquiry only after the customer explicitly agrees. Never invent their name or phone number.",
        schema: z.object({
            name: z.string().describe("Customer's actual name"),
            phone: z.string().describe("Customer's phone number"),
            requirement: z.string().describe("Property requirement"),
            location: z.string().describe(
                "Preferred location. Use an empty string if unknown."
            ),
            budget: z.number().describe(
                "Budget in INR. Use 0 if unknown."
            ),
        }),
    }
);

