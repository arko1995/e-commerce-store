import Product from "../model/product.model.js";
import { redis } from "../lib/redis.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "There are no products in the database",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched from DB",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log(req.body);

    const { name, description, image, price, category, isFeatured } = req.body;

    if (!name || !description || !image || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "PLease Provide all the necessary information",
      });
    }

    const product = await Product.create({
      name,
      description,
      image,
      price,
      category,
      isFeatured,
    });

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFeaturedProduct = async (req, res) => {
  try {
    //get the product from cache

    const cachedProducts = await redis.get("featuredProducts");

    if (cachedProducts) {
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: JSON.parse(cachedProducts),
      });
    }

    //if not in cache, fetch it from mongodb

    const products = await Product.find({ isFeatured: true }).lean();

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No featured products at the moment",
        data: [],
      });
    }

    //update cache

    await redis.set("featuredProducts", JSON.stringify(products));

    res.status(200).json({
      success: true,
      message: "products fetched successfully",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createProduct, getAllProducts, getFeaturedProduct };
