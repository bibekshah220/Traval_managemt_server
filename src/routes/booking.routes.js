import express from "express";

const router = express.Router();

// Booking
router.get("/", (req, res) => {
  res.status(200).json({
    message: "booking fetched",
    status: "success",
  });
});

router.post("/", (req, res) => {
  res.status(201).json({
    message: "booking created",
    status: "success",
  });
});
// update
router.put("/:id", (req, res) => {
  res.status(200).json({
    message: "booking updated",
    status: "success",
  });
});

// getby id
router.get("/:id", (req, res) => {
  res.status(200).json({
    message: "booking fatched ",
    status: "success",
  });
});

// delete
router.delete("/:id", (req, res) => {
  res.status(200).json({
    message: "booking deleted",
    status: "success",
  });
});

export default router;
