// Display-side mirror of the server's pricing rules (server/config/business.js).
// The server recomputes everything on checkout — these only drive what the
// cart shows, so keep the values in sync. Math is done in whole cents so the
// numbers shown match what the server charges to the cent.
export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 4.99;

const cents = (d) => Math.round(d * 100);

export const computeTotals = (items) => {
  const subtotalC = items.reduce((sum, i) => sum + cents(i.price) * i.qty, 0);
  const taxC = Math.round(subtotalC * TAX_RATE);
  const deliveryC = items.length > 0 ? cents(DELIVERY_FEE) : 0;
  return {
    subtotal: subtotalC / 100,
    tax: taxC / 100,
    deliveryFee: deliveryC / 100,
    total: (subtotalC + taxC + deliveryC) / 100,
    count: items.reduce((sum, i) => sum + i.qty, 0),
  };
};
