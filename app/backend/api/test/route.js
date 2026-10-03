import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import AdminUser from "../../models/AdminUser";
import Property from "../../models/Property";


export async function GET() {
  try {
    await connectDB();

    let data = await Property.find()

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully 🚀",
      AdminUser: data
    });
  } catch (error) {
    console.error("MongoDB Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}