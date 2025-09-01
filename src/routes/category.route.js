import express from "express";
import { uploader } from "../middlewares/uploader.middleware.js";
import {
  create,
  get_all,
  get_by_id,
  remove,
} from "../controllers/category.controller.js";

const router = express.Router();
const upload = uploader();

//? create category
router.post("/", upload.single("logo"), create);

//? update category

//? get  by id
router.get("/:id", get_by_id);

//? get all
router.get("/", get_all);

// delete
router.delete("/", remove);

export default router;
