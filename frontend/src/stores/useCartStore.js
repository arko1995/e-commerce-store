import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/cart");

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
        const existingItem = state.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? state.cart.map((item) =>
              item._id === product._id
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

  removeFromCart: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/cart/${productId}`);
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      toast.success("Product removed from cart successfully");
      get().calculateTotals();
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.error || "Error deleting product from cart",
      );
    }
  },

  updateQuantity: async (productId, quantity) => {
    console.log(productId);

    set({ loading: true });
    try {
      if (quantity === 0) {
        await get().removeFromCart(productId);
        return;
      }
      await axiosInstance.put(`/cart/${productId}`, { quantity: quantity });

      set((prev) => ({
        cart: prev.cart.map((product) =>
          product._id === productId ? { ...product, quantity } : product,
        ),
      }));
      get().calculateTotals();

      set({ loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating quantity");
    }
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subTotal: 0 });
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
