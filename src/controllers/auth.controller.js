import { upload_file } from "../ultils/cloudinary.utils.js";
import AppError from "../middlewares/error.handler.middleware.js";
import User from "../models/user.model.js";
import { comapre_password, hash_password } from "../ultils/brcypt.ultils.js";
import { generate_token } from "../ultils/jwt.utlis.js";
import { send_mail } from "../ultils/nodemailer.ultils.js";

//* Register Controller
export const register = async (request, response, next) => {
  try {
    const { first_name, last_name, password, phone, role, email, gender } =
      request.body;
    const file = request.file;
    console.log(file);
    if (!password) {
      throw new AppError("password is required", 400);
    }

    const hashed = await hash_password(password);

    // Save to MongoDB
    const user = new User({
      first_name,
      last_name,
      password: hashed,
      phone,
      email,
      role,
      gender,
    });

    if (file) {
      const { path, public_id } = await upload_file(file.path);
      user.profile_image = {
        path: path,
        public_id: public_id,
      };
    }
    await user.save();

    response.status(201).json({
      message: "Account created",
      status: "success",
      userId: user,
    });
  } catch (error) {
    next(error);
  }
};

// Login Controller

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    console.log("Login request:", email, password);

    if (!password) {
      throw new AppError("password is required", 400);
    }
    if (!email) {
      throw new AppError("email is required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    // Search user from in-memory array
    console.log(user);

    if (!user) {
      throw new AppError("email or password does not match", 400);
    }

    // const isPasswordMatch = user.password === data.password;
    const isPasswordMatch = comapre_password(password, user.password);
    if (!isPasswordMatch) {
      throw new AppError("email or password does not match", 400);
    }

    // * gwnerate jwt token

    const access_token = generate_token({
      first_name: user.first_name,
      last_name: user.last_name,
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    await send_mail();

    response
      .cookie("access_token", access_token, {
        httpOnly: true,
        sameSite: "none",
        maxAge:
          parseInt(process.env.COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "development" ? true : false,
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
    console.log(error);
    next({
      message: error?.message || "something went wrong",
      status: "error",
      statusCode: 500,
    });
  }
};
