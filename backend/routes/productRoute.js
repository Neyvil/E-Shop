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
  fetchTopProduct,
  fetchNewProduct,
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

router
  .route("/")
  .get(fetchProducts)
  .post(
    authenticate,
    authorizeAdmin,
    upload.single("productImage"),
    addProduct
  );

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(authenticate,  checkId, addProductReview);
router.route("/top").get(fetchTopProduct);
router.route("/new").get(fetchNewProduct);
router
  .route("/:id")
  .get(fetchProductById)
  .put(
    authenticate,
    authorizeAdmin,
    (req, res, next) => {
      upload.single("productImage")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Handle multer-specific errors
          return res.status(400).json({ message: err.message });
        } else if (err) {
          // Handle other errors (like file type errors)
          return res.status(400).json({ message: err.message });
        }
        next();
      });
    },
    updateProduct
  )
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;
