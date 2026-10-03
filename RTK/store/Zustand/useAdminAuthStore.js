"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,

      // ================================
      // LOGIN
      // ================================

      setAdmin: (admin) => {
        set({
          admin,
          isAuthenticated: true,
        });
      },

      // ================================
      // LOGOUT
      // ================================

      clearAdmin: () => {
        set({
          admin: null,
          isAuthenticated: false,
        });
      },

      // ================================
      // UPDATE ADMIN
      // ================================

      updateAdmin: (admin) => {
        set({
          admin,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "dreamhome-admin-auth",
    }
  )
);