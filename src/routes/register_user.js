import express from "express";
import { register, login } from "../controllers/usersController.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login); //test, delete later
export default router;

