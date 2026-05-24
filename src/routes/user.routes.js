import express from "express";
import {
  getAll,
  getById,
  update,
  remove,
} from "../controllers/user.controller.js";
import { uploader } from "../middlewares/uploader.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";
const router = express.Router();
const upload = uploader();

// get all users (admin)
router.get("/", authenticate([Role.ADMIN]), getAll);

// get user by id
router.get("/:user_id", authenticate([Role.USER, Role.ADMIN]), getById);

// update profile
router.put(
  "/:user_id",
  authenticate([Role.USER, Role.ADMIN]),
  upload.single("profile_image"),
  update
);

// delete user
router.delete("/:user_id", authenticate([Role.USER, Role.ADMIN]), remove);

export default router;
