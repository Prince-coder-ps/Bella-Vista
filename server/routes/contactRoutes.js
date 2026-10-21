import express from 'express';
import { createContactMessage } from '../controllers/contactController.js';
import { optionalAuth } from '../middleware/auth.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import { contactRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/', publicWriteLimiter, optionalAuth, contactRules, validate, createContactMessage);

export default router;
