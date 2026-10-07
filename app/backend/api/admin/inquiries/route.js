
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import PropertyInquiry from "../../../models/Enquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const requestId = Math.random().toString(36).slice(2, 8);

  console.log(`\n========== [INQUIRIES API ${requestId}] START ==========`);

  try {
    // CHECKPOINT 1: Request received
    console.log(`[${requestId}] CHECKPOINT 1: API called`);
    console.log(`[${requestId}] URL:`, request.url);

    // CHECKPOINT 2: Connect database
    await connectDB();

    console.log(`[${requestId}] CHECKPOINT 2: Database connected`);

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") || "All";
    const search = (searchParams.get("search") || "").trim();

    // CHECKPOINT 3: Pagination
    const parsedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );

    if (!Number.isSafeInteger(parsedPage) || parsedPage < 1) {
      console.error(`[${requestId}] Invalid page:`, parsedPage);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid page number.",
        },
        { status: 400 }
      );
    }

    const page = parsedPage;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!Number.isSafeInteger(skip)) {
      console.error(`[${requestId}] Invalid skip:`, skip);

      return NextResponse.json(
        {
          success: false,
          message: "Page number is too large.",
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] CHECKPOINT 3: Pagination`, {
      page,
      limit,
      skip,
    });

    // CHECKPOINT 4: Validate status
    const allowedStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Site Visit",
      "Converted",
      "Closed",
    ];

    if (status !== "All" && !allowedStatuses.includes(status)) {
      console.error(`[${requestId}] Invalid status:`, status);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid inquiry status.",
        },
        { status: 400 }
      );
    }

    // CHECKPOINT 5: Build filters
    const filter = {};

    if (status !== "All") {
      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { name: regex },
        { phone: regex },
        { email: regex },
        { propertyTitle: regex },
        { propertyLocation: regex },
        { budget: regex },
        { purpose: regex },
      ];
    }

    console.log(`[${requestId}] CHECKPOINT 5: Filters`, {
      status,
      searchApplied: Boolean(search),
      filterKeys: Object.keys(filter),
    });

    // CHECKPOINT 6: Fetch inquiries and dashboard statistics
    const [
      inquiries,
      filteredTotal,
      total,
      newCount,
      contactedCount,
      qualifiedCount,
      siteVisitCount,
      convertedCount,
      closedCount,
    ] = await Promise.all([
      PropertyInquiry.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          [
            "name",
            "phone",
            "email",
            "propertyId",
            "propertyTitle",
            "propertyPrice",
            "propertyLocation",
            "purpose",
            "budget",
            "message",
            "status",
            "source",
            "assignedTo",
            "adminNotes",
            "createdAt",
            "updatedAt",
          ].join(" ")
        )
        .lean(),

      PropertyInquiry.countDocuments(filter),

      // Overall dashboard statistics
      PropertyInquiry.countDocuments(),
      PropertyInquiry.countDocuments({ status: "New" }),
      PropertyInquiry.countDocuments({ status: "Contacted" }),
      PropertyInquiry.countDocuments({ status: "Qualified" }),
      PropertyInquiry.countDocuments({ status: "Site Visit" }),
      PropertyInquiry.countDocuments({ status: "Converted" }),
      PropertyInquiry.countDocuments({ status: "Closed" }),
    ]);

    console.log(`[${requestId}] CHECKPOINT 6: Database query result`, {
      requestedPage: page,
      requestedLimit: limit,
      calculatedSkip: skip,
      returnedRecords: inquiries.length,
      matchingRecords: filteredTotal,
      totalDatabaseRecords: total,
      returnedIds: inquiries.map((item) => String(item._id)),
    });

    // CHECKPOINT 7: Pagination metadata
    const hasMore = skip + inquiries.length < filteredTotal;
    const nextPage = hasMore ? page + 1 : null;

    console.log(`[${requestId}] CHECKPOINT 7: Pagination result`, {
      page,
      limit,
      skip,
      returnedRecords: inquiries.length,
      hasMore,
      nextPage,
    });

    // CHECKPOINT 8: Prepare response
    const responseData = {
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

      pagination: {
        page,
        limit,
        total: filteredTotal,
        hasMore,
        nextPage,
      },
    };

    console.log(`[${requestId}] CHECKPOINT 8: Sending response`, {
      count: responseData.count,
      page: responseData.pagination.page,
      limit: responseData.pagination.limit,
      total: responseData.pagination.total,
      hasMore: responseData.pagination.hasMore,
      nextPage: responseData.pagination.nextPage,
    });

    console.log(
      `========== [INQUIRIES API ${requestId}] END ==========\n`
    );

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error(`[INQUIRIES API ${requestId}] ERROR:`, error);

    return NextResponse.json(
      {
        success: false,
        message: "Inquiries load nahi ho paayi.",
      },
      { status: 500 }
    );
  }
}

