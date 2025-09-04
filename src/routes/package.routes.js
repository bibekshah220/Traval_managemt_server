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
const router = express.Router();

// post
router.post("/", authenticate([Role.ADMIN]), create);

//*get all
router.get("/", getAll);

//* getby id
router.get("/:id", getById);
//* delete
router.delete("/:id", authenticate([Role.ADMIN]), remove);

//* update
router.put("/:id", authenticate([Role.ADMIN]), update);

export default router;
