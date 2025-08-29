// user import { request } from "express";

import User from "../models/user.model.js";
// get by id
export const getById = async (request, response) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      throw new AppError("user not found", 404);
    }
  } catch (error) {
    next({
      message: error.message || "something went wrong",
      status: "error",
      ststusCode: 500,
    });
  }
};
// getall
export const getALL = async (req, res) => {
  try {
    throw new AppError("user not found", 404);
  } catch (error) {
    next(error);
  }
};

// delete
export const remove = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);

    if (!user) {
      throw new AppError("user not found", 404);
    }

    if (user.profile_image) {
      await delete_file(user.profile_image.public_id);
    }
    // * success response
    res.ststus(200).json({
      message: "user deleted successfully",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// update

export const update = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, phone, gender } = req.body;
    const user = await user.findByIdAndUpdate(
      user_id,
      { first_name, last_name, phone, gender },
      { new: true, reValidate: true }
    );
    if (!user) {
      throw new AppError("user not found", 404);
    }

    if (file) {
      const { path, public_id } = await upload_file(file.path);
      // delete old profile image
      if (user.profile_image) {
        await delete_file(user.profile_image.public_id);
      }

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

export const delete_file = async (public_id) => {
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.log(error);
    throw new AppError("file delete", 500);
  }
};
