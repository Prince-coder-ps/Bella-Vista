import express from 'express';
import {
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';
import { menuItemRules, mongoIdParam, validate } from '../middleware/validators.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/:id', mongoIdParam(), validate, getMenuItem);

// Admin-only writes
router.post('/', protect, authorize('admin'), menuItemRules, validate, createMenuItem);
router.put('/:id', protect, authorize('admin'), mongoIdParam(), menuItemRules, validate, updateMenuItem);
router.delete('/:id', protect, authorize('admin'), mongoIdParam(), validate, deleteMenuItem);
router.patch('/:id/toggle', protect, authorize('admin'), mongoIdParam(), validate, toggleAvailability);

export default router;
