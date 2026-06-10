import toast from "react-hot-toast";
import { create } from "zustand";
import type { Item, Shop } from "../types/prisma";
import { API_URL } from "../lib/utils";

interface ShopTypes {
  isCreatingShop: boolean;
  fetchingShop: boolean;
  shop: (Shop & { items: Item[] }) | null;
  createShop: (formData: any) => Promise<void>;
  getShopItems: (shopName: string) => Promise<void>;
}

export const useShopStore = create<ShopTypes>((set) => ({
  isCreatingShop: false,
  fetchingShop: false,
  shop: null,

  createShop: async (formData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/shop/create`, {
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

  getShopItems: async (shopName: string) => {
    set({ fetchingShop: true });
    try {
      const response = await fetch(`${API_URL}/api/shop/${shopName}/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        toast.error("Could not get shop items");
        return;
      }

      set({ shop: data.data });
    } catch (error) {
      console.error("Error in getShopItems store", error);
    } finally {
      set({ fetchingShop: false });
    }
  },
}));
