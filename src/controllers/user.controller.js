import AppError from "../middlewares/error-handler.middleware.js";
import User from "../models/user.model.js";
import { delete_file, upload_file } from "../utils/cloudinary.utils.js";
import { compare_passwords, hash_password } from "../utils/bcrypt.utils.js";
import { Role, Gender } from "../config/constants.js";

const avatar_folder = "/avatar";

// a USER may only ever act on their own record; an ADMIN may act on anyone.
// Without this the :user_id param alone decides whose profile is read,
// changed or deleted.
const assert_self_or_admin = (req, user_id) => {
  if (req.user.role === Role.ADMIN) return;
  if (String(req.user._id) !== String(user_id)) {
    throw new AppError("Forbidden. Access denied", 403);
  }
};

// * get user by id
export const getById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    assert_self_or_admin(req, user_id);

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
export const getAll = async (req, res, next) => {
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
    assert_self_or_admin(req, user_id);

    const user = await User.findById(user_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.profile_image?.public_id) {
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
    assert_self_or_admin(req, user_id);

    const { first_name, last_name, gender, phone } = req.body;
    const file = req.file;

    const user = await User.findById(user_id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // only overwrite what was actually sent, so a partial form never
    // blanks a field it did not render
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (phone !== undefined) user.phone = phone;
    if (gender) {
      if (!Object.values(Gender).includes(gender)) {
        throw new AppError("Invalid gender", 400);
      }
      user.gender = gender;
    }

    if (file) {
      //* upload new file
      const { path, public_id } = await upload_file(file.path, avatar_folder);

      //* delete old profile image, if there was one
      if (user.profile_image?.public_id) {
        await delete_file(user.profile_image.public_id);
      }

      // * update new profile image
      user.profile_image = {
        path,
        public_id,
      };
    }

    await user.save();

    res.status(200).json({
      message: "profile updated",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//* change password
export const change_password = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    assert_self_or_admin(req, user_id);

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      throw new AppError(
        "current_password and new_password are required",
        400
      );
    }

    if (String(new_password).length < 8) {
      throw new AppError("New password must be at least 8 characters", 400);
    }

    if (current_password === new_password) {
      throw new AppError(
        "New password must be different from the current one",
        400
      );
    }

    // password is select:false on the schema, so ask for it explicitly
    const user = await User.findById(user_id).select("+password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const matched = await compare_passwords(current_password, user.password);

    if (!matched) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = await hash_password(new_password);
    await user.save();

    res.status(200).json({
      message: "password changed",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
