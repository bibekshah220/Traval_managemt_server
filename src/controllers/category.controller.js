import AppError from "../middlewares/error-handler.middleware.js";
import Category from "../models/category.model.js";
import { delete_file, upload_file } from "../utils/cloudinary.utils.js";

const category_folder = "/categories";

//* get all categories
export const get_all = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      message: "all categories fetched",
      status: "success",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// * get category by id
export const get_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.status(200).json({
      message: "Category fetched",
      status: "success",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// * create new category
export const create = async (req, res, next) => {
  try {
    //* 1. get data from req.body
    const { name, description } = req.body;
    const file = req.file;

    if (!file) {
      throw new AppError("category logo is required");
    }

    //* 2.  create category model instance
    const category = new Category({ name, description });

    if (file) {
      const { path, public_id } = await upload_file(file.path, category_folder);

      category.logo = {
        path,
        public_id,
      };
    }

    await category.save();

    res.status(201).json({
      message: "Category created.",
      data: category,
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

// * update category
// * update category
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Update name and description if provided
    if (name) category.name = name;
    if (description) category.description = description;

    if (file) {
      // Upload new logo
      const { path, public_id } = await upload_file(file.path, category_folder);

      // Delete old logo if it exists
      if (category.logo && category.logo.public_id) {
        await delete_file(category.logo.public_id);
      }

      // Set new logo
      category.logo = { path, public_id };
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      status: "success",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// * delete category
export const remove = async (req, res, next) => {
  try {
    const { id } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (category.logo) {
      await delete_file(category.logo.public_id);
    }

    await category.deleteOne();

    // * success response
    res.status(200).json({
      message: "Category deleted successfully",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
