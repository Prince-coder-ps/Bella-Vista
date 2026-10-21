import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/validators';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 rounded-xl border border-ink-50 p-3"
    >
      <img src={item.image} alt={item.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-ink-600">{item.title}</h4>
          <button onClick={() => removeItem(item._id)} className="shrink-0 text-ink-300 hover:text-primary-500" aria-label="Remove item">
            <FiTrash2 size={15} />
          </button>
        </div>
        <p className="mt-0.5 text-xs font-semibold text-primary-600">{formatCurrency(item.price)}</p>
        <div className="mt-2 inline-flex items-center gap-3 rounded-full bg-ink-50 px-2 py-1">
          <button
            onClick={() => updateQty(item._id, item.qty - 1)}
            className="flex h-5 w-5 items-center justify-center rounded-full text-ink-500 hover:text-primary-600"
            aria-label="Decrease quantity"
          >
            <FiMinus size={12} />
          </button>
          <span className="w-4 text-center text-xs font-bold text-ink-600">{item.qty}</span>
          <button
            onClick={() => updateQty(item._id, item.qty + 1)}
            className="flex h-5 w-5 items-center justify-center rounded-full text-ink-500 hover:text-primary-600"
            aria-label="Increase quantity"
          >
            <FiPlus size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
