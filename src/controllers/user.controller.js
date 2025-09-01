import AppError from "../middlewares/error-handler.middleware.js";
import User from "../models/user.model.js";
import { delete_file, upload_file } from "../utils/cloudinary.utils.js";

// * get user by id
export const getById = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      message: "user by id fetched",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// * get all users
export const getAll = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      message: "all users fetched",
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

//* delete user
export const remove = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const user = await User.findBy(user_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.profile_image) {
      await delete_file(user.profile_image.public_id);
    }

    await user.deleteOne();

    // * success response
    res.status(200).json({
      message: "user deleted successfully",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, gender, phone } = req.body;
    const file = req.file;
    const user = await User.findByIdAndUpdate(
      user_id,
      { first_name, last_name, gender, phone },
      { new: true, reValidate: true }
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (file) {
      //* upload new file
      const { path, public_id } = await upload_file(file.path);

      //* delete old profile image
      if (user.profile_image) {
        await delete_file(user.profile_image.public_id);
      }

      // * update new profile image
      user.profile_image = {
        path,
        public_id,
      };

      await user.save();
    }

    res.status(201).json({
      message: "profile updated",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
