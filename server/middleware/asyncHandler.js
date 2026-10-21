// Wraps an async Express route handler so any thrown/rejected error is
// forwarded to next(), letting the central error handler deal with it —
// no repeated try/catch in every controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
