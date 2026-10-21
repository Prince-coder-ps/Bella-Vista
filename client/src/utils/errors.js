// Turns whatever an axios call throws into a message safe to show a user.
// Prefers the API's own message (err.response.data.message) over axios's
// generic "Request failed with status code 401".
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ERR_NETWORK' || (err?.request && !err?.response)) {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (err?.response?.status === 429) return 'Too many requests — please wait a moment and try again.';
  return fallback;
};
