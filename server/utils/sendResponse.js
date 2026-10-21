// Keeps every successful response in the same envelope shape:
// { success: true, message, data }
const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({ success: true, message, data });
};

export default sendResponse;
