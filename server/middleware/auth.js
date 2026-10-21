import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

// Verifies the access token from the Authorization header and attaches the
// authenticated user (minus password) to req.user.
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

  if (!token) {
    throw new ApiError(401, 'Not authorized — no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired');
    }
    throw new ApiError(401, 'Not authorized — invalid token');
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new ApiError(401, 'Not authorized — user no longer exists');
  }

  req.user = user;
  next();
});

// Populates req.user if a valid token is present, but does not reject the
// request if it's missing/invalid — for routes usable by guests and
// logged-in users alike (e.g. creating a reservation).
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.sub);
    if (user) req.user = user;
  } catch {
    // Silently ignore — treat as guest.
  }
  next();
});

// Restricts a route to one or more roles. Use after `protect`.
export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};
