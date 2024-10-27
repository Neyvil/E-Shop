import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    productImage: { type: String, required: true },
    cloudinary_id: {
    type: String,
    required: true
  },
    brand: { type: String, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    selectedCategoryPath: [
      {
        type: String,
        required: true,
      },
    ],
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },

    clothingAttributes: {
      gender: {
        type: String,
        enum: ["male", "female", "unisex"],
        required: function () {
          return this.category.name === "clothing";
        },
      },
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
        required: function () {
          return this.category.name === "clothing";
        },
      },
      color: {
        type: String,
        required: function () {
          return this.category.name === "clothing";
        },
      },
    },
    electronicsAttributes: {
      warranty: {
        type: Number, // in years
        required: function () {
          return this.category.name === "electronics";
        },
      },
    },
    furnitureAttributes: {
      material: {
        type: String,
        required: function () {
          return this.category.name === "furniture";
        },
      },
    },
  },
  { timestamps: true }
);

// In this case, the Product documents will be stored within this database under the collection named "products" because Mongoose, by default, pluralizes the model name ("Product" becomes "products" for the collection name).

const Product = mongoose.model("Product", productSchema);
export default Product;
