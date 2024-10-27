import User from "../models/userModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import createToken from "../utils/createToken.js";

/// Register a new user (SuperAdmin or User)
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, securityAnswer } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Please fill all the inputs 🙄" });
  }

  if (role !== "superadmin" && role !== "user") {
    return res.status(400).json({
      message: "Invalid role. Only 'superadmin' and 'user' are allowed.",
    });
  }

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 12) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+=-{};:"<>,./?]/.test(password)) return false;
    return true;
  };
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password is invalid" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (role === "superadmin") {
    const storedSuperAdmin = await User.findOne({ role: "superadmin" });

    if (!storedSuperAdmin) {
      return res.status(500).json({
        message: "SuperAdmin registration is not allowed at this time.",
      });
    }

    const isAnswerCorrect = await bcrypt.compare(
      securityAnswer,
      storedSuperAdmin.securityAnswer
    );
    if (!isAnswerCorrect) {
      return res.status(403).json({
        message: "Incorrect security answer. SuperAdmin registration denied.",
      });
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data ❌" });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordMatch) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      });
      return;
    } else {
      return res.status(400).json({ message: "Invalid Password 👀" });
    }
  } else {
    return res.status(404).json({ message: "Invalid credentials 😑" });
  }
});

// Logout user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out Successfully" });
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const currentUserRole = req.user.role;

  let users;

  if (currentUserRole === "superadmin") {
    users = await User.find({});
  } else if (currentUserRole === "admin") {
    users = await User.find({ role: { $in: ["user", "admin"] } });
  } else {
    return res.status(403).json({ message: "Access Denied" });
  }

  res.json(users);
});

// Fetch current user profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
    });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

// Update current user profile
const UpdateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Handle image upload
    if (req.file) {
      try {
        // Delete old image if exists
        if (user.cloudinary_id) {
          await deleteFromCloudinary(user.cloudinary_id);
        }

        console.log('Uploading file:', req.file); // Debug log

        // Upload new image
        const uploadResult = await uploadToCloudinary(req.file);
        
        console.log('Upload result:', uploadResult); // Debug log

        user.image = uploadResult.url;
        user.cloudinary_id = uploadResult.public_id;
      } catch (error) {
        console.error('Image upload error:', error); // Debug log
        return res.status(400).json({ 
          message: "Error uploading image", 
          error: error.message 
        });
      }
    }

    // Rest of your code (password handling etc.)...

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      image: updatedUser.image
    });

  } catch (error) {
    console.error('Profile update error:', error); // Debug log
    res.status(400).json({ 
      message: "Error updating profile", 
      error: error.message 
    });
  }
});

// Delete a user by ID
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  const currentUserRole = req.user.role;
  const targetUserRole = user.role;

  if (currentUserRole === "admin" && targetUserRole === "superadmin") {
    return res
      .status(403)
      .json({ message: "Admins are not allowed to delete SuperAdmins" });
  }
  if (currentUserRole === "admin" && targetUserRole === "admin") {
    return res
      .status(403)
      .json({ message: "Admins are not allowed to delete other Admins" });
  }

  if (
    currentUserRole === "superadmin" ||
    (currentUserRole === "admin" &&
      targetUserRole !== "admin" &&
      targetUserRole !== "superadmin")
  ) {
    if (user.cloudinary_id) {
      await deleteFromCloudinary(user.cloudinary_id);
    }
    await User.deleteOne({ _id: user._id });
    return res.json({ message: "User deletion successful 🚮" });
  }

  return res.status(403).json({ message: "Unauthorized to delete this user" });
});

// Fetch a user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { role } = req.user;

  if (role === "admin" && user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Admins can only access user profiles" });
  } else if (role === "superadmin" && user.role === "superadmin") {
    return res
      .status(403)
      .json({ message: "SuperAdmin cannot access other SuperAdmin profiles" });
  } else {
    res.json(user);
  }
});

// Update a user by ID
const userUpdateById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.user.role === "superadmin" && req.body.role) {
      if (req.body.role === "admin" || req.body.role === "user") {
        user.role = req.body.role;
      } else {
        return res.status(400).json({
          message:
            "Invalid role. Only 'admin' and 'user' roles can be assigned by SuperAdmin.",
        });
      }
    } else if (req.body.role) {
      return res
        .status(403)
        .json({ message: "Only SuperAdmin can change user roles." });
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  UpdateCurrentUserProfile,
  deleteUserById,
  getUserById,
  userUpdateById,
};
