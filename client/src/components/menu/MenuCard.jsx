import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/validators';

export default function MenuCard({ item }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addItem(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {item.isChefSpecial && (
          <span className="badge absolute left-3 top-3 bg-gold/90 text-white">
            <FiStar size={11} /> Chef&rsquo;s Pick
          </span>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60">
            <span className="badge bg-white text-ink-600">Currently Unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-snug text-ink-600">{item.title}</h3>
          <span className="shrink-0 font-display text-base font-bold text-primary-600">{formatCurrency(item.price)}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">{item.description}</p>

        <button
          onClick={handleAdd}
          disabled={!item.isAvailable}
          className={`btn mt-5 w-full justify-center py-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
            justAdded
              ? 'bg-green-500 text-white'
              : 'bg-ink-50 text-ink-600 hover:bg-primary-500 hover:text-white disabled:bg-ink-50 disabled:text-ink-300'
          }`}
        >
          {justAdded ? (
            <>
              <FiCheck size={14} /> Added
            </>
          ) : (
            <>
              <FiPlus size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
