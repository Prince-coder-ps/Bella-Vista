import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-ink-600 pb-16 pt-36 text-center text-white sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-grain" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="container-app relative"
      >
        {eyebrow && <span className="section-eyebrow justify-center text-primary-400">{eyebrow}</span>}
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-xl text-white/70">{subtitle}</p>}
      </motion.div>
    </section>
  );
}
