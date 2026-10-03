import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("admin_token")?.value;

  // =========================================
  // PUBLIC ADMIN ROUTES
  // =========================================

  const isAdminLogin =
    pathname === "/admin/login";

  const isAdminSignup =
    pathname === "/admin/signup";

  // Login and Signup public rahenge
  if (isAdminLogin || isAdminSignup) {
    return NextResponse.next();
  }

  // =========================================
  // PROTECTED ADMIN ROUTES
  // =========================================

  const isAdminDashboard =
    pathname === "/admin/dashboard" ||
    pathname.startsWith("/admin/dashboard/");

  if (isAdminDashboard) {
    // Token nahi hai
    if (!token) {
      const loginUrl = new URL(
        "/admin/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    // Token present hai
    return NextResponse.next();
  }

  // =========================================
  // OTHER ADMIN ROUTES
  // =========================================

  if (pathname.startsWith("/admin/")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/auth/login",
          request.url
        )
      );
    }

    return NextResponse.next();
  }

  // =========================================
  // PUBLIC WEBSITE
  // =========================================

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};