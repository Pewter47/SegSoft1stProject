import express from 'express';
import { show_form, login, get_token } from '../controllers/authController.js';
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.get('/authorize', show_form);
router.post('/authorize/login', login, ); 
router.post('/token', get_token);
export default router;