import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";

const CategoryPage = () => {
  const { fetchProductsByCategory, loading, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category, fetchProductsByCategory]);

  console.log(products);

  return <h1>Category:</h1>;
};

export default CategoryPage;
