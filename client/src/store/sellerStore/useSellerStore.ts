import { create } from "zustand";
import type { Item, Order, Shop } from "../../types/prisma";
import toast from "react-hot-toast";

interface SellerState {
  isAddingStoreItem: boolean;
  getShop: () => Promise<void>;
  addStoreItem: (formData: any) => Promise<void>;
  deleteStoreItem: (shopId: string, id: number) => Promise<void>;
  editStoreItem: (shopId: string, id: number, formData: any) => Promise<void>;
  shop: (Shop & { items: Item[]; orders: Order[]; _count: { items: number; orders: number } }) | null;
}

export const useSellerStore = create<SellerState>((set, get) => ({
  shop: null,
  isAddingStoreItem: false,

  getShop: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seller/shop", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      set({ shop: data.data });
    } catch (error) {
      console.error("Error in getShop(seller) store", error);
    }
  },

  addStoreItem: async (formData: any) => {
    set({ isAddingStoreItem: true });
    try {
      const response = await fetch("http://localhost:5000/api/seller/shop/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      get().getShop();
    } catch (error) {
      console.error("Error in addStoreItem(seller) store", error);
    } finally {
      set({ isAddingStoreItem: false });
    }
  },

  deleteStoreItem: async (shopId: string, id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/shop/delete/${shopId}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Deleted an item.");
      get().getShop();
    } catch (error) {
      console.error("Error in addStoreItem(seller) store", error);
    }
  },

  editStoreItem: async (shopId: string, id: number, formData: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seller/shop/edit/${shopId}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Edited an item.");
      get().getShop();
    } catch (error) {
      console.error("Error in editStoreItem(seller) store", error);
    }
  },
}));
