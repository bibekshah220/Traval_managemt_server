import AppError from "../middlewares/error-handler.middleware.js";
import bcrypt from "bcryptjs";
// hash user password
export const hash_password = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new AppError("Internal Server Error", 500);
  }
};

// comapre password
export const compare_passwords = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
