import User from "../models/userModel.js";
import path from "path";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import fs from "fs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs 🙄");
  }

  //Validate email
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email address");
  }

  //Validate password
  const validatePassword = (password) => {
    // Check if the password is at least 8 characters long
    if (password.length < 8 || password > 12) {
      return false;
    }

    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check if the password contains at least one number
    if (!/\d/.test(password)) {
      return false;
    }

    // Check if the password contains at least one special character
    if (!/[!@#$%^&*()_+=-{};:"<>,./?]/.test(password)) {
      return false;
    }

    return true;
  };
  if (!validatePassword(password)) {
    return res.status(400).send("Password is invalid");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already exists ");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data ❌");
  }
});

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
        isAdmin: existingUser.isAdmin,
      });
      return;
    }
  } else {
    res.status(404);
    throw new Error("Invalid credential 😑");
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out Successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const UpdateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.file) {
      if (user.image) {
        const ImagePath = path.join("uploads", user.image);
        const existingImagePath=ImagePath.replace('uploads\\','')

        
        //Deleting the image if user provide new image
        fs.unlink(existingImagePath, (err) => {
          if (err) {
            console.error("Failed to delete existing image:", err);
          } else {
            console.log("Success deleted existing image:", existingImagePath);
          }
        });
      }
      user.image = req.file.path;
    }

    if (req.body.password) {
      const pwd = req.body.password;

      // Password validation
      const validatePassword = (pwd) => {
        // Check if the password is at least 8 characters long
        if (pwd.length < 8 || pwd.length > 12) {
          return false;
        }

        // Check if the password contains at least one uppercase letter
        if (!/[A-Z]/.test(pwd)) {
          return false;
        }

        // Check if the password contains at least one lowercase letter
        if (!/[a-z]/.test(pwd)) {
          return false;
        }

        // Check if the password contains at least one number
        if (!/\d/.test(pwd)) {
          return false;
        }

        // Check if the password contains at least one special character
        if (!/[!@#$%^&*()_+=-{};:"<>,./?]/.test(pwd)) {
          return false;
        }

        return true;
      };

      if (!validatePassword(pwd)) {
        return res.status(400).send("Password is invalid !!");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("User is Admin 👑");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User Deletion Succeed 🚮 👍" });
  } else {
    res.status(404);
    throw new Error("User doesn't Exist !!");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found !!");
  }
});

const userUpdateById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found !!");
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
