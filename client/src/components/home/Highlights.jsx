import { FiClock, FiAward, FiTruck, FiHeart } from 'react-icons/fi';
import Reveal from '../ui/Reveal';

const HIGHLIGHTS = [
  { icon: FiAward, title: 'Award-Winning', text: 'Best Italian restaurant, 5 years running' },
  { icon: FiClock, title: 'Fresh Daily', text: 'Pasta made in-house every morning' },
  { icon: FiTruck, title: 'Fast Delivery', text: 'Hot food at your door in 30 minutes' },
  { icon: FiHeart, title: 'Family Recipes', text: 'Three generations of authentic flavor' },
];

export default function Highlights() {
  return (
    <section className="border-b border-ink-50 bg-white">
      <div className="container-app grid grid-cols-2 gap-6 py-14 sm:grid-cols-4 sm:gap-4">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.08} className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <h.icon size={20} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-ink-600">{h.title}</h3>
              <p className="mt-0.5 text-xs text-ink-400 sm:text-sm">{h.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
