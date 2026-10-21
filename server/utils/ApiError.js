/**
 * Standardized operational error. Thrown anywhere in a controller and caught
 * by the central error handler, which knows to trust its `statusCode` and
 * `message` and send them straight to the client (as opposed to unexpected
 * bugs, which get a generic 500 in production).
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
