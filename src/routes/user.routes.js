import express from "express";
import {
  profile,
  getBayId,
  userbyid,
  remove,
} from "../controllers/user.controller";
const router = express.Router();

// * update profile
router.put("/:id", profile);

// get user by id
router.get("/:id", getBayId);

// get user by id
router.get("/", userbyid);

router.delete("/:id", remove);

export default router;
