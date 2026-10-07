"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useAdminLoginMutation } from "../../../RTK/services/auth";
import { useAdminAuthStore } from "../../../RTK/store/Zustand/useAdminAuthStore";

export default function page() {
  const router = useRouter();

  const [
    adminLogin,
    { isLoading },
  ] = useAdminLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


const {setAdmin} = useAdminAuthStore()




const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!form.email || !form.password) {
    setError(
      "Please enter email and password."
    );
    return;
  }

  try {
    const result =
      await adminLogin({
        email: form.email
          .trim()
          .toLowerCase(),
        password: form.password,
      }).unwrap();

    // =====================================
    // SAVE ADMIN DATA IN ZUSTAND
    // =====================================

    setAdmin(result.admin);

    setSuccess(
      result.message ||
        "Login successful."
    );

    // =====================================
    // REDIRECT
    // =====================================

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 500);
  } catch (error) {
    setError(
      error?.data?.message ||
        "Invalid email or password."
    );
  }
};
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid md:grid-cols-2">

          {/* LEFT */}
          <div className="hidden md:flex bg-slate-900 p-10 text-white flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Building2 size={24} />
                </div>

                <div>
                  <h2 className="font-bold text-xl">
                    DreamHome
                  </h2>

                  <p className="text-xs text-slate-400">
                    Admin Dashboard
                  </p>
                </div>
              </div>

              <div className="mt-24">
                <p className="text-sm font-semibold text-blue-400">
                  ADMIN PORTAL
                </p>

                <h1 className="mt-3 text-4xl font-bold leading-tight">
                  Welcome
                  <br />
                  back.
                </h1>

                <p className="mt-5 max-w-sm text-slate-400 leading-7">
                  Manage your properties,
                  enquiries and real-estate
                  business from one secure
                  dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <ShieldCheck
                size={18}
                className="text-blue-400"
              />

              Secure administrator access
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 sm:p-10 flex items-center">
            <div className="mx-auto w-full max-w-md">

              {/* MOBILE BRAND */}
              <div className="md:hidden mb-9 flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Building2 size={24} />
                </div>

                <div>
                  <h2 className="font-bold text-xl text-slate-900">
                    DreamHome
                  </h2>

                  <p className="text-xs text-slate-500">
                    Admin Panel
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <ShieldCheck size={14} />
                  Administrator
                </div>

                <h1 className="mt-4 text-3xl font-bold text-slate-900">
                  Admin Login
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to manage your DreamHome
                  website.
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@gmail.com"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  First-time administrator?
                </p>

            
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Only the registered administrator
                can access this dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}