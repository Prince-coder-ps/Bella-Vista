// The actual menu data now lives in MongoDB (seeded via server/seed/menuData.js)
// and is fetched through menuService. This file just keeps the category list
// in one place, shared by the public Menu page filter tabs and the Admin
// menu form's category dropdown.
export const CATEGORIES = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];
