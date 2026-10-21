import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/validators';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, subtotal, tax, deliveryFee, total } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink-900/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-white shadow-lift"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-ink-50 px-6 py-5">
              <h3 className="font-display text-xl font-semibold text-ink-600">Your Order</h3>
              <button onClick={closeCart} className="rounded-full p-2 text-ink-400 hover:bg-ink-50" aria-label="Close cart">
                <FiX size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-ink-300">
                  <FiShoppingBag size={26} />
                </div>
                <p className="text-ink-500">Your cart is empty.</p>
                <Link to="/menu" onClick={closeCart} className="btn-primary mt-2">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 border-t border-ink-50 px-6 py-5">
                  <div className="flex justify-between text-sm text-ink-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-500">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-ink-500">
                    <span>Delivery fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-ink-100 pt-2 text-base font-bold text-ink-600">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <Link to="/checkout" onClick={closeCart} className="btn-primary mt-3 w-full justify-center">
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
