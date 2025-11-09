import express from "express";
import { book, getAll, getById } from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";
const router = express.Router();

//* Booking
//? get all bookings
router.get("/", authenticate([Role.ADMIN]), getAll);

//? get by id
router.get("/:id", authenticate([Role.USER, Role.ADMIN]), getById);

//? create new booking
router.post("/", authenticate([Role.USER]), book);

//? get all user bookings

export default router;
