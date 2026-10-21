import asyncHandler from '../middleware/asyncHandler.js';
import sendResponse from '../utils/sendResponse.js';
import Contact from '../models/Contact.js';

// @route   POST /api/contact
// @access  Public (optionally authenticated)
export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  await Contact.create({ user: req.user?._id || null, name, email, subject, message });
  sendResponse(res, 201, "Message received. We'll get back to you within 24 hours.");
});
