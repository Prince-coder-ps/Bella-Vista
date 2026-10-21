import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { computeTotals } from '../utils/pricing';

const CartContext = createContext(null);
const STORAGE_KEY = 'bv_cart';
const MAX_QTY = 20; // matches server MAX_QTY_PER_ITEM

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full/blocked — cart still works for this session.
    }
  }, [items]);

  const addItem = useCallback((menuItem, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === menuItem._id);
      if (existing) {
        return prev.map((i) => (i._id === menuItem._id ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i));
      }
      return [...prev, { ...menuItem, qty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i._id !== id) : prev.map((i) => (i._id === id ? { ...i, qty: Math.min(qty, MAX_QTY) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  // Refresh cart lines against the live menu: picks up price changes and
  // availability, and drops dishes that no longer exist. Returns what changed
  // so the caller can tell the customer.
  const syncWithMenu = useCallback((menu) => {
    const byId = new Map(menu.map((m) => [m._id, m]));
    const report = { removed: [], repriced: [], unavailable: [] };
    setItems((prev) =>
      prev.flatMap((line) => {
        const fresh = byId.get(line._id);
        if (!fresh) {
          report.removed.push(line.title);
          return [];
        }
        if (fresh.price !== line.price) report.repriced.push(fresh.title);
        if (!fresh.isAvailable) report.unavailable.push(fresh.title);
        return [{ ...line, ...fresh, qty: line.qty }];
      })
    );
    return report;
  }, []);

  const totals = useMemo(() => computeTotals(items), [items]);

  const value = {
    items,
    ...totals,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    addItem,
    removeItem,
    updateQty,
    clearCart,
    syncWithMenu,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
