"use client";

import { create } from "zustand";
import { AdminProfile } from "../domain/models";
import { AdminService } from "../services/admin.service";

interface AdminAuthState {
  token: string | null;
  admin: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonStr =
      typeof window !== "undefined" && typeof window.atob === "function"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    const decoded = JSON.parse(jsonStr);
    if (!decoded.exp) return false;
    return decoded.exp <= Math.floor(Date.now() / 1000) + 10;
  } catch {
    return true;
  }
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem("savee_admin_token");
      const profileStr = localStorage.getItem("savee_admin_profile");
      if (token && profileStr && !isTokenExpired(token)) {
        const admin = JSON.parse(profileStr) as AdminProfile;
        set({
          token,
          admin,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      if (token || profileStr) {
        localStorage.removeItem("savee_admin_token");
        localStorage.removeItem("savee_admin_profile");
      }
    } catch {
      // Ignore JSON parse errors
    }

    set({ token: null, admin: null, isAuthenticated: false, isLoading: false });
  },

  login: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await AdminService.login(email, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("savee_admin_token", response.access_token);
        localStorage.setItem("savee_admin_profile", JSON.stringify(response.admin));
      }
      set({
        token: response.access_token,
        admin: response.admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to authenticate with Savee Atelier credentials",
      });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("savee_admin_token");
      localStorage.removeItem("savee_admin_profile");
    }
    set({
      token: null,
      admin: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
