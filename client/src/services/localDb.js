// A tiny localStorage-backed persistence layer that stands in for MongoDB during
// frontend-only development. Every function here returns a Promise and mimics
// network latency, so every call site already behaves exactly like a real axios
// call will once `server/` is live — swapping the implementation is a one-line change.

const NAMESPACE = 'bv_';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(NAMESPACE + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
};

export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = { read, write };

export const genId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
