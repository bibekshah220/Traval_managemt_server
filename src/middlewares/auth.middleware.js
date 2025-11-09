import AppError from "./error-handler.middleware.js";
import { verify_token } from "../utils/jwt.utils.js";
import User from "../models/user.model.js";
import { Role } from "../config/constants.js";

export const authenticate = (Roles = []) => {
  return async (req, res, next) => {
    try {
      // get access token from req.cookie

      const token = req.cookies.access_token;
      console.log(token);

      if (!token) {
        throw new AppError("Unauthorized. Access denied.", 401);
      }
      const decoded_data = verify_token(token);

      console.log(decoded_data);

      if (!decoded_data) {
        throw new AppError("Unauthorized. Access denied");
      }
      // is token expired or not
      if (Date.now() > Number(decoded_data.exp) * 1000) {
        throw new AppError("Token Expired. Access denied.", 401);
      }
      const user = await User.findOne({
        _id: decoded_data._id,
        email: decoded_data.email,
      });
      if (!user) {
        throw new AppError("Unauthrized .Access denied.", 401);
      }
      // role based authorization

      if (
        Array.isArray(Roles) &&
        Roles.length > 0 &&
        !Roles.includes(user.role)
      ) {
        throw new AppError("Forbidden. Access denied", 403);
      }
      // attach user to req object
      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
