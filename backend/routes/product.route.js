import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProduct,
  deleteProduct,
  getRecommendations,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controller/product.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", protectRoute, getRecommendations);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
