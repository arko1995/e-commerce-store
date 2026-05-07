import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProduct,
} from "../controller/product.controller.js";

import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProduct);
router.post("/", protectRoute, adminRoute, createProduct);

export default router;
