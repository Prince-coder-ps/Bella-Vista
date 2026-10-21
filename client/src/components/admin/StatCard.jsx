import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-500/10 text-accent-600',
    green: 'bg-green-100 text-green-600',
    gold: 'bg-amber-100 text-amber-600',
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-ink-600">{value}</p>
        {trend && <p className="mt-0.5 text-xs font-medium text-green-600">{trend}</p>}
      </div>
    </motion.div>
  );
}
