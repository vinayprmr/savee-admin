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
      if (token && profileStr) {
        const admin = JSON.parse(profileStr) as AdminProfile;
        set({
          token,
          admin,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
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
