import ApiError from '../utils/ApiError.js';

const isProd = process.env.NODE_ENV === 'production';

// Translates common Mongoose/JWT errors into clean, predictable ApiErrors so
// the client always gets the same { success, message, errors } shape.
// Anything unrecognised becomes a NON-operational 500 with a generic message,
// so internal details never reach the client.
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err.name === 'CastError') {
    return new ApiError(400, `Invalid value for field "${err.path}"`);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return new ApiError(400, 'Validation failed', errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ApiError(409, `An account with this ${field} already exists`);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return new ApiError(401, 'Invalid or expired token');
  }

  // Body-parser errors (malformed JSON, payload too large) carry a 4xx status.
  if (err.type === 'entity.parse.failed') return new ApiError(400, 'Malformed JSON body');
  if (err.type === 'entity.too.large') return new ApiError(413, 'Request body too large');

  const unexpected = new ApiError(500, 'Something went wrong on our side. Please try again.');
  unexpected.isOperational = false;
  return unexpected;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const apiError = normalizeError(err);

  if (!apiError.isOperational) {
    console.error('UNEXPECTED ERROR:', err);
  } else if (process.env.NODE_ENV !== 'test') {
    console.error(`[${apiError.statusCode}] ${apiError.message}`);
  }

  res.status(apiError.statusCode || 500).json({
    success: false,
    message: apiError.message,
    errors: apiError.errors || [],
    ...(!isProd && !apiError.isOperational && { debug: err.message, stack: err.stack }),
  });
};

export default errorHandler;
