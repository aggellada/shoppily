import toast from "react-hot-toast";
import { create } from "zustand";
import type { Item } from "../types/prisma";

interface ItemState {
  allItems: Item[] | [];
  searchingItems: boolean;
  isFetchingItemDetails: boolean;
  isGettingAllItems: boolean;
  itemDetails: (Item & { shop: { id: string } }) | null;
  getItems: () => Promise<void>;
  searchItems: (itemName: string) => Promise<void>;
  getItem: (itemId: string) => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
  allItems: [],
  searchingItems: false,
  isGettingAllItems: false,
  isFetchingItemDetails: false,
  itemDetails: null,

  getItems: async () => {
    set({ isGettingAllItems: true });
    try {
      const response = await fetch("http://localhost:5000/api/item/get/items");

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
      }

      set({ allItems: data.data });
    } catch (error) {
      console.error("Error in getItems store", error);
    } finally {
      set({ isGettingAllItems: false });
    }
  },

  searchItems: async (itemName: string) => {
    set({ searchingItems: true });
    try {
      const response = await fetch(`http://localhost:5000/api/item/search?itemName=${itemName}`);

      const data = await response.json();

      if (data.success) {
        set({ allItems: data.data });
      }
    } catch (error) {
      console.error("Error in searchItems store", error);
    } finally {
      set({ searchingItems: false });
    }
  },

  getItem: async (itemId: string) => {
    set({ isFetchingItemDetails: true });
    try {
      const response = await fetch(`http://localhost:5000/api/item/get/item?itemId=${itemId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      set({ itemDetails: data.data });
    } catch (error) {
      console.error("Error in getItem store", error);
    } finally {
      set({ isFetchingItemDetails: false });
    }
  },
}));
