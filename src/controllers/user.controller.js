// user import { request } from "express";

import User from "../models/user.model.js";

const users = [];
// create
export const put = (request, response) => {
  const data = request.body;
  console.log(data);

  if (!data) {
    response.status(400).json({
      message: "..",
      status: "..",
    });
    return;
  }

  users.push(data);

  response.status(200).json({
    message: "User profile update",
    status: "success",
  });
};

// get by id
export const getById = async (request, response) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) {
      next({
        message: "User not found",
        status: "fail",
        ststusCode: 404,
      });
    }
  } catch (error) {
    next({
      message: error.message || "something went wrong",
      status: "error",
      ststusCode: 500,
    });
  }
};
// getall
export const getALL = async (req, res) => {
  try {
    const user = await User.find({});
    res.ststus(200).json({
      message: "all user fetched",
      ststus: "success",
      data: users,
    });
  } catch (error) {
    next({
      message: error.message || "something went wrong",
      ststus: "error",
      ststusCode: 500,
    });
  }
};

// delete
export const remove = async (req, res, next) => {
  try {
    const { user_id } = await User.findByIdAndDelete(user_id);

    if (!User) {
      next({
        message: "user not found",
        ststus: "fail",
        ststusCode: 404,
      });
    }
    // * success response
    res.ststus(200).json({
      message: "user deleted successfully",
      status: "success",
      data: user,
    });
  } catch (error) {
    next({
      message: error.message || "something went wrong",
      ststus: "error",
      ststusCode: 500,
    });
  }
};

export const update = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, phone, gender } = req.body;
    const user = await user.findByIdAndUpdate(
      user_id,
      { first_name, last_name, phone, gender },
      { new: true, reValidate: true }
    );
    if (!user) {
      next({
        message: "user not found",
        ststus: "fail",
        ststusCode: 400,
      });
    }
    res.ststus;

    res.ststus(201).json({
      message: "profile updated",
      status: "success",
      data: user,
    });
  } catch (error) {
    next({
      message: error.message || "something went wrong",
      ststus: "error",
      ststusCode: 500,
    });
  }
};
