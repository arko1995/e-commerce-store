import Product from "../model/product.model.js";
import cloudinary from "../lib/cloudinary.js";
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
    const { name, description, image, price, category, isFeatured } = req.body;

    let cloudinaryResponse = null;

    if (!name || !description || !image || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please Provide all the necessary information",
      });
    }
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        asset_folder: "products",
        use_asset_folder_as_public_id_prefix: true,
      });
    }

    const product = await Product.create({
      name,
      description,
      image: cloudinaryResponse ? cloudinaryResponse.secure_url : "",
      cloudinaryId: cloudinaryResponse?.public_id,
      price,
      category,
      isFeatured,
    });

    res.status(201).json({
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

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      try {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
    }

    if (product.isFeatured) {
      await redis.del("featuredProducts");
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, image: 1, price: 1, description: 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "random data fetched",
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

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category });

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No products in the selected category",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
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

const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (product) {
      product.isFeatured = !product.isFeatured;

      const updatedProduct = await product.save();
      await updateFeaturedProduct();
    } else {
      console.log("Product not found");
    }

    res.status(200).json({
      success: true,
      message: "Feature toggled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateFeaturedProduct = async () => {
  const product = await Product.find({ isFeatured: true }).lean();
  await redis.set("featuredProducts", JSON.stringify(product));
};

export {
  createProduct,
  getAllProducts,
  getFeaturedProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toggleFeaturedProduct,
};
