import mongoose from "mongoose";

const booking_model = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    tour_package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tour_package",
      required: [true, "Package is required"],
    },
    total_price: {
      type: Number,
      min: [0, "PWrice must be  positive"],
      required: [true, "Total price is required"],
    },

    full_name: {
      type: "String",
      required: [true, "full name is required"],
      trim: true,
    },

    phone: {
      type: "String",
      required: [true, "phone is required"],
      maxLength: 15,
    },

    total_person: {
      type: Number,
      default: 1,
      required: [true, "Number of persons are required"],
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", booking_model);
export default Booking;
