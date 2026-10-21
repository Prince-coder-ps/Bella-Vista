import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';
import menuSeed from './menuData.js';

// Same normalisation the login/register validators apply, so the stored email
// always matches what a user types at the login form.
const normalize = (e) => String(e).trim().toLowerCase(); // must match login: lowercase only

const destroy = process.argv.includes('--destroy');
const isProd = process.env.NODE_ENV === 'production';

// Never create a well-known admin account in production.
if (isProd && !destroy) {
  const pw = process.env.ADMIN_PASSWORD || '';
  if (pw.length < 12 || /^admin@1234$/i.test(pw)) {
    console.error('Refusing to seed in production: set ADMIN_PASSWORD to a strong value (12+ chars, not the demo default).');
    process.exit(1);
  }
}

const run = async () => {
  await connectDB();

  if (destroy) {
    await Promise.all([User.deleteMany(), MenuItem.deleteMany()]);
    console.log('All users and menu items removed.');
    await mongoose.connection.close();
    process.exit(0);
  }

  // --- Admin user --------------------------------------------------------
  const adminEmail = normalize(process.env.ADMIN_EMAIL || 'admin@bellavista.com');
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    // Password is hashed automatically by the User model's pre-save hook (bcrypt).
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin',
    });
    console.log(`Admin account created: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping. (Forgot the password? run: npm run admin:reset)');
  }

  // --- Demo customer (development only) --------------------------------------
  const customerEmail = normalize(process.env.CUSTOMER_EMAIL || 'guest@bellavista.com');
  const existingCustomer = isProd ? true : await User.findOne({ email: customerEmail });
  if (!existingCustomer) {
    await User.create({
      name: process.env.CUSTOMER_NAME || 'Guest Diner',
      email: customerEmail,
      password: process.env.CUSTOMER_PASSWORD || 'Guest@1234',
      role: 'customer',
    });
    console.log(`Demo customer account created: ${customerEmail}`);
  } else {
    console.log(isProd ? 'Production: skipping demo customer.' : 'Demo customer account already exists, skipping.');
  }

  // --- Menu items ----------------------------------------------------------
  const menuCount = await MenuItem.countDocuments();
  if (menuCount === 0) {
    await MenuItem.insertMany(menuSeed);
    console.log(`Seeded ${menuSeed.length} menu items.`);
  } else {
    console.log('Menu items already exist, skipping.');
  }

  console.log('Seeding complete.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
