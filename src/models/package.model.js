import mongoose from "mongoose";
import { package_cost_type } from "../config/constants.js";

const package_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [5, "Name should be atleast 5 char long"],
      unique: [true, "Package already exists with provided name"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Category is required"],
      ref: "category",
    },
    // cover_image
    cover_image: {
      type: {
        path: String,
        public_id: String,
      },
      required: [true, "Cover image is required"],
    },

    // images
    images: [
      {
        type: {
          path: String,
          public_id: String,
        },
        required: [true, "Images is required"],
        minLength: [2, "Atleast two images required"],
      },
    ],

    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [25, "Description should be atleast 25 char long"],
    },
    start_date: {
      type: Date,
      required: [true, "Tour package start date is required"],
    },
    end_date: {
      type: Date,
      required: [true, "Tour package end date is required"],
    },
    total_seats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [0, "Total seats must be greater than 0"],
    },
    seats_available: {
      type: Number,
      required: [true, "Available seat is required"],
      min: [0, "Available seat must be greater than 0"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than 0"],
    },
    destinations: [
      {
        type: {
          location: String,
          time: String,
        },
      },
    ],
    cost_type: {
      type: String,
      enum: Object.values(package_cost_type),
      default: package_cost_type.PER_PERSON,
    },
  },
  { timestamps: true }
);

const Tour_package = mongoose.model("tour_package", package_schema);
export default Tour_package;
