import express from "express";

const router = express.Router();

// post
router.post("/", (req, res) => {
  res.status(201).json({
    message: "package created ",
    status: "success",
  });
});

router.get("/", (req, res) => {
  res.status(200).json({
    message: "package fatched ",
    status: "success",
  });
});

// getby id
router.get("/:id", (req, res) => {
  res.status(200).json({
    message: "package fatched ",
    status: "success",
  });
});

// delete
router.delete("/:id", (req, res) => {
  res.status(200).json({
    message: "package deleted",
    status: "success",
  });
});

// update
router.put("/:id", (req, res) => {
  res.status(200).json({
    message: "package updated",
    status: "success",
  });
});

export default router;
