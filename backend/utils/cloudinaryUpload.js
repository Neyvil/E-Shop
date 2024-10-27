// utils/cloudinaryUpload.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs";

dotenv.config();

export const uploadToCloudinary = async (file) => {
  try {
    const result = await configureCloudinary.uploader.upload(file.path, {
      folder: "e-shop",
      use_filename: true,
      unique_filename: true,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });

    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return;
    await configureCloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};
