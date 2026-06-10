import toast from "react-hot-toast";
import { create } from "zustand";
import { API_URL } from "../lib/utils";

interface AuthType {
  authUser: any;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  login: (formData: any) => Promise<void>;
  signup: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthType>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        set({ authUser: data.data });
      } else {
        set({ authUser: null });
      }
    } catch (error) {
      console.error("Error in login store", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (formData: any) => {
    set({ isLoggingIn: true });
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        throw new Error(data.message);
      }

      set({ authUser: data.data });
      toast.success(data.message);
    } catch (error) {
      console.error("Error in login store", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();
      set({ authUser: null });
      toast.success(data.message);
    } catch (error) {
      console.error("Error in logout store", error);
    }
  },

  signup: async (formData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error in login store", error);
    }
  },
}));
