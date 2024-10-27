import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      type: String,
    },

    cloudinary_id: {
    type: String,
    
  },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["superadmin", "admin", "user"], // Define roles: superadmin, admin, user
      default: "user", // Default role is 'user'
    },

    securityQuestion: {
      type: String,
    },

    securityAnswer: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
