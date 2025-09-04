import express from "express";
import { uploader } from "../middlewares/uploader.middleware.js";
import {
  create,
  get_all,
  get_by_id,
  remove,
  update,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";

const router = express.Router();
const upload = uploader();

//? create category
router.post("/", authenticate([Role.ADMIN]), upload.single("logo"), create);

//? update category
router.put("/", authenticate([Role.ADMIN]), upload.single("logo"), update);
//? get  by id
router.get("/:id", get_by_id);

//? get all
router.get("/", get_all);

// delete
router.delete("/", authenticate([Role.ADMIN]), remove);

export default router;
