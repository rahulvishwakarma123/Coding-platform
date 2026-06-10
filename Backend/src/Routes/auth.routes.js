import express from 'express';
const router = express.Router();
import {register, login, refreshToken, logout, getMe} from '../Controllers/auth.controller.js';
import {protect}  from '../Middlewares/auth.middleware.js';

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes (require authentication)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;