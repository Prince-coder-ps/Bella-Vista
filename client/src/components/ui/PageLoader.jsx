import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <motion.div
        className="h-12 w-12 rounded-full border-[3px] border-primary-100 border-t-primary-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <p className="text-sm font-medium tracking-wide text-ink-400">Loading Bella Vista…</p>
    </div>
  );
}
