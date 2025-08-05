import express from "express";

const router = express.Router();

// * update profile
router.put("/:id", (req, res) => {
  res.status(200).json({
    message: "profile updated",
    status: "success",
  });
});

// get user by id
router.get("/:id", (req, res) => {
  res.status(200).json({
    message: "user by id fetched",
    status: "success",
  });
});

// get user by id
router.get("/", (req, res) => {
  res.status(200).json({
    message: "all user  fetched",
    status: "success",
  });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({
    message: `User with ID deleted`,
    status: "success",
  });
});

export default router;
