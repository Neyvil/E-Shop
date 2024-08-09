import express from "express";
import Formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import path from "path";
import multer from "multer";

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
    const uploadDir = path.join(path.resolve(), "uploads/products");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
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
    Formidable(),
    upload.single("productImage"),
    addProduct
  );

router.route("/allproducts").get(fetchAllProducts);
router
  .route("/:id/reviews")
  .post(authenticate, authorizeAdmin, checkId, addProductReview);
router.route("/top").get(fetchTopProduct);
router.route("/new").get(fetchNewProduct);
router
  .route("/:id")
  .get(fetchProductById)
  .put(
    authenticate,
    authorizeAdmin,
    Formidable(),
    upload.single("productImage"),
    updateProduct
  )
  .delete(authenticate, authorizeAdmin, Formidable(), removeProduct);

export default router;
