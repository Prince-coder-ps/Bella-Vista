import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCheck, FiCreditCard, FiMapPin, FiShoppingBag, FiUser } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import Spinner from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { fetchMenu } from '../services/menuService';
import { getErrorMessage } from '../utils/errors';
import { isValidEmail, isNotEmpty } from '../utils/validators';
import { formatCurrency } from '../utils/validators';

export default function Checkout() {
  const { items, subtotal, tax, deliveryFee, total, clearCart, syncWithMenu } = useCart();
  const { user } = useAuth();
  const [guest, setGuest] = useState({ name: '', email: '' });
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errors, setErrors] = useState({});
  // Derived from the cart (kept fresh by syncWithMenu), so removing a line clears the warning.
  const unavailable = items.filter((i) => i.isAvailable === false).map((i) => i.title);

  // The cart is stored in the browser, so prices/availability may be stale.
  // Re-check against the live menu when checkout opens and tell the customer
  // about anything that changed (the server also re-prices every order).
  useEffect(() => {
    if (items.length === 0 || placedOrder) return undefined;
    let cancelled = false;
    fetchMenu()
      .then((menu) => {
        if (cancelled) return;
        const report = syncWithMenu(menu);
        if (report.removed.length) toast.error(`No longer on the menu and removed: ${report.removed.join(', ')}`);
        if (report.repriced.length) toast(`Prices updated for: ${report.repriced.join(', ')}`);
      })
      .catch(() => {
        /* offline/API error — the server still validates on submit */
      });
    return () => {
      cancelled = true;
    };
    // Run once per checkout visit, not on every cart edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    const next = {};
    if (!user) {
      if (!isNotEmpty(guest.name)) next.name = 'Please enter your name';
      if (!isValidEmail(guest.email)) next.email = 'Enter a valid email address';
    }
    if (!address.trim()) next.address = 'Please enter a delivery address';
    if (unavailable.length) next.items = `Please remove unavailable items: ${unavailable.join(', ')}`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      // Only identify the dishes and quantities — the server prices the order.
      const order = await createOrder({
        ...(user ? {} : { customerName: guest.name.trim(), customerEmail: guest.email.trim() }),
        items: items.map((i) => ({ menuItem: i._id, quantity: i.qty })),
        deliveryAddress: address.trim(),
        paymentMethod,
      });
      setPlacedOrder(order);
      clearCart();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not place your order. Please try again.'));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-ink-300">
          <FiShoppingBag size={26} />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink-600">Your cart is empty</h2>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-28">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg p-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
          >
            <FiCheck size={28} />
          </motion.div>
          <h2 className="mt-5 font-display text-2xl font-bold text-ink-600">Order Placed!</h2>
          <p className="mt-2 text-sm text-ink-400">
            Order <span className="font-mono font-semibold text-ink-600">#{placedOrder._id.slice(-8)}</span> has been received.
            We&rsquo;ll start preparing it right away.
          </p>
          <div className="mt-6 rounded-xl bg-ink-50 p-4 text-left text-sm">
            <div className="flex justify-between font-semibold text-ink-600">
              <span>Order Total</span>
              <span>{formatCurrency(placedOrder.totalAmount)}</span>
            </div>
            <div className="mt-1 flex justify-between text-ink-400">
              <span>Status</span>
              <span className="badge bg-amber-100 text-amber-700">{placedOrder.status}</span>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/menu" className="btn-outline flex-1 justify-center">Order More</Link>
            <Link to="/account" className="btn-primary flex-1 justify-center">Track Order</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <PageHero eyebrow="Checkout" title="Complete Your Order" />
      <section className="container-app grid grid-cols-1 gap-10 py-16 lg:grid-cols-5">
        <Reveal direction="right" className="space-y-6 lg:col-span-3">
          {!user && (
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-600">
                <FiUser className="text-primary-500" /> Your Details
              </h3>
              <p className="mt-1 text-xs text-ink-400">
                Ordering as a guest. <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="font-semibold text-primary-600 hover:underline">Log in</Link> to track orders in your account.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    className="input-field"
                    placeholder="Full name"
                    value={guest.name}
                    onChange={(e) => { setGuest((g) => ({ ...g, name: e.target.value })); setErrors((x) => ({ ...x, name: undefined })); }}
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Email address"
                    value={guest.email}
                    onChange={(e) => { setGuest((g) => ({ ...g, email: e.target.value })); setErrors((x) => ({ ...x, email: undefined })); }}
                  />
                  {errors.email && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.email}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-600">
              <FiMapPin className="text-primary-500" /> Delivery Address
            </h3>
            <textarea
              rows={3}
              value={address}
              maxLength={300}
              onChange={(e) => {
                setAddress(e.target.value);
                setErrors((x) => ({ ...x, address: undefined }));
              }}
              placeholder="Street address, apartment, city, ZIP"
              className="input-field mt-4 resize-none"
            />
            {errors.address && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.address}</p>}
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-600">
              <FiCreditCard className="text-primary-500" /> Payment Method
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'card', label: 'Credit / Debit Card' },
                { id: 'paypal', label: 'PayPal' },
                { id: 'cod', label: 'Cash on Delivery' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                    paymentMethod === m.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-ink-100 text-ink-500 hover:border-ink-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2"
                >
                  <input className="input-field sm:col-span-2" placeholder="Card Number (demo only — not charged)" autoComplete="off" />
                  <input className="input-field" placeholder="MM / YY" />
                  <input className="input-field" placeholder="CVC" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal direction="left" className="lg:col-span-2">
          <div className="card sticky top-28 p-6">
            <h3 className="font-display text-lg font-semibold text-ink-600">Order Summary</h3>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-ink-500">{item.qty} &times; {item.title}</span>
                  <span className="font-medium text-ink-600">{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-dashed border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Delivery</span><span>{formatCurrency(deliveryFee)}</span></div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-600"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            {errors.items && <p className="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-xs font-medium text-primary-700">{errors.items}</p>}
            <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary mt-6 w-full justify-center py-4">
              {placing ? <Spinner size={16} /> : `Place Order — ${formatCurrency(total)}`}
            </button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
