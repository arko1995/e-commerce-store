import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controller/cart.controller.js";

const router = express.Router();

router.post("/", protectRoute, addToCart);
router.get("/", protectRoute, getCartProducts);
router.delete("/:id", protectRoute, removeAllFromCart);
router.put(
  "/:id",
  protectRoute,
  (req, res, next) => {
    console.log(req.params);
    next();
  },
  updateQuantity,
);

export default router;
