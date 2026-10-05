import { NextResponse } from "next/server";
import {connectDB} from "../../../../lib/mongodb";
import PropertyInquiry from "../../../models/Enquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();

    // TODO: Yahan apna existing admin authentication check lagao.
    // Sirf URL ko /admin rakhna security nahi hai.

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "All";
    const search = (searchParams.get("search") || "").trim();

    const allowedStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Site Visit",
      "Converted",
      "Closed",
    ];

    const filter = {};

    if (status !== "All" && allowedStatuses.includes(status)) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { fullName: regex },
        { phone: regex },
        { email: regex },
        { city: regex },
        { locality: regex },
      ];
    }

    const [
      inquiries,
      total,
      newCount,
      contactedCount,
      qualifiedCount,
      siteVisitCount,
      convertedCount,
      closedCount,
    ] = await Promise.all([
      PropertyInquiry.find(filter)
        .sort({ createdAt: -1 })
        .limit(200)
        .select(
          "fullName phone email city locality propertyType purpose budget bhk propertySize sizeUnit furnishing possession contactPreference siteVisit message propertyId status priority adminNotes followUpAt siteVisitAt createdAt"
        )
        .lean(),

      PropertyInquiry.countDocuments(),
      PropertyInquiry.countDocuments({ status: "New" }),
      PropertyInquiry.countDocuments({ status: "Contacted" }),
      PropertyInquiry.countDocuments({ status: "Qualified" }),
      PropertyInquiry.countDocuments({ status: "Site Visit" }),
      PropertyInquiry.countDocuments({ status: "Converted" }),
      PropertyInquiry.countDocuments({ status: "Closed" }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        new: newCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        siteVisits: siteVisitCount,
        converted: convertedCount,
        closed: closedCount,
      },
      inquiries,
      count: inquiries.length,
    });
  } catch (error) {
    console.error("Admin inquiries API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Inquiries load nahi ho paayi.",
      },
      { status: 500 }
    );
  }
}