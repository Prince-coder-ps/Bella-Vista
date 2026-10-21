import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import MenuCard from './MenuCard';
import SkeletonCard from '../ui/SkeletonCard';

export default function MenuGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 text-ink-300">
          <FiSearch size={26} />
        </div>
        <p className="font-display text-lg font-semibold text-ink-600">No dishes found</p>
        <p className="text-sm text-ink-400">Try a different search term or category.</p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
          >
            <MenuCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
