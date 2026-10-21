// Creates the admin account if it doesn't exist, or resets its password and
// role if it does. Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env.
//
//   npm run admin:reset
//
// Safe to run any time; touches only the one admin user.
import 'dotenv/config';
import mongoose from 'mongoose';
import validator from 'validator';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { MIN_PASSWORD_LENGTH } from '../config/business.js';

const rawEmail = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!rawEmail || !validator.isEmail(rawEmail)) {
  console.error('Set a valid ADMIN_EMAIL in server/.env first.');
  process.exit(1);
}
if (!password || password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Set ADMIN_PASSWORD in server/.env (at least ${MIN_PASSWORD_LENGTH} characters) first.`);
  process.exit(1);
}

// Must match how the login form's validator normalises what the user types.
const email = rawEmail.trim().toLowerCase(); // must match login: lowercase only

const run = async () => {
  await connectDB();

  let user = await User.findOne({ email }).select('+password');
  if (user) {
    user.password = password; // re-hashed by the model's pre-save hook
    user.role = 'admin';
    user.tokenVersion = (user.tokenVersion || 0) + 1; // sign out any old sessions
    await user.save();
    console.log(`Admin password reset for: ${email}`);
  } else {
    user = await User.create({ name: process.env.ADMIN_NAME || 'Admin', email, password, role: 'admin' });
    console.log(`Admin account created: ${email}`);
  }

  console.log('\nLog in with:');
  console.log(`  email:    ${rawEmail.trim()}`);
  console.log('  password: the ADMIN_PASSWORD value in server/.env');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
