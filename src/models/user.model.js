import mongoose from "mongoose";
import { Gender, Role } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First Name is rquired"],
    },
    last_name: {
      type: String,
      required: [true, "Last Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "User with provided email already exixts"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    phone: {
      type: String,
    },
    profile_image: {
      path: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: Gender.MALE,
    },
  },
  { timestamps: true }
);

//* creating database collection/ mongoose model
const User = mongoose.model("user", userSchema);
export default User;
