import asyncHandler from '../middleware/asyncHandler.js';
import sendResponse from '../utils/sendResponse.js';
import MenuItem from '../models/MenuItem.js';
import Reservation from '../models/Reservation.js';
import Order from '../models/Order.js';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// @route   GET /api/admin/stats
// @access  Private/Admin
// Aggregates everything the dashboard overview needs in one round trip,
// rather than shipping full collections to the client to summarize.
export const getDashboardStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalReservations,
    activeOrders,
    revenueAgg,
    menuCount,
    recentReservations,
    recentOrders,
    weekOrders,
  ] = await Promise.all([
    Reservation.countDocuments(),
    Order.countDocuments({ status: { $nin: ['Delivered', 'Cancelled'] } }),
    // Cancelled orders aren't revenue.
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    MenuItem.countDocuments(),
    Reservation.find().sort({ createdAt: -1 }).limit(4),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Order.find({ createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } }).select('totalAmount createdAt'),
  ]);

  const revenueByDay = WEEK_LABELS.map((label) => ({ label, value: 0 }));
  weekOrders.forEach((o) => {
    const day = new Date(o.createdAt).getDay();
    const idx = day === 0 ? 6 : day - 1;
    revenueByDay[idx].value += o.totalAmount || 0;
  });

  sendResponse(res, 200, 'Dashboard stats fetched', {
    totalReservations,
    activeOrders,
    totalRevenue: revenueAgg[0]?.total || 0,
    menuCount,
    recentReservations,
    recentOrders,
    revenueByDay,
  });
});
