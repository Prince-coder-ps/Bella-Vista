import express from 'express';
import {
  createReservation,
  checkAvailability,
  getReservations,
  getMyReservations,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { publicWriteLimiter } from '../middleware/rateLimiter.js';
import {
  reservationRules,
  reservationStatusRules,
  availabilityQueryRules,
  mongoIdParam,
  validate,
} from '../middleware/validators.js';

const router = express.Router();

router.get('/availability', availabilityQueryRules, validate, checkAvailability);
router.get('/mine', protect, getMyReservations);
router.get('/', protect, authorize('admin'), getReservations);

router.post('/', publicWriteLimiter, optionalAuth, reservationRules, validate, createReservation);

router.patch('/:id/status', protect, authorize('admin'), mongoIdParam(), reservationStatusRules, validate, updateReservationStatus);
router.delete('/:id', protect, authorize('admin'), mongoIdParam(), validate, deleteReservation);

export default router;
