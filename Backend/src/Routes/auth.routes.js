const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getMe
} = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes (require authentication)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;