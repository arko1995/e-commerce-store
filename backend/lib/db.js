import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connection host : ${conn.connection.host}`);
  } catch (error) {
    console.log("error connecting to MongoDb", error);
    process.exit(1);
  }
};
