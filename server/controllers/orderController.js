import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { TAX_RATE, DELIVERY_FEE, MAX_QTY_PER_ITEM } from '../config/business.js';

const toCents = (dollars) => Math.round(dollars * 100);
const toDollars = (cents) => cents / 100;

// @route   POST /api/orders
// @access  Public (optionally authenticated)
// The client only says WHICH items and HOW MANY. Titles, prices, tax,
// delivery fee and the total are all computed here from the database, so a
// tampered request can't change what an order costs.
export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, paymentMethod } = req.body;

  // Merge duplicate lines for the same dish.
  const quantities = new Map();
  for (const line of items) {
    const id = String(line.menuItem);
    quantities.set(id, Math.min((quantities.get(id) || 0) + line.quantity, MAX_QTY_PER_ITEM));
  }

  const menuDocs = await MenuItem.find({ _id: { $in: [...quantities.keys()] } });
  const byId = new Map(menuDocs.map((d) => [String(d._id), d]));

  const orderItems = [];
  let subtotalCents = 0;

  for (const [id, quantity] of quantities) {
    const doc = byId.get(id);
    if (!doc) {
      throw new ApiError(400, 'An item in your cart is no longer on the menu. Please review your cart.');
    }
    if (!doc.isAvailable) {
      throw new ApiError(400, `"${doc.title}" is currently unavailable. Please remove it from your cart.`);
    }
    subtotalCents += toCents(doc.price) * quantity;
    orderItems.push({ menuItem: doc._id, title: doc.title, quantity, price: doc.price });
  }

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const deliveryCents = toCents(DELIVERY_FEE);
  const totalCents = subtotalCents + taxCents + deliveryCents;

  const order = await Order.create({
    user: req.user?._id || null,
    // Logged-in users: identity comes from the account, never from the body.
    customerName: req.user ? req.user.name : req.body.customerName,
    customerEmail: req.user ? req.user.email : req.body.customerEmail,
    items: orderItems,
    subtotal: toDollars(subtotalCents),
    tax: toDollars(taxCents),
    deliveryFee: toDollars(deliveryCents),
    totalAmount: toDollars(totalCents),
    deliveryAddress,
    paymentMethod,
  });

  sendResponse(res, 201, 'Order placed successfully', order);
});

// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = typeof status === 'string' && status !== 'All' ? { status } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Orders fetched', orders);
});

// @route   GET /api/orders/mine
// @access  Private
// Scoped by account id (not email) so guest orders placed with someone
// else's email address can never show up in — or be read from — their account.
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Your orders fetched', orders);
});

// @route   GET /api/orders/:id
// @access  Private (owner or admin)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found');

  const isOwner = order.user && order.user.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    // 404 (not 403) so order IDs can't be probed for existence.
    throw new ApiError(404, 'Order not found');
  }

  sendResponse(res, 200, 'Order fetched', order);
});

// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!order) throw new ApiError(404, 'Order not found');
  sendResponse(res, 200, 'Order status updated', order);
});
