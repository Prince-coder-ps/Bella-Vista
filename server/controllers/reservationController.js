import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import Reservation from '../models/Reservation.js';
import { TABLE_CAPACITY_PER_SLOT } from '../config/business.js';

const countActive = (date, time) =>
  Reservation.countDocuments({ date, time, status: { $ne: 'Cancelled' } });

// @route   POST /api/reservations
// @access  Public (optionally authenticated)
export const createReservation = asyncHandler(async (req, res) => {
  const { name, email, phone, date, time, guests, message } = req.body;

  if ((await countActive(date, time)) >= TABLE_CAPACITY_PER_SLOT) {
    throw new ApiError(409, 'Sorry, that time slot is fully booked. Please pick another slot.');
  }

  const reservation = await Reservation.create({
    user: req.user?._id || null,
    name,
    email,
    phone,
    date,
    time,
    guests,
    message,
  });

  // Re-check after writing: if two requests raced for the last table, the
  // slot is now over capacity, so undo this one. (Fails safe — in the rare
  // exact tie both may be rejected, but the slot is never overbooked.)
  if ((await countActive(date, time)) > TABLE_CAPACITY_PER_SLOT) {
    await Reservation.findByIdAndDelete(reservation._id);
    throw new ApiError(409, 'Sorry, that time slot was just booked. Please pick another slot.');
  }

  sendResponse(res, 201, 'Reservation submitted successfully', reservation);
});

// @route   GET /api/reservations/availability?date=&time=
// @access  Public
export const checkAvailability = asyncHandler(async (req, res) => {
  const { date, time } = req.query;
  const bookedCount = await countActive(date, time);
  const remaining = Math.max(TABLE_CAPACITY_PER_SLOT - bookedCount, 0);
  sendResponse(res, 200, 'Availability checked', { available: remaining > 0, remaining });
});

// @route   GET /api/reservations
// @access  Private/Admin
export const getReservations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = typeof status === 'string' && status !== 'All' ? { status } : {};
  const reservations = await Reservation.find(filter).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Reservations fetched', reservations);
});

// @route   GET /api/reservations/mine
// @access  Private
// Scoped by account id, not email — see getMyOrders.
export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Your reservations fetched', reservations);
});

// @route   PATCH /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!reservation) throw new ApiError(404, 'Reservation not found');
  sendResponse(res, 200, 'Reservation status updated', reservation);
});

// @route   DELETE /api/reservations/:id
// @access  Private/Admin
export const deleteReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) throw new ApiError(404, 'Reservation not found');
  sendResponse(res, 200, 'Reservation deleted');
});
