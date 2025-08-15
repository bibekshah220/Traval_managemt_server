import User from "../models/user.model.js";

//* Register Controller
export const register = async (request, response, next) => {
  try {
    const data = request.body;
    console.log("Register request:", data);

    if (
      !data ||
      !data.email ||
      !data.password ||
      !data.first_name ||
      !data.last_name
    ) {
      return response.status(400).json({
        message: "Missing required fields",
        status: "error",
      });
    }

    // Save to MongoDB
    const user = await User.create({ ...data });

    return response.status(201).json({
      message: "Account created",
      status: "success",
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return response.status(500).json({
      message: "Registration failed",
      status: "error",
    });
  }
};

// Login Controller
export const login = async (request, response, next) => {
  try {
    const data = request.body;
    console.log("Login request:", data);

    if (!data || !data.email || !data.password) {
      return response.status(400).json({
        message: "Email and password are required",
        status: "error",
      });
    }

    // Search user from in-memory array
    const user = await User.findOne({ email: data.email });

    if (!user) {
      next({
        message: "Email or password does not match",
        status: "error",
      });
    }

    const isPasswordMatch = user.password === data.password;

    if (!isPasswordMatch) {
      next({
        message: "Email or password does not match",
        status: "error",
      });
    }

    next({
      message: "User login successful",
      status: "success",
    });
  } catch (error) {
    next({
      message: error?.message || "something went wrong",
      status: "error",
      statusCode: 500,
    });
  }
};
