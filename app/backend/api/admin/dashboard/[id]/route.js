
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";

import Property from "../../../../models/Property";
import PropertyInquiry from "../../../../models/Enquiry";
import AdminUser from "../../../../models/AdminUser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_DAYS = [7, 30, 90];

function getDateKey(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getStartOfDayIST(date) {
  const key = getDateKey(date);
  return new Date(`${key}T00:00:00+05:30`);
}

function getPreviousPeriodStart(startDate, days) {
  return new Date(startDate.getTime() - days * 86400000);
}

export async function GET(request, { params }) {
  try {

    console.log('api admin AdminDashboard')
    // Dynamic route: /api/admin/dashboard/7
    const { id } = await params;
    const requestedDays = Number(id);

    if (!ALLOWED_DAYS.includes(requestedDays)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid days. Use 7, 30, or 90.",
        },
        { status: 400 }
      );
    }

    // IMPORTANT:
    // Add your existing admin authentication/session guard here.
    // Do not expose private dashboard data publicly.

    await connectDB();

    const days = requestedDays;
    const now = new Date();
    const startDate = getStartOfDayIST(now);

    const previousStart = getPreviousPeriodStart(startDate, days);
    const previousEnd = startDate;

    const [
      totalProperties,
      totalInquiries,
      activeAdmins,
      propertyStatuses,
      listingTypes,
      propertyTypes,
      cityStats,
      inquiryStatuses,
      inquirySources,
      recentProperties,
      recentInquiries,
      dailyProperties,
      dailyInquiries,
      totalViews,
      previousProperties,
      previousInquiries,
    ] = await Promise.all([
      Property.countDocuments(),

      PropertyInquiry.countDocuments(),

      AdminUser.countDocuments({ isActive: true }),

      Property.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Property.aggregate([
        {
          $group: {
            _id: "$listingType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Property.aggregate([
        {
          $group: {
            _id: "$propertyType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Property.aggregate([
        {
          $group: {
            _id: {
              city: "$location.city",
              state: "$location.state",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      PropertyInquiry.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      PropertyInquiry.aggregate([
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Property.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "title price propertyType listingType status location coverImage createdAt views"
        )
        .lean(),

      PropertyInquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name phone email propertyId propertyTitle status source purpose createdAt"
        )
        .lean(),

      Property.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      PropertyInquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: now },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),

      Property.aggregate([
        {
          $group: {
            _id: null,
            views: { $sum: { $ifNull: ["$views", 0] } },
          },
        },
      ]),

      Property.countDocuments({
        createdAt: { $gte: previousStart, $lt: previousEnd },
      }),

      PropertyInquiry.countDocuments({
        createdAt: { $gte: previousStart, $lt: previousEnd },
      }),
    ]);

    // Daily chart data, including dates with zero activity.
    const propertyMap = new Map(
      dailyProperties.map((item) => [item._id, item.count])
    );

    const inquiryMap = new Map(
      dailyInquiries.map((item) => [item._id, item.count])
    );

    const activity = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(
        startDate.getTime() + i * 86400000
      );

      const key = getDateKey(date);

      activity.push({
        date: key,
        properties: propertyMap.get(key) || 0,
        inquiries: inquiryMap.get(key) || 0,
      });
    }

    const statusCounts = Object.fromEntries(
      propertyStatuses.map(({ _id, count }) => [_id, count])
    );

    const inquiryStatusCounts = Object.fromEntries(
      inquiryStatuses.map(({ _id, count }) => [_id, count])
    );

    return NextResponse.json({
      success: true,
      generatedAt: now.toISOString(),
      filters: { days },

      summary: {
        totalProperties,
        totalInquiries,
        activeAdmins,
        totalViews: totalViews[0]?.views || 0,
        pendingProperties: statusCounts.pending || 0,
        approvedProperties: statusCounts.approved || 0,
        newInquiries: inquiryStatusCounts.New || 0,

        previousPeriod: {
          properties: previousProperties,
          inquiries: previousInquiries,
        },
      },

      propertyAnalytics: {
        statuses: propertyStatuses.map(({ _id, count }) => ({
          status: _id || "Unknown",
          count,
        })),

        listingTypes: listingTypes.map(({ _id, count }) => ({
          type: _id || "Unknown",
          count,
        })),

        propertyTypes: propertyTypes.map(({ _id, count }) => ({
          type: _id || "Unknown",
          count,
        })),

        topCities: cityStats.map(({ _id, count }) => ({
          city: _id.city || "Unknown",
          state: _id.state || "",
          count,
        })),
      },

      inquiryAnalytics: {
        statuses: inquiryStatuses.map(({ _id, count }) => ({
          status: _id || "Unknown",
          count,
        })),

        sources: inquirySources.map(({ _id, count }) => ({
          source: _id || "Unknown",
          count,
        })),
      },

      activity,
      recentProperties,
      recentInquiries,
    });
  } catch (error) {
    console.error("Admin dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load dashboard data",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
