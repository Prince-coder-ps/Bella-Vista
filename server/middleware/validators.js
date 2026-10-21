import { validationResult, body, param, query } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import {
  GUEST_OPTIONS,
  TIME_SLOTS,
  MIN_PASSWORD_LENGTH,
  MAX_QTY_PER_ITEM,
  MAX_ORDER_LINES,
} from '../config/business.js';

// Run after any express-validator chain(s) to collect and throw errors in
// our standard ApiError shape.
export const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const messages = result.array().map((e) => e.msg);
    throw new ApiError(400, messages[0] || 'Validation failed', messages);
  }
  next();
};

const CATEGORIES = ['Appetizers', 'Main Course', 'Desserts', 'Beverages'];
const PHONE_RE = /^[+]?[\d\s().-]{7,20}$/;

// YYYY-MM-DD, a real calendar date, and not in the past. We allow "yesterday
// in UTC" so users in timezones ahead of the server aren't rejected.
const isBookableDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return false;
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  const earliest = todayUtc.getTime() - 24 * 60 * 60 * 1000;
  const latest = todayUtc.getTime() + 180 * 24 * 60 * 60 * 1000; // book up to ~6 months ahead
  return d.getTime() >= earliest && d.getTime() <= latest;
};

// Lowercase only. The default normalizeEmail() also strips dots/+tags from
// Gmail addresses, which made the stored email differ from what the user typed.
export const SAFE_EMAIL_NORMALIZE = {
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
  outlookdotcom_remove_subaddress: false,
  yahoo_remove_subaddress: false,
  icloud_remove_subaddress: false,
};

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name is too long'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(SAFE_EMAIL_NORMALIZE),
  body('password')
    .isString()
    .isLength({ min: MIN_PASSWORD_LENGTH, max: 128 })
    .withMessage(`Password must be ${MIN_PASSWORD_LENGTH}-128 characters`),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(SAFE_EMAIL_NORMALIZE),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

export const menuItemRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 500 }),
  body('price').isFloat({ min: 0, max: 10000 }).withMessage('Price must be a positive number').toFloat(),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('image')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Image must be a valid http(s) URL'),
  body('isChefSpecial').optional().isBoolean().withMessage('isChefSpecial must be true or false').toBoolean(),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be true or false').toBoolean(),
];

export const reservationRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }).withMessage('Name is too long'),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('phone').trim().matches(PHONE_RE).withMessage('Enter a valid phone number'),
  body('date').custom(isBookableDate).withMessage('Choose a valid upcoming date'),
  body('time').isIn(TIME_SLOTS).withMessage('Choose a valid time slot'),
  body('guests').isIn(GUEST_OPTIONS).withMessage('Choose a valid number of guests'),
  body('message').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Message is too long (500 max)'),
];

export const reservationStatusRules = [
  body('status').isIn(['Pending', 'Confirmed', 'Cancelled']).withMessage('Invalid status'),
];

// NOTE: no price/total fields here on purpose — the server computes money.
// Name/email are required only for guests; logged-in users use their account.
export const orderRules = [
  body('customerName')
    .if((_v, { req }) => !req.user)
    .trim()
    .notEmpty()
    .withMessage('Your name is required')
    .isLength({ max: 80 })
    .withMessage('Name is too long'),
  body('customerEmail')
    .if((_v, { req }) => !req.user)
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
  body('items')
    .isArray({ min: 1, max: MAX_ORDER_LINES })
    .withMessage(`Order must contain between 1 and ${MAX_ORDER_LINES} items`),
  body('items.*.menuItem').isMongoId().withMessage('Invalid menu item in order'),
  body('items.*.quantity')
    .isInt({ min: 1, max: MAX_QTY_PER_ITEM })
    .withMessage(`Quantity must be between 1 and ${MAX_QTY_PER_ITEM}`)
    .toInt(),
  body('deliveryAddress')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ max: 300 })
    .withMessage('Delivery address is too long'),
  body('paymentMethod').optional().isIn(['card', 'paypal', 'cod']).withMessage('Invalid payment method'),
];

export const orderStatusRules = [
  body('status')
    .isIn(['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'])
    .withMessage('Invalid status'),
];

export const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 150 }).withMessage('Subject is too long'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message is too long'),
];

export const mongoIdParam = (name = 'id') => [param(name).isMongoId().withMessage('Invalid ID')];

export const availabilityQueryRules = [
  query('date').custom(isBookableDate).withMessage('Choose a valid date'),
  query('time').isIn(TIME_SLOTS).withMessage('Choose a valid time slot'),
];
