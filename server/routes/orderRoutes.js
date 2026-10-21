import express from 'express';
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import { orderRules, orderStatusRules, mongoIdParam, validate } from '../middleware/validators.js';

const router = express.Router();

router.get('/mine', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getOrders);
router.get('/:id', protect, mongoIdParam(), validate, getOrderById);

router.post('/', publicWriteLimiter, optionalAuth, orderRules, validate, createOrder);

router.patch('/:id/status', protect, authorize('admin'), mongoIdParam(), orderStatusRules, validate, updateOrderStatus);

export default router;
