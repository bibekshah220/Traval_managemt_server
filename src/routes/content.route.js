import express from "express";
import { get_content, update_content } from "../controllers/content.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";

const router = express.Router();

//? public site content
router.get("/", get_content);

//? update site content
router.put("/", authenticate([Role.ADMIN]), update_content);

export default router;
