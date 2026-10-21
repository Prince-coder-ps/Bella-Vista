// Business rules shared by controllers and validators. The server is the
// source of truth — the client only mirrors these for display.
export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 4.99;
export const MAX_QTY_PER_ITEM = 20;
export const MAX_ORDER_LINES = 30;

export const TABLE_CAPACITY_PER_SLOT = 6;
export const GUEST_OPTIONS = ['1', '2', '3', '4', '5', '6+'];
export const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM',
];

export const MIN_PASSWORD_LENGTH = 8;
