import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/mongodb";
import AdminUser from "../../../models/AdminUser";


export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Only ONE admin allowed
    const existingAdmin =
      await AdminUser.findOne({});

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin account already exists. Signup is disabled.",
        },
        {
          status: 403,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const admin = await AdminUser.create({
      name: name.trim(),
      email: "indiandeveloper25@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ADMIN SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Admin signup failed",
      },
      {
        status: 500,
      }
    );
  }
}