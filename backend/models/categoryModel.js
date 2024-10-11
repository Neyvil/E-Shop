import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null, // If null, this is a top-level category
    },
    subcategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category", // Referencing other categories to create a hierarchy
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: null, // Optional, only for certain categories
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
