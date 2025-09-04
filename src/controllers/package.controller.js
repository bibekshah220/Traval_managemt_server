import Tour_package from "../models/package.model.js";
import Category from "../models/category.model.js";
import AppError from "../middlewares/error-handler.middleware.js";
import { upload_file } from "../utils/cloudinary.utils.js";

const package_folder = "/packages";

//* create new package
export const create = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      start_date,
      end_date,
      total_seats,
      price,
      destinations,
      const_type,
    } = req.body;

    const { cover_image, images } = req.files;
    if (!cover_image) {
      throw new AppError("Cover image is required", 400);
    }

    if (!images) {
      throw new AppError("Imags is required", 400);
    }

    const tour_package = new Tour_package({
      name,
      description,
      start_date,
      end_date,
      total_seats,
      seats_available: parseInt(total_seats),
      price,
      const_type,
      destinations: JSON.parse(destinations ?? ""),
    });

    const package_category = await Category.findById(category);

    if (!package_category) {
      throw new AppError("Category not found", 404);
    }
    tour_package.category = package_category._id;

    // upload cocer image

    const { path, public_id } = await upload_file(
      cover_image.path,
      package_folder
    );
    tour_package.cover_image = {
      path,
      public_id,
    };

    // upload images
    if (images && Array.isArray(images)) {
      const promises = images.map(
        async (image) => await upload_file(image.path, package_folder)
      );

      const package_images = await Promise.all(promises);

      tour_package.images = package_images;
    }
    await tour_package.save();

    res.status(201).json({
      message: "package created",
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

//* get all
export const getAll = async (req, res, next) => {
  try {
    const packages = await Tour_package.find({});
    res.status(200).json({
      message: "packages fetched successfully",
      status: "success",
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour_package = await Tour_package.findById(id);
    if (!tour_package) {
      throw AppError("Package not found", 404);
    }
    res.status(200).json({
      message: "package fetched",
      status: "success",
      data: tour_package,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  const { id } = req.params;
  const tour_package = await Tour_package.findById(id);

  if (!tour_package) {
    throw AppError("Package not found", 404);
  }

  //* delete cover image

  //* delete images

  //* delete package
  //  await tour_package.deleteOne()
  res.status(200).json({
    message: "package deleted",
    status: "success",
    data: tour_package,
  });
};

export const update = (req, res) => {
  res.status(200).json({
    message: "package updated",
    status: "success",
  });
};
