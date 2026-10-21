# Fixes applied

Everything from the review, grouped by severity. Server logic was verified with stubbed-model tests
(pricing, validation, capacity race, ownership, error leakage, secret validation); the client passes
`npm run lint` with zero warnings and bundles cleanly. See "Not verified" at the bottom.

## Security

| # | Problem | Fix |
|---|---------|-----|
| 1 | Client could set order price/total | `orderController` recomputes everything from the DB (cents math); client sends only `menuItem` + `quantity`; unavailable/deleted items rejected; qty capped at 20; duplicate lines merged |
| 2 | Guest orders leaked into the demo account (`guest@bellavista.com`) | Guests must enter their own name/email; `/mine` endpoints and `/orders/:id` now check `user` id, not email; non-owners get 404 |
| 3 | Known admin password + placeholder JWT secrets | Server refuses to start with missing/placeholder/short/identical secrets; seed refuses weak admin password in production and skips the demo customer; demo credentials only render in dev builds (verified absent from the production bundle) |
| 4 | Internal error text sent to clients | Unknown errors are now non-operational → generic message to client, full detail in server logs |
| 5 | Refresh tokens never revoked | `logout` bumps `tokenVersion` (signs out all devices) |
| 6 | Rate-limit gaps | `TRUST_PROXY` support; separate limiters: login (successes don't count), refresh (120/15 min), public writes (30/h) on orders, reservations, contact; client no longer calls `/auth/refresh` for visitors who never logged in |
| 7 | Weak validation / mass assignment | Strict reservation date/time/guests/phone validation; order item validation; password min 8; `image` must be http(s) URL; `updateMenuItem` whitelists fields; query params type-checked |
| 8 | Login timing revealed which emails exist | Dummy bcrypt compare when the user doesn't exist |

## Functional bugs

- Reservation capacity is now **enforced on create** (with post-write race rollback), not just advisory.
- Dashboard crashed to a blank page when the stats request failed (`stats` was `null`).
- Revenue stats included **cancelled** orders.
- Login/Register/AdminLogin showed "Request failed with status code 401" → now show the API's message.
- Checkout spun forever on failure; Reservation, MyAccount, Menu, Featured menu and all admin pages swallowed errors → proper try/catch + toasts.
- Session expiry mid-use left the UI looking logged in → `AuthContext` now reacts to refresh failure.
- Reservation date picker used UTC (a day behind in India before 5:30 AM) → local date.
- Cart prices/availability went stale → synced against the live menu on checkout; client totals use the same cents rounding as the server (verified identical on 20,000 random carts).
- Contact form was fake → real `POST /api/contact` (stored in MongoDB).
- Misleading copy: "Total Paid" → "Order Total"; promised confirmation email removed.
- Removed dead code (`localDb.js`, `mockMenu.js`) and fixed 5 pre-existing lint errors.
- Added DB indexes for order/reservation lookups, graceful shutdown, DB-aware `/api/health`.

## Action required on your side

1. **Rotate secrets.** Your old `.env` used placeholder secrets and the zip contained it. Create new ones:
   `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` (run twice) → `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`.
   The server will not start until you do.
2. In production set `NODE_ENV=production`, `CLIENT_URL`, `TRUST_PROXY=1` (if behind a proxy) and a strong `ADMIN_PASSWORD` (12+ chars).
3. Existing users with 6–7 character passwords can still log in; the new 8-char minimum applies to new accounts.
4. Orders placed *before* this change by logged-in users still appear in their account (they have `user` set); old guest orders won't appear anywhere except the admin panel.

## Not verified

- I could not run against a real MongoDB or start the Vite dev server here (no database; your `node_modules` is Windows-only so Vite's native binaries won't load on Linux). Please run `npm run seed && npm run dev` in both folders and click through: guest checkout, logged-in checkout, reservation until a slot fills, admin status changes.
- Known remaining limits: no email sending, no admin inbox for contact messages, no payment integration, no pagination, no automated test suite in the repo.

## Follow-up: login

- Removed the demo-credentials panel from the Login page, the "fill demo admin" button from the admin login, and the `DEMO_*` constants. No credentials exist anywhere in the client code now.
- Added `npm run admin:reset` (server): creates the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, or resets that user's password and role if it already exists.
- `seed.js` and the reset script now normalise the admin email exactly like the login form does (for example `john.doe@gmail.com` is stored and matched as `johndoe@gmail.com`), which previously could make a correct login return 401.
