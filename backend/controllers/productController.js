import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import path from "path";
import fs from "fs";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      brand,
      quantity,
      price,
      countInStock,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !brand ||
      !countInStock
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Access the uploaded file from req.file
    const productImage = req.file.path;

    // Add your logic to create a new product using these fields
    const product = new Product({
      name,
      category,
      description,
      brand,
      quantity,
      price,
      productImage,
      countInStock,
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, could not create product" });
  }
};

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (req.file) {
      if (product.productImage) {
        const ImagePath = path.join("uploads/products", product.productImage);
        const existingImagePath = ImagePath.replace("uploads\\products\\", "");

        fs.unlink(existingImagePath, (err) => {
          if (err) {
            console.error("Failed to delete existing image:", err);
          } else {
            console.log(
              "Successfully deleted existing image:",
              existingImagePath
            );
          }
        });
      }

      product.productImage = req.file.path;
      console.log("New Image Path:", req.file.path);
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res
      .status(201)
      .json({ message: "Successfully update product", updatedProduct });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ message: "Product update failed", error: error.message });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(100)
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Internal server Error!!" });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "error during Product deletion !!" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error!!" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Fetching Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Fetching Problem" });
  }
});

const fetchNewProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}).sort({ _id: -1 }).limit(4);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Fetching problem!" });
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  fetchNewProduct,
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
  fetchTopProduct,
  filterProducts,
  fetchAllProducts,
};
