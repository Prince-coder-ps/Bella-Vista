import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Reveal from '../ui/Reveal';

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-primary-500 py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10" />
      <div className="container-app relative flex flex-col items-center gap-6 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Ready for an Unforgettable Evening?</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-lg text-white/85">
            Reserve your table today and let us take care of the rest — from the first course to the last sip of espresso.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="flex flex-wrap justify-center gap-4">
          <Link to="/reservation" className="btn bg-white px-8 py-3.5 font-bold text-primary-600 hover:-translate-y-0.5 hover:shadow-lift">
            Book a Table
            <FiArrowRight />
          </Link>
          <Link to="/menu" className="btn-secondary">
            Order Online
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
