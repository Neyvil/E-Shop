import express from "express";
import Formidable from "express-formidable";
import { authenticate,authorizeAdmin } from "../middlewares/authMiddleware";
import checkId from "../middlewares/checkId";

import { addProduct, } from "../controllers/productController";

const router=express.Router();

router.route("/").post(authenticate,authorizeAdmin,Formidable(),addProduct)

export default router;