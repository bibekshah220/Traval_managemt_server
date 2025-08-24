import mongoose from "mongoose";
import { gender, role } from "../config/constants.js";
export const users = [];

// * Mongoose schema for user collection
const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "first_name is required"],
    },
    last_name: {
      type: String,
      required: [true, "last_name is required"],
    },
    email: {
      type: String,
      required: [true, "mail is required"],
      unique: [true, "User with provided email already exixts"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(role),
      default: role.ADMIN,
    },
    gender: {
      type: "String",
      enum: Object.values(gender),
      default: gender.MALE,
    },
  },
  { timestamps: [true] }
);

// * Creating the "User" model from the schema
const User = mongoose.model("user", userSchema);

export default User;
