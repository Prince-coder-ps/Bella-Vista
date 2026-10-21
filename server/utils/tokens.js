import jwt from 'jsonwebtoken';

// Short-lived access token — sent in the JSON response body, kept in memory
// on the client and attached as `Authorization: Bearer <token>`.
export const generateAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

// Long-lived refresh token — sent only as an httpOnly cookie, never exposed
// to client-side JS, used solely to mint new access tokens.
export const generateRefreshToken = (user) =>
  jwt.sign({ sub: user._id.toString(), tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const REFRESH_COOKIE_NAME = 'bv_refresh_token';

export const setRefreshTokenCookie = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
};

export { REFRESH_COOKIE_NAME };
