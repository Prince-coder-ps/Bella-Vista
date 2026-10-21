import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, refreshLimiter } from '../middleware/rateLimiter.js';
import { registerRules, loginRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/refresh', refreshLimiter, refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
