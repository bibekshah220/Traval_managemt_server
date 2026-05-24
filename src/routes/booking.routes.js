import express from "express";
import {
  book,
  getAll,
  getById,
  get_all,
  update,
  remove,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";
const router = express.Router();

//? get all bookings (admin)
router.get("/", authenticate([Role.ADMIN]), getAll);

//? get all bookings of the logged-in user
router.get("/my", authenticate([Role.USER, Role.ADMIN]), get_all);

//? create new booking
router.post("/", authenticate([Role.USER]), book);

//? get booking by id
router.get("/:id", authenticate([Role.USER, Role.ADMIN]), getById);

//? update booking
router.put("/:id", authenticate([Role.USER, Role.ADMIN]), update);

//? delete booking
router.delete("/:id", authenticate([Role.USER, Role.ADMIN]), remove);

export default router;
