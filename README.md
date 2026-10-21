# Bella Vista — Full-Stack MERN Restaurant Platform

Converted from a static HTML/CSS/JS site into a complete MERN application: React frontend,
Express/MongoDB REST API, JWT authentication, bcrypt password hashing, and a full admin
dashboard.

## Status

- ✅ **`client/`** — React + Vite + Tailwind frontend, fully built.
- ✅ **`server/`** — Node/Express + MongoDB API, fully built: JWT auth, bcrypt, rate limiting,
  input validation, and CRUD for menu/reservations/orders.
- Both are wired together — the client calls the real API, not mock data.

## Quick Start

**1. Backend:**
```bash
cd server
npm install
cp .env.example .env      # set MONGO_URI + two DIFFERENT JWT secrets (the server refuses to start
                          # with missing/placeholder secrets; the .env.example shows how to generate them)
npm run seed                # creates admin/demo accounts + seed menu data
npm run dev                  # http://localhost:5000
```

**2. Frontend** (in a second terminal):
```bash
cd client
npm install
cp .env.example .env
npm run dev                  # http://localhost:5173
```

**3. Log in** (demo accounts exist only in development — the seed skips the demo customer in production and refuses a weak admin password):
- Customer: `guest@bellavista.com` / `Guest@1234`
- Admin: `admin@bellavista.com` / `Admin@1234` → `/admin/login`

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Framer Motion, Axios, React Icons,
react-hot-toast — no TypeScript.

**Backend:** Node.js, Express, MongoDB + Mongoose, JWT (access + refresh tokens), bcryptjs,
helmet, express-rate-limit, express-mongo-sanitize, express-validator.

## Architecture Notes (why this is resume-worthy, not just a UI reskin)

- **Real auth, done the safer way** — access tokens live in memory on the client (not
  localStorage), refresh tokens are httpOnly cookies, and token refresh is transparent via an
  axios interceptor. Passwords are bcrypt-hashed server-side with a 12-round salt and never
  returned in any API response.
- **Role-based access control** end-to-end — `authorize('admin')` middleware on the server,
  `AdminRoute`/`ProtectedRoute` guards on the client.
- **Input validation on every write endpoint** via `express-validator`, with a centralized
  error handler that normalizes Mongoose validation/cast/duplicate-key errors into one
  consistent API response shape.
- **Efficient dashboard** — `/api/admin/stats` aggregates counts and revenue in a handful of
  parallel Mongo queries server-side, rather than shipping full collections to the client to
  summarize.
- **Clean separation of concerns** — `client/src/services/` is the only place that knows about
  HTTP; components never call `axios` or `fetch` directly.

## Security hardening notes

- **Orders are priced on the server.** The client sends only `{ menuItem, quantity }`; titles, prices, tax,
  delivery fee and the total are recomputed from the database. Unavailable/deleted dishes are rejected.
- **Ownership is by account id**, not email, for `/orders/mine`, `/reservations/mine` and `/orders/:id`.
- Startup validation of JWT secrets, `TRUST_PROXY` support, separate rate limiters (login, refresh, public writes),
  refresh-token revocation on logout, and generic 500 messages (internals are logged, never returned).

## Known Simplifications (good talking points in an interview, not hidden gaps)

- No payment gateway is integrated — checkout collects card fields but doesn't charge them
  (clearly labeled "demo only" in the UI). Swapping in Stripe would touch `Checkout.jsx` and a
  new `server/controllers/paymentController.js`.
- No image upload — menu item images are entered as URLs. Adding Multer + Cloudinary for real
  uploads would touch `ManageMenu.jsx` and `menuController.js`.
- Contact-form messages are stored in MongoDB (`Contact` model) but there is no admin inbox or email notification yet.
- No transactional email — reservation/order confirmations are shown on screen only.
- No pagination on admin list views — fine at demo scale, would need `?page=&limit=` params
  and cursor/offset queries at real scale.
