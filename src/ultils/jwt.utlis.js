import { jwt_config } from "../config/config.js";
import AppError from "../middlewares/error.handler.middleware.js";
import jwt from "jsonwebtoken";
// generate token
export const generate_token = (playload) => {
  try {
    return jwt.sign(playload, jwt_config.jwt_secret, {
      expiresIn: jwt_config.expires_in,
    });
  } catch (error) {
    console.log(error);
    throw new AppError("Token generation error", 500);
  }
};

// verify token

export const verify_token = (token) => {
  try {
    return jwt.verify_token(token, jwt_config.jwt_secret);
  } catch (error) {
    console.log(error);
    throw new AppError("User authentaction error", 401);
  }
};
