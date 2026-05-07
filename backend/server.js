import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

app.listen(PORT, async () => {
  try {
    connectDB();

    console.log(`server is listening on port ${PORT}`);
  } catch (error) {}
});
