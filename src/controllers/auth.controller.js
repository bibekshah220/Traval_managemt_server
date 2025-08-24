import AppError from "../middlewares/error.handler.middleware.js";
import User from "../models/user.model.js";
import { hash_password } from "../ultils/brcypt.ultils.js";

//* Register Controller
export const register = async (request, response, next) => {
  try {
    const { first_name, last_name, password, phone, role, email, gender } =
      request.body;

    if (!password) {
      throw new AppError("password is required", 400);
    }

    const hashed = await hash_password(password);

    // Save to MongoDB
    const user = await User.create({
      first_name,
      last_name,
      password: hashed,
      phone,
      email,
      role,
      gender,
    });

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
    console.log("Login request:", data);

    if (!password) {
      throw new AppError("password is required", 400);
    }
    if (!email) {
      throw new AppError("email is required", 400);
    }

    const user = await User.findOne({ email });

    // Search user from in-memory array

    if (!user) {
      throw new AppError("email or password does not match", 400);
    }

    const isPasswordMatch = user.password === data.password;

    if (!isPasswordMatch) {
      throw new AppError("email or password does not match", 400);
    }

    response.status(201).json({
      message: "user login success",
      status: "success",
      data: "user",
    });
  } catch (error) {
    next({
      message: error?.message || "something went wrong",
      status: "error",
      statusCode: 500,
    });
  }
};
