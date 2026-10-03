import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing");
}

// =========================================
// CREATE ADMIN JWT
// =========================================

export function createAdminToken(admin) {
  return jwt.sign(
    {
      adminId: admin._id.toString(),
      email: admin.email,
      role: "admin",
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// =========================================
// VERIFY JWT
// =========================================

export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    // Role check
    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// =========================================
// GET CURRENT ADMIN
// =========================================

export async function getCurrentAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  const decoded =
    verifyAdminToken(token);

  if (!decoded) {
    return null;
  }

  return decoded;
}