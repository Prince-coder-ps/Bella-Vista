// Validates required environment variables at startup so the API never runs
// with missing or placeholder secrets (which would make JWTs forgeable).
const PLACEHOLDER = /replace_with|changeme|your_secret|secret_here/i;
const isProd = process.env.NODE_ENV === 'production';

const fail = (msg) => {
  console.error(`\n[config] ${msg}\n`);
  process.exit(1);
};

export const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
  for (const key of required) {
    if (!process.env[key]) fail(`Missing required environment variable: ${key}`);
  }

  for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    const value = process.env[key];
    if (PLACEHOLDER.test(value) || value.length < 32) {
      fail(
        `${key} is a placeholder or shorter than 32 characters. Generate one with:\n` +
          `  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
      );
    }
  }

  if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    fail('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.');
  }

  if (isProd && !process.env.CLIENT_URL) {
    fail('CLIENT_URL must be set in production (used for CORS and cookies).');
  }
};

// CLIENT_URL may hold several comma-separated origins.
export const getAllowedOrigins = () =>
  (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
