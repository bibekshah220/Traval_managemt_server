import express from "express";
import { getALL, put, remove } from "../controllers/user.controller.js";
const router = express.Router();

// // * update profile
// router.put("/:id", profile);

// get user by id
router.put("/:id", put);

// get user by id
router.get("/", getALL);

router.delete("/:id", remove);

export default router;
