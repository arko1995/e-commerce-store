import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({ user: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      set({ user: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  checkAuth: async () => {
    try {
      set({ checkingAuth: true });

      const res = await axiosInstance.get("/auth/profile");

      set({ user: res.data.data, checkingAuth: false });
    } catch (error) {
      console.log(error.message);

      set({ checkingAuth: false, user: null });
    }
  },

  logOut: async () => {
    try {
      set({ loading: true });
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
}));

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; //error.config contains the configuration of a failed http request

    if(error.response?.status === 401){
      
    }
  },
);
