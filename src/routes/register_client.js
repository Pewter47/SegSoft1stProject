import express from 'express';
import { register, check } from '../controllers/clientsController.js';
const router = express.Router();
router.post('/register', register);
router.post('/check', check); //test, delete later
export default router;