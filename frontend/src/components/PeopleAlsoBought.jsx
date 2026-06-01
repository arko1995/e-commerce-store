import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const fetchRecommendations = async () => {
        const res = await axiosInstance.get("/products/recommendations");
        setRecommendations(res.data.data);
      };

      fetchRecommendations();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "An error occurred while fetching recommended products",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);
  if (isloading) return <Loader />;
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
