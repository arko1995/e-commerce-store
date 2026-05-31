import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { CornerUpLeft } from "lucide-react";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  coupon: null,
  total: 0,
  subTotal: 0,

  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/cart");
      console.log(res.data.data);

      set({ cart: res.data.data, loading: false });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [], loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  addCartItems: async (product) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((state) => {
        const existingItem = state.cart.find((item) => item.id === product._id);
        const newCart = existingItem
          ? state.cart.map((item) =>
              item.id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...state.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });
      get().calculateTotals();
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);

      toast.error(error.response?.data?.error || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let total = subTotal;

    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }
    set({ total, subTotal });
  },
}));
