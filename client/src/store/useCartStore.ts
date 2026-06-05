import toast from "react-hot-toast";
import { create } from "zustand";
import type { Cart, CartItem, Item } from "../types/prisma";

interface CartStoreType {
  cart: (Cart & { items: (CartItem & { item: Item })[] }) | null;
  addingToCart: boolean;
  isFetchingUserCart: boolean;
  cartQuantity: any;
  getCart: () => Promise<void>;
  addToCart: (shopId: string, itemId: number) => Promise<void>;
  incrementItemCartQty: (shopId: string, itemId: number) => Promise<void>;
  decrementItemCartQty: (shopId: string, itemId: number) => Promise<void>;
  getCartItemsTotalQuantity: () => Promise<void>;
  deleteCartItem: (shopId: string, itemId: number) => Promise<void>;
}

export const useCartStore = create<CartStoreType>((set, get) => ({
  addingToCart: false,
  isFetchingUserCart: false,
  cart: null,
  cartQuantity: 0,

  addToCart: async (shopId: string, itemId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${shopId}/add?itemId=${itemId}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        throw new Error(data.message);
      }

      get().getCartItemsTotalQuantity();
      get().getCart();
      toast.success(data.message);
    } catch (error) {
      console.error("error in addToCart store", error);
    }
  },

  getCart: async () => {
    set({ isFetchingUserCart: true });
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        set({ cart: data.data });
      }
    } catch (error) {
      console.error("error in getCart store", error);
    } finally {
      set({ isFetchingUserCart: false });
    }
  },

  incrementItemCartQty: async (shopId: string, itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/increment?shopId=${shopId}&itemId=${itemId}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        set({ cart: data.data });
      }
    } catch (error) {
      console.error("error in incrementItemCartQty store", error);
    }
  },

  decrementItemCartQty: async (shopId: string, itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/decrement?shopId=${shopId}&itemId=${itemId}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        set({ cart: data.data });
      }
    } catch (error) {
      console.error("error in incrementItemCartQty store", error);
    }
  },

  deleteCartItem: async (shopId: string, itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/delete?shopId=${shopId}&itemId=${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.success) {
        get().getCartItemsTotalQuantity();
        set({ cart: data.data });
        toast.success(data.message);
      }
    } catch (error) {
      console.error("error in incrementItemCartQty store", error);
    }
  },

  getCartItemsTotalQuantity: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart/total", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      set({ cartQuantity: data.data });
    } catch (error) {
      console.error("error in getCartItemsTotalQuantity store", error);
    }
  },
}));
