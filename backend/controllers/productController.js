import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryUpload.js";


const addProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      description,
      brand,
      price,
      countInStock,
      gender,
      size,
      color,
      warranty,
      material,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !categoryId ||
      !brand ||
      !countInStock ||
      !req.file
    ) {
      return res
        .status(400)
        .json({ error: "All fields including product image are required" });
    }

    const uploadResult = await uploadToCloudinary(req.file);
    const productImage = uploadResult.url;
    const cloudinary_id = uploadResult.public_id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    const getAncestorCategories = async (cat) => {
      const ancestors = [];
      let currentCat = cat;
      while (currentCat.parentCategory) {
        currentCat = await Category.findById(currentCat.parentCategory);
        ancestors.push(currentCat);
      }
      return ancestors;
    };

    const ancestorCategories = await getAncestorCategories(category);
    const allCategories = [category, ...ancestorCategories];

    let productData = {
      name,
      category: categoryId,
      description,
      brand,
      price,
      productImage,
      cloudinary_id,
      countInStock,
    };

    const isClothing = allCategories.some(
      (cat) => cat.name.toLowerCase() === "clothing"
    );
    const isElectronics = allCategories.some(
      (cat) => cat.name.toLowerCase() === "electronics"
    );
    const isFurniture = allCategories.some(
      (cat) => cat.name.toLowerCase() === "furniture"
    );

    if (isClothing) {
      productData.clothingAttributes = {
        gender,
        size,
        color,
      };
    } else if (isElectronics) {
      productData.electronicsAttributes = {
        warranty,
      };
    } else if (isFurniture) {
      productData.furnitureAttributes = {
        material,
      };
    }

    const product = new Product(productData);

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
      categoryId,
      brand,
      countInStock,
      gender,
      size,
      color,
      warranty,
      material,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle product image replacement
    if (req.file) {
      try {
        if (product.cloudinary_id) {
          await deleteFromCloudinary(product.cloudinary_id);
        }
        const uploadResult = await uploadToCloudinary(req.file);

        product.productImage = uploadResult.url;
        product.cloudinary_id = uploadResult.public_id;
      } catch (error) {
        console.error(error);
      }
    }

    Object.assign(product, {
      name,
      description,
      price,
      brand,
      countInStock,
    });

    const getAncestorCategories = async (catId) => {
      const ancestors = [];
      let currentCat = await Category.findById(catId);
      while (currentCat && currentCat.parentCategory) {
        currentCat = await Category.findById(currentCat.parentCategory);
        if (currentCat) ancestors.push(currentCat);
      }
      return ancestors;
    };

    if (categoryId && categoryId !== product.category.toString()) {
      const newCategory = await Category.findById(categoryId);
      if (!newCategory) {
        return res.status(400).json({ error: "Category not found" });
      }
      product.category = categoryId;

      const ancestorCategories = await getAncestorCategories(categoryId);
      const allCategories = [newCategory, ...ancestorCategories];

      product.clothingAttributes = undefined;
      product.electronicsAttributes = undefined;
      product.furnitureAttributes = undefined;

      const isClothing = allCategories.some(
        (cat) => cat.name.toLowerCase() === "clothing"
      );
      const isElectronics = allCategories.some(
        (cat) => cat.name.toLowerCase() === "electronics"
      );
      const isFurniture = allCategories.some(
        (cat) => cat.name.toLowerCase() === "furniture"
      );

      if (isClothing) {
        product.clothingAttributes = { gender, size, color };
      } else if (isElectronics) {
        product.electronicsAttributes = { warranty };
      } else if (isFurniture) {
        product.furnitureAttributes = { material };
      }
    } else {
      const ancestorCategories = await getAncestorCategories(product.category);
      const allCategories = [
        await Category.findById(product.category),
        ...ancestorCategories,
      ];

      const isClothing = allCategories.some(
        (cat) => cat.name.toLowerCase() === "clothing"
      );
      const isElectronics = allCategories.some(
        (cat) => cat.name.toLowerCase() === "electronics"
      );
      const isFurniture = allCategories.some(
        (cat) => cat.name.toLowerCase() === "furniture"
      );

      if (isClothing) {
        product.clothingAttributes = { gender, size, color };
      } else if (isElectronics) {
        product.electronicsAttributes = { warranty };
      } else if (isFurniture) {
        product.furnitureAttributes = { material };
      }
    }

    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product successfully updated",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(400)
      .json({ message: "Product update failed", error: error.message });
  }
});


const removeProduct = asyncHandler(async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.cloudinary_id) {
      await deleteFromCloudinary(product.cloudinary_id);
    } else {
      console.error("Image file deletion error");
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product successfully deleted", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error during Product deletion" });
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
      .populate({
        path: "category",
        populate: {
          path: "subcategories",
          populate: {
            path: "subcategories",
            populate: {
              path: "subcategories",
            },
          },
        },
      })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "category",
      populate: {
        path: "subcategories",
        populate: {
          path: "subcategories",
          populate: {
            path: "subcategories",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: "Product already reviewed" });
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
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ rating: -1 })
      .limit(4)
      .populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetching Problem" });
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetching problem" });
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { categories, priceFilter, gender, brand } = req.body;
    let query = {};

    if (categories && categories.length > 0) {
      const categoryIds = await getAllSubcategories(categories);
      query.category = { $in: categoryIds };
    }

    if (priceFilter) {
      query.price = { $lte: parseFloat(priceFilter) };
    }

    if (gender && gender !== "") {
      query["clothingAttributes.gender"] = gender.toLowerCase();
    }

    if (brand) {
      query.brand = brand;
    }

    const products = await Product.find(query).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: "category",
        populate: {
          path: "parentCategory",
          model: "Category",
        },
      })
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    console.error("Error in fetchAllProducts:", error);
    res
      .status(500)
      .json({ error: "Internal server Error", details: error.message });
  }
});

// Helper function to get all subcategories recursively (imp)
const getAllSubcategories = async (categoryIds) => {
  const allCategories = new Set(categoryIds.map((id) => id.toString()));
  const queue = [...categoryIds];

  while (queue.length) {
    const categoryId = queue.shift();
    const category = await Category.findById(categoryId);

    if (category && category.subcategories.length > 0) {
      for (const subCategoryId of category.subcategories) {
        const subCategoryIdString = subCategoryId.toString();
        if (!allCategories.has(subCategoryIdString)) {
          allCategories.add(subCategoryIdString);
          queue.push(subCategoryId); /*  */
        }
      }
    }
  }

  return Array.from(allCategories);
};

export {
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
  fetchAllProducts,
  addProduct,
};
