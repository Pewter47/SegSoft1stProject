import express from "express";
import { register, login } from "../controllers/usersController.js";
const router = express.Router();
router.post("/register", register);
export default router;

