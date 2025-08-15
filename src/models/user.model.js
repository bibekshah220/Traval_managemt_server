import mongoose from "mongoose";
import { gender, role } from "../config/constants.js";
export const users = [];

// * Mongoose schema for user collection
const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
  { timestamps: true }
);

// * Creating the "User" model from the schema
const User = mongoose.model("user", userSchema);

export default User;
