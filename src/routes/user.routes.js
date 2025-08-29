import express from "express";
import { getALL, update, remove } from "../controllers/user.controller.js";
import { uploader } from "../middlewares/uploader.middleware.js";
const router = express.Router();
const upload = uploader();

// * update profile
// get user by id
router.put("/:id", upload.single("profile_image"), update);

// get user by id
router.get("/", getALL);

router.delete("/:id", remove);

export default router;
