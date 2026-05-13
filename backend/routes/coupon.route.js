import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon } from "../controller/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);

export default router;
