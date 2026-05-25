import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      console.log(res.data.data);

      set((prevState) => ({
        products: [...prevState.products, res.data.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });

    try {
      const res = await axiosInstance.get("/products");
      console.log(res.data);

      set({ products: res.data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.error || "failed to fetch products");
    }
  },

  deleteProduct: async (id) => {},
  toggleFeaturedProduct: async (id) => {},
}));
