import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

// * implement actual Register user logic
router.post("/register", register);

// * login
// * implement actual  user login  logic

router.post("/login", login);

export default router;
