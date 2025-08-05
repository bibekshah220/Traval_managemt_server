import express from "express";

const router = express.Router();

// * implement actual Register user logic
router.post("/register", (req, res) => {
  res.status(201).json({
    message: "User Registered",
    status: "success",
  });
});

// * login
// * implement actual  user login  logic

router.post("/login", (req, res) => {
  res.status(201).json({
    message: "User login success",
    status: "success",
  });
});

export default router;
