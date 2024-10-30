import express from "express";
import path from "path";
import multer from "multer";
import { authenticate, authorizeAdmin, authorizeSuperAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import fs from "fs";

import {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
  fetchTopProducts,
  filterProducts,
  fetchNewProducts,
  fetchAllProducts,
} from "../controllers/productController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


// Fetch all products (paginated)
router.route("/").get(fetchProducts);

// Add a new product
router.route("/").post(
  authenticate,
  authorizeAdmin,
  upload.single("productImage"),
  addProduct
);

// Fetch all products (without pagination)
router.route("/all").get(fetchAllProducts);

// Add a review to a product
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

// Fetch top-rated products
router.route("/top").get(fetchTopProducts);

// Fetch newest products
router.route("/new").get(fetchNewProducts);

// Filter products
router.route("/filtered-products").post(filterProducts);

// Fetch, update, or delete a specific product
router
  .route("/:id")
  .get(fetchProductById)
  .put(
    authenticate,
    authorizeAdmin,
    (req, res, next) => {
      upload.single("productImage")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: err.message });
        } else if (err) {
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    },
    updateProduct
  )
  .delete(authenticate, authorizeAdmin || authorizeSuperAdmin , removeProduct);

export default router;