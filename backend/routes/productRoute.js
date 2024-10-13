import express from "express";
import path from "path";
import multer from "multer";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
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

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/products/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
    console.log("Generated Filename:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  if (
    filetypes.test(path.extname(file.originalname).toLowerCase()) &&
    mimetypes.test(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });

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
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;