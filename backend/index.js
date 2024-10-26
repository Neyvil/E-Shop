







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

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(
  cors({
    origin: ["https://e-shopfrontend-2sdv0m6ji-neyvils-projects.vercel.app"], // Replace with your deployed frontend URL
    credentials: true, // Allows cookies to be sent with requests
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/backend/uploads', express.static('backend/uploads'));

app.use(
  "/uploads/products",
  express.static(path.join(path.resolve(), "/uploads/products"))
);

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);



app.listen(port, () => console.log(`Server running on port: ${port}`));
