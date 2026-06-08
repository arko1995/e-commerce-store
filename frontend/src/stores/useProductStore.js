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

      set((prevState) => ({
        products: [...prevState.products, res.data.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });

    try {
      const res = await axiosInstance.get("/products");

      set({ products: res.data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      toast.error(error.response?.data?.error || "failed to fetch products");
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${id}`);

      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false, error: "Failed to delete product" });
      toast.error(error.response?.data?.error || "Failed to delete product");
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to toggle featured products", loading: false });
      toast.error(error.response?.data?.error);
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/products/category/${category}`);

      set({
        products: res.data.data,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: "Error getting products by category" });
      toast.error(
        error.response?.data?.error || "Error getting products by category",
      );
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/products/featured");

      set({ products: response.data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log(error.message);
    }
  },
}));
