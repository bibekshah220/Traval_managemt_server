import Tour_package from "../models/package.model.js";
import Category from "../models/category.model.js";
import AppError from "../middlewares/error-handler.middleware.js";
import { delete_file, upload_file } from "../utils/cloudinary.utils.js";
import { getPagination } from "../utils/pagination.utils.js";

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
      cost_type,
    } = req.body;

    const { cover_image, images } = req.files;
    if (!cover_image) {
      throw new AppError("Cover image is required", 400);
    }

    if (!images) {
      throw new AppError("Imags is required", 400);
    }

    console.log(req.files);
    const tour_package = new Tour_package({
      name,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_seats,
      seats_available: parseInt(total_seats),
      price,
      cost_type,
      destinations: JSON.parse(destinations ?? ""),
    });

    const package_category = await Category.findById(category);

    if (!package_category) {
      throw new AppError("Category not found", 404);
    }
    tour_package.category = package_category._id;

    // upload cocer image

    const { path, public_id } = await upload_file(
      cover_image[0].path,
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

//* get all package
export const getAll = async (req, res, next) => {
  try {
    let filter = {};
    const {
      query,
      type,
      min_price,
      max_price,
      start_date,
      end_date,
      page = 1,
      limit = 10,
    } = req.query;

    const current_page = Number(page);
    const query_limit = Number(limit);
    const skip = (current_page - 1) * query_limit;

    if (query) {
      filter.$or = [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          description: {
            $regex: query,
            $options: "i",
          },
        },
      ];
    }

    if (type) {
      filter.cost_type = type;
    }

    if (min_price || max_price) {
      filter.price = {};
      if (min_price) filter.price.$gte = Number(min_price);
      if (max_price) filter.price.$lte = Number(max_price);
    }

    if (start_date) {
      filter.start_date = { $gte: new Date(start_date) };
    }
    if (end_date) {
      filter.end_date = { $lte: new Date(end_date) };
    }

    const packages = await Tour_package.find(filter)
      .populate("category")
      .limit(query_limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total_count = await Tour_package.countDocuments(filter);

    const pagination = getPagination(current_page, total_count, query_limit);

    res.status(200).json({
      message: "packages fetched successfully",
      status: "success",
      data: packages,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour_package = await Tour_package.findById(id).populate("category");
    if (!tour_package) {
      throw new AppError("Package not found", 404);
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
  try {
    const { id } = req.params;
    const tour_package = await Tour_package.findById(id);

    if (!tour_package) {
      throw new AppError("Package not found", 404);
    }

    //* delete cover image
    if (tour_package.cover_image?.public_id) {
      await delete_file(tour_package.cover_image.public_id);
    }

    //* delete images
    if (tour_package.images) {
      await Promise.all(
        tour_package.images.map(
          async (image) => await delete_file(image.public_id)
        )
      );
    }

    //* delete package
    await tour_package.deleteOne();
    res.status(200).json({
      message: "package deleted",
      status: "success",
      data: tour_package,
    });
  } catch (error) {
    next(error);
  }
};

// update
export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      start_date,
      end_date,
      total_seats,
      price,
      destinations,
      cost_type,
    } = req.body;

    // req.files is undefined when no files are uploaded
    const cover_image = req.files?.cover_image;
    const images = req.files?.images;

    const tour_package = await Tour_package.findById(id);

    if (!tour_package) {
      throw new AppError("Package not found", 404);
    }

    if (name) tour_package.name = name;
    if (description) tour_package.description = description;
    if (total_seats) {
      // keep available seats in sync with the change in total seats
      const diff = parseInt(total_seats) - tour_package.total_seats;
      tour_package.total_seats = parseInt(total_seats);
      tour_package.seats_available = Math.max(
        0,
        tour_package.seats_available + diff
      );
    }
    if (cost_type) tour_package.cost_type = cost_type;
    if (price) tour_package.price = price;
    if (end_date) tour_package.end_date = new Date(end_date);
    if (start_date) tour_package.start_date = new Date(start_date);
    if (destinations) tour_package.destinations = JSON.parse(destinations);

    if (category) {
      const package_category = await Category.findById(category);

      if (!package_category) {
        throw new AppError("Category not found", 404);
      }
      tour_package.category = package_category._id;
    }

    // cover image
    if (cover_image && cover_image[0]) {
      if (tour_package.cover_image?.public_id) {
        await delete_file(tour_package.cover_image.public_id);
      }
      const { path, public_id } = await upload_file(
        cover_image[0].path,
        package_folder
      );
      tour_package.cover_image = {
        path,
        public_id,
      };
    }

    // images
    if (images && Array.isArray(images) && images.length > 0) {
      // remove old images from cloudinary
      if (tour_package.images?.length) {
        await Promise.all(
          tour_package.images.map(
            async (image) => await delete_file(image.public_id)
          )
        );
      }
      const uploaded = await Promise.all(
        images.map(async (image) => await upload_file(image.path, package_folder))
      );
      tour_package.images = uploaded;
    }

    await tour_package.save();

    res.status(200).json({
      message: "package updated",
      status: "success",
      data: tour_package,
    });
  } catch (error) {
    next(error);
  }
};
