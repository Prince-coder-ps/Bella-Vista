# Bella Vista — Server (Node.js + Express + MongoDB)

Secure REST API for the Bella Vista restaurant platform.

## Tech Stack & Security

- **Express** — routing, middleware
- **MongoDB + Mongoose** — data layer, schema validation
- **JWT (jsonwebtoken)** — short-lived access tokens (Authorization header) + long-lived
  refresh tokens (httpOnly, secure cookie) — access-token-in-memory / refresh-in-cookie is
  the standard defense against XSS token theft
- **bcryptjs** — passwords hashed with a 12-round salt before storage; the raw password is
  never persisted or returned by any endpoint (`select: false` on the schema field)
- **helmet** — sets protective HTTP headers
- **express-rate-limit** — general API limiter + a stricter limiter on auth routes to blunt
  brute-force/credential-stuffing attempts
- **express-mongo-sanitize** — strips `$`/`.` operators from user input to prevent NoSQL
  injection
- **express-validator** — request validation on every write endpoint
- **cors** — locked to `CLIENT_URL` with `credentials: true` (required for the refresh cookie)
- **Centralized error handling** — every response (success or failure) follows the same
  `{ success, message, data }` / `{ success, message, errors }` shape

## Getting Started

```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT secrets
npm run seed            # creates the admin/demo accounts + seed menu data
npm run dev              # starts on http://localhost:5000
```

Generate strong JWT secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB

Use either:
- **MongoDB Atlas** (free tier) — create a cluster, get the connection string, paste into `MONGO_URI`
- **Local MongoDB** — `mongodb://127.0.0.1:27017/bella-vista`

## Demo Credentials (after `npm run seed`)

| Role     | Email                 | Password    |
|----------|------------------------|-------------|
| Admin    | admin@bellavista.com   | Admin@1234  |
| Customer | guest@bellavista.com   | Guest@1234  |

## API Overview

```
GET    /api/health

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh          (reads httpOnly refresh cookie)
POST   /api/auth/logout
GET    /api/auth/me               (protected)

GET    /api/menu                  ?category=&search=
GET    /api/menu/:id
POST   /api/menu                  (admin)
PUT    /api/menu/:id              (admin)
DELETE /api/menu/:id              (admin)
PATCH  /api/menu/:id/toggle       (admin)

GET    /api/reservations/availability  ?date=&time=
POST   /api/reservations
GET    /api/reservations/mine     (protected)
GET    /api/reservations          (admin)
PATCH  /api/reservations/:id/status (admin)
DELETE /api/reservations/:id      (admin)

POST   /api/orders
GET    /api/orders/mine           (protected)
GET    /api/orders/:id            (owner or admin)
GET    /api/orders                (admin)
PATCH  /api/orders/:id/status     (admin)

GET    /api/admin/stats           (admin — dashboard aggregation)
```

## Auth Flow

1. `POST /api/auth/login` returns `{ user, accessToken }` and sets an httpOnly `bv_refresh_token` cookie.
2. The client stores `accessToken` in memory and sends it as `Authorization: Bearer <token>` on every request.
3. When the access token expires (15 min default), the client calls `POST /api/auth/refresh`
   (cookie sent automatically) to get a new one, transparently, without forcing a re-login.
4. `POST /api/auth/logout` clears the refresh cookie.

## Scripts

- `npm run dev` — start with nodemon (auto-restart)
- `npm start` — start in production mode
- `npm run seed` — seed admin/demo users + menu items
- `npm run seed:destroy` — wipe users + menu items

