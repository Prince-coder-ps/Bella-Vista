import rateLimit from 'express-rate-limit';

const base = { standardHeaders: true, legacyHeaders: false };
const msg = (message) => ({ success: false, message });

// General API limiter — generous, mainly to blunt scraping/abuse.
export const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: msg('Too many requests, please try again later.'),
});

// Login/register — brute-force & credential-stuffing protection.
// Successful logins don't count against the budget.
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  message: msg('Too many attempts, please try again in a few minutes.'),
});

// Silent session restore happens on every page load, so it gets a looser
// bucket than login and can't lock real users out.
export const refreshLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: msg('Too many session refresh attempts, please try again shortly.'),
});

// Public write endpoints (orders, reservations, contact) — stops spam floods.
export const publicWriteLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: msg('Too many submissions from this network. Please try again later.'),
});
