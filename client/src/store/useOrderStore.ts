import toast from "react-hot-toast";
import { create } from "zustand";
import { API_URL } from "../lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  priceAtTime: string | number;
  quantity: number;
  item?: {
    image: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: string | number;
  status: string;
  createdAt: string;
  shop: {
    name: string;
  };
  orderItems: OrderItem[];
}

interface OrderState {
  orders: Order[];
  error: string | null;
  isFetchingOrders: boolean;
  isPlacingOrder: boolean;
  getProfileOrders: () => Promise<void>;
  placeOrder: (getCart: any) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  error: null,
  isFetchingOrders: false,
  isPlacingOrder: false,

  getProfileOrders: async () => {
    set({ isFetchingOrders: true });
    try {
      const response = await fetch(`${API_URL}/api/order/profile/orders`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        set({ orders: data.data });
      } else {
        set({ error: "Failed to fetch orders" });
      }
    } catch (error) {
      console.error("Error in placeOrder store", error);
    } finally {
      set({ isFetchingOrders: false });
    }
  },

  placeOrder: async (getCart: any) => {
    set({ isPlacingOrder: true });
    try {
      const response = await fetch(`${API_URL}/api/order`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!data.success) {
        return;
      }

      await getCart();
      get().getProfileOrders();
      toast.success(data.message);
    } catch (error) {
      console.error("Error in placeOrder store", error);
    } finally {
      set({ isPlacingOrder: false });
    }
  },
}));
