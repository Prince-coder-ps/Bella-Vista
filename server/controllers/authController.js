import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import User from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
} from '../utils/tokens.js';

// Compared against when the email doesn't exist, so response time doesn't
// reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

// Old accounts may have been stored with the legacy (dot-stripped) Gmail form,
// so look up both the email as typed and the legacy-normalised one.
const emailCandidates = (email) => {
  const legacy = validator.normalizeEmail(email);
  return [...new Set([email, legacy].filter(Boolean))];
};

// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: { $in: emailCandidates(email) } });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // Password hashing happens automatically in the User model's pre-save hook (bcrypt, 12 salt rounds).
  const user = await User.create({ name, email, password, role: 'customer' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, 201, 'Account created successfully', { user, accessToken });
});

// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: { $in: emailCandidates(email) } }).select('+password');
  const passwordOk = user ? await user.comparePassword(password) : await bcrypt.compare(password, DUMMY_HASH);
  if (!user || !passwordOk) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  setRefreshTokenCookie(res, refreshToken);

  const safeUser = user.toObject();
  delete safeUser.password;

  sendResponse(res, 200, 'Logged in successfully', { user: safeUser, accessToken });
});

// @route   POST /api/auth/refresh
// @access  Public (requires valid refresh cookie)
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    throw new ApiError(401, 'No refresh token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.sub);
  if (!user || user.tokenVersion !== decoded.tokenVersion) {
    throw new ApiError(401, 'Refresh token is no longer valid');
  }

  const accessToken = generateAccessToken(user);
  sendResponse(res, 200, 'Access token refreshed', { accessToken });
});

// @route   POST /api/auth/logout
// @access  Public
// Besides clearing the cookie, bump tokenVersion so the refresh token (which
// may have been copied elsewhere) is dead server-side too. Note: this signs
// the account out of all devices.
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      await User.updateOne({ _id: decoded.sub, tokenVersion: decoded.tokenVersion }, { $inc: { tokenVersion: 1 } });
    } catch {
      // Expired/invalid cookie — nothing to revoke.
    }
  }
  clearRefreshTokenCookie(res);
  sendResponse(res, 200, 'Logged out successfully');
});

// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'Current user fetched', { user: req.user });
});
