import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, parentCategory, gender } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = new Category({
      name,
      parentCategory: parentCategory || null,
      gender: gender || null,
    });

    await category.save();

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (parent) {
        parent.subcategories.push(category._id);
        await parent.save();
      }
    }

    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, parentCategory, gender } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name || category.name;
    category.parentCategory = parentCategory || category.parentCategory;
    category.gender = gender || category.gender;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (category.parentCategory) {
      const parent = await Category.findById(category.parentCategory);
      if (parent) {
        parent.subcategories = parent.subcategories.filter(
          (subId) => subId.toString() !== categoryId
        );
        await parent.save();
      }
    }

    res.json({ message: "Category successfully deleted", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const categoryList = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null })
      .populate({
        path: 'subcategories',
        populate: {
          path: 'subcategories',
          populate: {
            path: 'subcategories',
          },
        },
      });

    res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate({
        path: 'subcategories',
        populate: {
          path: 'subcategories',
          populate: {
            path: 'subcategories',
          },
        },
      });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  categoryList,
  readCategory,
};
