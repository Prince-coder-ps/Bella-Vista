export const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPhone = (value = '') => /^[+]?[\d\s().-]{7,15}$/.test(value.trim());

export const isNotEmpty = (value = '') => value.trim().length > 0;

export const isStrongPassword = (value = '') => value.length >= 8;

// Today as YYYY-MM-DD in the user's LOCAL timezone (toISOString() is UTC and
// can be a day behind for users ahead of UTC, e.g. India before 5:30 AM).
export const todayLocalISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const isFutureDate = (dateStr) => {
  if (!dateStr) return false;
  const picked = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return picked >= today;
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
