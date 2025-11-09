import { package_cost_type } from "../config/constants.js";
import AppError from "../middlewares/error-handler.middleware.js";
import Booking from "../models/booking.model.js";
import Tour_package from "../models/package.model.js";

//* post booking
export const book = async (req, res, next) => {
  try {
    const { tour_package, total_person } = req.body;
    const user = req.user._id;
    let total_price = 0;

    if (!tour_package) {
      throw new AppError("Package id is required", 400);
    }

    if (!total_person) {
      throw new AppError("Number of person is required", 400);
    }
    const booked_tour_package = await Tour_package.findById(tour_package);

    if (!booked_tour_package) {
      throw new AppError("Packe Not found", 404);
    }

    if (booked_tour_package.seats_available === 0) {
      throw new AppError(
        "Seats already full. Please contact with support.",
        404
      );
    }

    const book_package = new Booking({
      user,
      tour_package: tour_package._id,
      total_person: parseInt(total_person),
    });

    const total_days =
      (new Date(booked_tour_package.end_date).getTime() -
        new Date(booked_tour_package.start_date).getTime()) /
      (1000 * 24 * 60 * 60);

    if (booked_tour_package.cost_type === package_cost_type.PER_PERSON) {
      total_price = (
        parseInt(total_person) * booked_tour_package.price
      ).toFixed(2);
    } else {
      total_price = (
        parseInt(total_price) *
        booked_tour_package.price *
        total_days
      ).toFixed(2);
    }

    booked_tour_package.seats_available -= parseInt(total_person);
    book_package.total_price = total_price;

    await booked_tour_package.save();
    await book_package.save();

    res.status(201).json({
      message: "Package booked",
      status: "success",
      data: book_package,
    });
  } catch (error) {
    next(error);
  }
};

//* get all bookings
export const getAll = async (req, res, next) => {
  try {
    const bookings = await Booking.find({});

    res.status(200).json({
      message: "bookings fetched",
      status: "success",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

//* get by id
export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      throw new AppError("Booking not found", 400);
    }

    res.status(200).json({
      message: "booking fetched",
      status: "success",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

//* delete
export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 400);
    }
    const tour_package = await Tour_package.findById(booking.tour_package);

    if (tour_package) {
      tour_package.seats_available += booking.total_person;
    }

    await booking.deleteOne();
    res.status(200).json({
      message: "Package deleted",
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

//* update

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { total_person } = req.body;
    let total_price = 0;
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new AppError("Booking not found", 400);
    }

    const tour_package = await Tour_package.findById(booking.tour_package);

    if (tour_package) {
      throw new AppError("Package not found", 400);
    }

    const change_person = booking.total_person - Number(total_person);

    const total_days =
      (new Date(booked_tour_package.end_date).getTime() -
        new Date(booked_tour_package.start_date).getTime()) /
      (1000 * 24 * 60 * 60);

    if (booked_tour_package.cost_type === package_cost_type.PER_PERSON) {
      total_price = (
        parseInt(total_person) * booked_tour_package.price
      ).toFixed(2);
    } else {
      total_price = (
        parseInt(total_person) *
        booked_tour_package.price *
        total_days
      ).toFixed(2);
    }

    booking.total_person = Number(total_person);
    booking.total_price = total_price;

    if (change_person > 0) {
      tour_package.seats_available += Math.abs(change_person);
    } else {
      if (Math.abs(total_person) > tour_package.seats_available) {
        throw new AppError(
          `only ${tour_package.seats_available} seats available`
        );
      }
      tour_package.seats_available -= Math.abs(change_person);
    }

    await booking.save();
    await tour_package.save();

    res.status(201).json({
      message: "Booking updated",
      status: "success",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// get all user bookings
export const get_all = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate(
      "tour_package"
    );
    res.status(200).json({
      message: "All bookings fetched",
      status: "success",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
