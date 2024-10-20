import express from "express";
import path from "path";
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

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destination = "/backend/uploads/"; // Relative path
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
    console.log("Generated Filename:", filename); // Log the generated filename
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};
const upload = multer({ storage, fileFilter });

// Route to register and list all users
// getAllUsers now receives the role from req.user and handles role-based user retrieval
router
  .route("/")
  .post(createUser)
  .get(authenticate, getAllUsers);  // Removed authorizeAdmin because the role filtering happens in the controller

// Authentication routes
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

// Route to manage the current user's profile
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, upload.single("profileImage"), UpdateCurrentUserProfile);

// Routes for managing users by ID
router
  .route("/:id")
  .delete(authenticate, deleteUserById) // Admins can't delete SuperAdmin
  .get(authenticate, authorizeAdmin, getUserById) // Admins can fetch only users
  .put(authenticate, authorizeSuperAdmin, userUpdateById); // SuperAdmin can update roles

export default router;
