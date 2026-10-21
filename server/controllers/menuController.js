import asyncHandler from '../middleware/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import sendResponse from '../utils/sendResponse.js';
import MenuItem from '../models/MenuItem.js';

// @route   GET /api/menu
// @access  Public
export const getMenu = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (typeof category === 'string' && category !== 'All') filter.category = category;
  if (typeof search === 'string' && search.trim()) filter.$text = { $search: search.trim().slice(0, 100) };

  const items = await MenuItem.find(filter).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Menu fetched', items);
});

// @route   GET /api/menu/:id
// @access  Public
export const getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Menu item not found');
  sendResponse(res, 200, 'Menu item fetched', item);
});

// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = asyncHandler(async (req, res) => {
  const { title, description, price, category, image, isChefSpecial } = req.body;
  const item = await MenuItem.create({ title, description, price, category, image: image || undefined, isChefSpecial });
  sendResponse(res, 201, 'Menu item created', item);
});

// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = asyncHandler(async (req, res) => {
  // Whitelist fields — never pass req.body straight to the query (mass assignment).
  const { title, description, price, category, image, isChefSpecial, isAvailable } = req.body;
  const update = { title, description, price, category, isChefSpecial };
  if (image) update.image = image;
  if (typeof isAvailable === 'boolean') update.isAvailable = isAvailable;

  const item = await MenuItem.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, 'Menu item not found');
  sendResponse(res, 200, 'Menu item updated', item);
});

// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Menu item not found');
  sendResponse(res, 200, 'Menu item deleted');
});

// @route   PATCH /api/menu/:id/toggle
// @access  Private/Admin
export const toggleAvailability = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Menu item not found');
  item.isAvailable = !item.isAvailable;
  await item.save();
  sendResponse(res, 200, 'Availability updated', item);
});
