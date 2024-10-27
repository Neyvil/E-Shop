import { cloudinary } from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'e-shop',
      use_filename: true,
      unique_filename: true,
      allowed_formats: ['jpg', 'jpeg', 'png'],
    });

    // Delete the temporary file
    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    // Delete the temporary file in case of error
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};
