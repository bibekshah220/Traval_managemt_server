import express from "express";
import {
  booking,
  getById,
  get,
  remove,
  update,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Booking
router.get("/", get);
// create
router.post("/", booking);

// update
router.put("/:id", update);

// getby id
router.get("/:id", getById);

// delete
router.delete("/:id", remove);

export default router;
