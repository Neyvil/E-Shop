import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoutes.js";
import configureCloudinary from "./config/cloudinary.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
configureCloudinary();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["https://e-shop-frontend-f1803luwb-neyvils-projects.vercel.app"], 
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

app.listen(port, () => console.log(`Server running on port: ${port}`));
