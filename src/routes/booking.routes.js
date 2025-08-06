import express from "express";
import {
  create,
  getBayId,
  getAll,
  remove,
  update,
} from "../controllers/booking.controller.js";

const router = express.Router();

// Booking
router.get("/", getAll);
// create
router.post("/", create);

// update
router.put("/:id", update);

// getby id
router.get("/:id", getBayId);

// delete
router.delete("/:id", remove);

export default router;
