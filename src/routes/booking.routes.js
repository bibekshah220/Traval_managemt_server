import express from "express";
import { book, getAll, getById } from "../controllers/booking.controller.js";
const router = express.Router();

//* Booking
//? get all bookings
router.get("/", getAll);

//? get by id
router.get("/:id", getById);

//? create new booking
router.post("/", book);

export default router;
