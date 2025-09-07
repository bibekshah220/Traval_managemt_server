import express from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/package.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../config/constants.js";

import uploader from "../middlewares/uploader.middleware.js";

const router = express.Router();
const upload = uploader();

// post
router.post(
  "/",
  authenticate([Role.ADMIN]),
  upload.fields([
    {
      name: "cover_image",
      maxCount: 1,
    },
    {
      maxCount: 6,
      name: "images",
    },
  ]),
  create
);

//*get all
router.get("/", getAll);

//* getby id
router.get("/:id", getById);
//* delete
router.delete("/:id", authenticate([Role.ADMIN]), remove);

//* update
router.put("/:id", authenticate([Role.ADMIN]), update);

export default router;
