import AppError from "../middlewares/error-handler.middleware.js";
import User from "../models/user.model.js";
import { compare_passwords, hash_password } from "../utils/bcrypt.utils.js";
import { upload_file } from "../utils/cloudinary.utils.js";
import { generate_token } from "../utils/jwt.utils.js";
import { send_email } from "../utils/nodemailer.utils.js";

export const register = async (req, res, next) => {
  try {
    // * implement actual register user logic
    const { first_name, last_name, email, password, phone, gender } = req.body;

    const file = req.file;

    console.log(file);

    if (!password) {
      throw new AppError("password is required", 400);
    }

    const hashed = await hash_password(password);

    // insert user data to databse user collection

    const user = new User({
      first_name,
      last_name,
      email,
      password: hashed,
      phone,
      gender,
    });

    if (file) {
      const { path, public_id } = await upload_file(file.path, "/avatar");

      user.profile_image = {
        path: path,
        public_id: public_id,
      };
    }
    await user.save();

    // do not leak the password hash back to the client
    user.password = undefined;

    res.status(201).json({
      message: "Account created",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // * implement actual  user login logic
    const { email, password } = req.body;

    if (!password) {
      throw new AppError("password is required", 400);
    }

    if (!email) {
      throw new AppError("email is required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("email or password does not match", 400);
    }

    const isPassMatch = await compare_passwords(password, user.password);

    if (!isPassMatch) {
      throw new AppError("email or password does not match", 400);
    }

    //* gwnerate jwt token
    const access_token = generate_token({
      first_name: user.first_name,
      last_name: user.last_name,
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    // do not leak the password hash back to the client
    user.password = undefined;

    const is_prod = process.env.NODE_ENV === "production";

    res
      .cookie("access_token", access_token, {
        httpOnly: true,
        // "none" requires secure:true (HTTPS); use "lax" for http localhost dev
        sameSite: is_prod ? "none" : "lax",
        maxAge:
          parseInt(process.env.COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000,
        secure: is_prod,
      })
      .status(201)
      .json({
        message: "user login success",
        status: "success",
        data: {
          user,
          access_token,
        },
      });
  } catch (error) {
    next(error);
  }
};

// * return the currently authenticated user (auth middleware attaches req.user)
export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      message: "current user fetched",
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// * clear the auth cookie
export const logout = async (req, res, next) => {
  try {
    const is_prod = process.env.NODE_ENV === "production";

    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: is_prod ? "none" : "lax",
      secure: is_prod,
    });

    res.status(200).json({
      message: "logout success",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
