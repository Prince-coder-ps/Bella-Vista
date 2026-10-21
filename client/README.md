# Bella Vista — Client (React + Vite + Tailwind)

The frontend half of the Bella Vista MERN restaurant platform. Talks to the real Express/MongoDB
API in `../server` for menu data, reservations, orders, and authentication.

## Getting Started

```bash
cd client
npm install
cp .env.example .env   # defaults to http://localhost:5000/api — fine for local dev
npm run dev
```

Visit `http://localhost:5173`. **The backend must be running** (see `server/README.md`) —
this app no longer has a mock/offline mode; menu items, login, reservations, and orders all
go through the real API.

## Demo Credentials

Seeded by `npm run seed` in `server/`:

| Role     | Email                      | Password     |
|----------|-----------------------------|--------------|
| Admin    | admin@bellavista.com        | Admin@1234   |
| Customer | guest@bellavista.com        | Guest@1234   |

Admin dashboard: `http://localhost:5173/admin/login`

## Auth Architecture

- On login/register, the API returns a short-lived **access token** (15 min) in the response
  body and sets a long-lived **refresh token** as an httpOnly cookie.
- The access token is kept **in memory only** (`src/services/api.js`), not localStorage —
  this limits what an XSS attack could steal, since it can't read a JS closure variable the
  way it can read localStorage.
- An axios response interceptor automatically calls `/api/auth/refresh` on a 401 and retries
  the original request once, so sessions survive a page refresh and short-lived tokens expiring
  mid-session without forcing a re-login.
- Route guards (`src/routes/ProtectedRoute.jsx`, `AdminRoute.jsx`) block access to `/account`
  and `/admin/*` until the auth check resolves.

## What's still client-only (by design)

- **Cart** (`CartContext`) — stays in `localStorage` until checkout. This is standard practice
  for e-commerce carts (no need to round-trip to a server for every quantity change) and isn't
  a security concern since it holds no sensitive data.
- **Contact form** — currently simulates a network call (`pages/Contact.jsx`); wire it to a real
  `POST /api/contact` endpoint if you want submissions to actually be stored/emailed.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Folder Guide

```
src/
├── admin/            # Admin-only pages (dashboard, menu/reservation/order management)
├── components/        # layout, ui, home, menu, cart, admin components
├── context/            # AuthContext, CartContext
├── data/               # menuCategories.js — shared category list for filters/forms
├── hooks/              # useScrollReveal, useDebounce
├── pages/              # public-facing route pages
├── routes/             # ProtectedRoute, AdminRoute guards
├── services/           # real API layer (axios) — auth, menu, reservations, orders, admin stats
└── utils/               # constants, validators, formatters
```
