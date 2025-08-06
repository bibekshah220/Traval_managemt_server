import express from "express";
import {
  create,
  getAll,
  getBayId,
  update,
  remove,
} from "../controllers/package.controller.js";

const router = express.Router();

// post
router.post("/", create);
// get all
router.get("/", getAll);

// getby id
router.get("/:id", getBayId);

// delete
router.delete("/:id", remove);

// update
router.put("/:id", update);

export default router;
