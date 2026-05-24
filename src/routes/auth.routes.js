import express from "express";
import { login, logout, me, register } from "../controllers/auth.controller.js";
import { uploader } from "../middlewares/uploader.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();
const upload = uploader();

// * register
router.post("/register", upload.single("profile_image"), register);

// * login
router.post("/login", login);

// * current logged-in user
router.get("/me", authenticate(), me);

// * logout
router.post("/logout", authenticate(), logout);

export default router;
