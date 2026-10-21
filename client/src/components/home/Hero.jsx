import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import heroImg from '../../assets/images/hero-img.avif';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-700 text-white"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={heroImg} alt="Bella Vista restaurant interior" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/50 to-ink-900/85" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="container-app relative z-10 flex flex-col items-center pt-20 text-center"
      >
        <motion.span variants={item} className="section-eyebrow border border-white/25 rounded-full px-4 py-1.5 text-white/90">
          Est. 1998 &middot; Wood-Fired &middot; Family Owned
        </motion.span>

        <motion.h1 variants={item} className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl">
          Welcome to <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">Bella Vista</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
          Experience the authentic taste of Italy in the heart of the city — handmade pasta, wood-fired pizza,
          and recipes passed down for three generations.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/menu" className="btn-primary group">
            View Menu
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/reservation" className="btn-secondary">
            Make a Reservation
          </Link>
        </motion.div>

        <motion.button
          variants={item}
          className="mt-14 flex items-center gap-3 rounded-full border border-white/20 bg-white/5 py-2 pl-2 pr-5 text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
            <FiPlay size={13} className="ml-0.5" />
          </span>
          A glimpse inside our kitchen
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1.5"
        >
          <span className="h-1.5 w-1 rounded-full bg-white/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
