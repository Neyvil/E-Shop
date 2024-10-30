import express from "express";

import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  UpdateCurrentUserProfile,
  deleteUserById,
  getUserById,
  userUpdateById,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin, authorizeSuperAdmin } from "../middlewares/authMiddleware.js";
import multer from "multer";



const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();


// Routes
router.route("/")
  .post(createUser)
  .get(authenticate, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, upload.single("profileImage"), UpdateCurrentUserProfile);

router.route("/:id")
  .delete(authenticate, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeSuperAdmin, userUpdateById);

export default router;
