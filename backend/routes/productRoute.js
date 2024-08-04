import express from "express";
import Formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

import {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
} from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizeAdmin, Formidable(), addProduct);

router.route("/:id/reviews").post(authenticate,authorizeAdmin,checkId,addProductReview)

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, Formidable(), updateProduct)
  .delete(authenticate, authorizeAdmin, Formidable(), removeProduct);

export default router;
