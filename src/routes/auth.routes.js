import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { uploader } from "../middlewares/uploader.middleware.js";

const router = express.Router();
const upload = uploader();

// * implement actual Register user logic
router.post("/register", upload.single("profile_image"), register);

// * login
// * implement actual  user login  logic

router.post("/login", login);

export default router;
