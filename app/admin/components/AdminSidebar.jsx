"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
Home,
LayoutDashboard,
Building2,
ListChecks,
Sparkles,
UserRound,
PhoneCall,
LogOut,
Menu,
X,
ExternalLink,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAdminAuthStore } from "../../../RTK/store/Zustand/useAdminAuthStore";

const adminLinks = [
{
name: "Dashboard",
href: "/admin/dashboard",
icon: LayoutDashboard,
},
{
name: "Properties",
href: "/admin/properties",
icon: Building2,
},
{
name: "Property Listings",
href: "/admin/properties_List",
icon: ListChecks,
},
{
name: "AI Analytics",
href: "/admin/ai-analytics",
icon: Sparkles,
},
{
name: "My Profile",
href: "/admin/profile",
icon: UserRound,
},
];

export default function AdminSidebar() {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isLoggingOut, setIsLoggingOut] = useState(false);

const pathname = usePathname();
const router = useRouter();

const { admin, isAuthenticated, clearAdmin } = useAdminAuthStore();

const adminName =
admin?.name ||
admin?.displayName ||
admin?.email?.split("@")[0] ||
"Admin";

const adminEmail = admin?.email || "Administrator";

// Lock background scrolling while the drawer is open.
useEffect(() => {
document.body.style.overflow = isSidebarOpen ? "hidden" : "";


return () => {
  document.body.style.overflow = "";
};


}, [isSidebarOpen]);

// Close drawer using Escape.
useEffect(() => {
const handleKeyDown = (event) => {
if (event.key === "Escape") {
setIsSidebarOpen(false);
}
};


window.addEventListener("keydown", handleKeyDown);

return () => {
  window.removeEventListener("keydown", handleKeyDown);
};


}, []);

const closeSidebar = () => setIsSidebarOpen(false);

const handleLogout = async () => {
if (isLoggingOut) return;


const result = await Swal.fire({
  title: "Logout?",
  text: "Are you sure you want to logout from your admin account?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, Logout",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#2563eb",
  cancelButtonColor: "#64748b",
  reverseButtons: true,
});

if (!result.isConfirmed) return;

setIsLoggingOut(true);

try {
  const response = await fetch("/backend/api/admin/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout request failed");
  }

  clearAdmin();
  closeSidebar();

  await Swal.fire({
    title: "Logged out",
    text: "You have been logged out successfully.",
    icon: "success",
    timer: 1200,
    showConfirmButton: false,
  });

  router.replace("/auth/login");
  router.refresh();
} catch (error) {
  console.error("Admin logout error:", error);

  Swal.fire({
    title: "Logout failed",
    text: "Please try again.",
    icon: "error",
    confirmButtonColor: "#2563eb",
  });
} finally {
  setIsLoggingOut(false);
}


};

return (
<>
{/* ================= ADMIN TOP NAVBAR ================= */} <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md"> <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
{/* LOGO */} <Link
         href="/admin/dashboard"
         className="group flex items-center gap-2"
       > <div className="rounded-xl bg-blue-600 p-2 text-white transition group-hover:bg-blue-700"> <Home className="h-6 w-6" /> </div>

        <div>
          <span className="text-xl font-black tracking-tight text-blue-900 sm:text-2xl">
            Dream<span className="text-blue-600">Home</span>
          </span>

          <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
            Admin Management Panel
          </p>
        </div>
      </Link>

      {/* DESKTOP ADMIN NAVIGATION */}
      <nav className="hidden items-center gap-6 text-sm font-medium xl:flex">
        {adminLinks.slice(0, 4).map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 transition ${
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <a
          href="tel:+919876543210"
          className="hidden items-center gap-2 border-r border-slate-200 pr-4 xl:flex"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <PhoneCall className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800">
              +91 98765 43210
            </p>
            <p className="text-[10px] text-slate-400">
              Admin Support
            </p>
          </div>
        </a>

        {/* ADMIN PROFILE */}
        <Link
          href="/admin/profile"
          className="hidden items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-50 sm:flex"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <UserRound className="h-5 w-5" />
          </div>

          <div className="hidden max-w-[130px] text-left md:block">
            <p className="truncate text-sm font-semibold text-slate-800">
              {adminName}
            </p>
            <p className="text-[10px] text-slate-400">
              Admin Account
            </p>
          </div>
        </Link>

        {/* DRAWER BUTTON */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={isSidebarOpen}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  </header>

  {/* ================= OVERLAY ================= */}
  <button
    type="button"
    aria-label="Close admin menu overlay"
    onClick={closeSidebar}
    className={`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
      isSidebarOpen
        ? "pointer-events-auto opacity-100"
        : "pointer-events-none opacity-0"
    }`}
  />

  {/* ================= RIGHT SIDE ADMIN DRAWER ================= */}
  <aside
    aria-label="Admin navigation"
    aria-hidden={!isSidebarOpen}
    className={`fixed right-0 top-0 z-[60] flex h-[100dvh] w-[88%] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[380px] ${
      isSidebarOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    {/* DRAWER HEADER */}
    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5">
      <Link
        href="/admin/dashboard"
        onClick={closeSidebar}
        className="flex min-w-0 items-center gap-2"
      >
        <div className="rounded-xl bg-blue-600 p-2 text-white">
          <Home className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <span className="text-xl font-black tracking-tight text-blue-900">
            Dream<span className="text-blue-600">Home</span>
          </span>

          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Admin Management Panel
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={closeSidebar}
        aria-label="Close admin menu"
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-6 w-6" />
      </button>
    </div>

    {/* SCROLLABLE CONTENT */}
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
      {/* ADMIN PROFILE CARD */}
      <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <UserRound className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">
              Welcome back
            </p>

            <p className="truncate text-sm font-bold text-slate-800">
              {adminName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {adminEmail}
            </p>
          </div>
        </div>

        <Link
          href="/admin/profile"
          onClick={closeSidebar}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
        >
          <UserRound className="h-4 w-4" />
          My Admin Profile
        </Link>
      </div>

      {/* ADMIN ROUTES ONLY */}
      <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Admin Menu
      </p>

      <nav className="space-y-2">
        {adminLinks.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span className="min-w-0 flex-1">
                {item.name}
              </span>

              {isActive && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* PUBLIC WEBSITE */}
      <div className="mt-5 border-t border-slate-100 pt-5">
        <Link
          href="/"
          onClick={closeSidebar}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View Public Website
        </Link>
      </div>
    </div>

    {/* FIXED DRAWER FOOTER */}
    <div className="z-10 shrink-0 border-t border-slate-200 bg-slate-50 p-3 sm:p-5">
      <a
        href="tel:+919876543210"
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-200"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <PhoneCall className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800">
            +91 98765 43210
          </p>
          <p className="text-[11px] text-slate-400">
            Contact Admin Support
          </p>
        </div>
      </a>

      {isAuthenticated && (
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-white py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      )}

      <p className="mt-3 text-center text-[10px] text-slate-400">
        © {new Date().getFullYear()} DreamHome Admin
      </p>
    </div>
  </aside>
</>


);
}
