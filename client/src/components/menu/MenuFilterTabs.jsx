import { motion } from 'framer-motion';

export default function MenuFilterTabs({ categories, active, onChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              isActive ? 'text-white' : 'text-ink-500 hover:text-primary-600'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="menu-tab-bg"
                className="absolute inset-0 rounded-full bg-primary-500"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        );
      })}
    </div>
  );
}
