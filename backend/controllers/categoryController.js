import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.json({ error: "Already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params; // noted
    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.name = name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const categoryDeleted = await Category.findByIdAndDelete({ _id: categoryId });

  if (!categoryDeleted) {
    return res.status(404).json({ error: "Problem Occured!!" });
  }
  res.json({ message: "Category successfully deleted", categoryDeleted });
});

const categoryList = asyncHandler(async (req, res) => {
  try {
    const List = await Category.find({});
    res.json(List);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  categoryList,
  readCategory,
};
