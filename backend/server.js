import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import couponRoute from "./routes/coupon.route.js";
import paymentRoute from "./routes/payment.route.js";
import analyticsRoute from "./routes/analytics.route.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method}, ${req.url}`);
  next();
});

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/analytics", analyticsRoute);

app.listen(PORT, async () => {
  try {
    connectDB();

    console.log(`server is listening on port ${PORT}`);
  } catch (error) {}
});
