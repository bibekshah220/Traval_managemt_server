import express from "express";
import { submit_contact } from "../controllers/contact.controller.js";

const router = express.Router();

//? submit contact form
router.post("/", submit_contact);

export default router;
