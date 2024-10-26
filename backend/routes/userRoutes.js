import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
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

const router = express.Router();

// Ensure 'backend/uploads' directory exists
const uploadDir = path.join(path.resolve(), "backend/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
    console.log("Generated Filename:", filename);
    cb(null, filename);
  },
});

// File filter to allow only images
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
