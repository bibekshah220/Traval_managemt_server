import express from "express";
import { userRegister, login } from "../controllers/auth.controller.js";

const router = express.Router();

// * implement actual Register user logic
router.post("/register", userRegister);

// * login
// * implement actual  user login  logic

router.post("/login", login);

export default router;
