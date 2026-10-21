import { FiStar } from 'react-icons/fi';
import Reveal from '../ui/Reveal';

const REVIEWS = [
  {
    name: 'Sarah Mitchell',
    role: 'Food Blogger',
    text: 'The carbonara was the best I\u2019ve had outside of Rome. Cozy atmosphere and impeccable service — a true neighborhood gem.',
    rating: 5,
  },
  {
    name: 'James Carter',
    role: 'Local Guide',
    text: 'Booked a table for an anniversary dinner and the staff made it unforgettable. The osso buco practically melts in your mouth.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Regular Guest',
    text: 'Bella Vista is our go-to for family celebrations. Consistent quality, warm hospitality, and the tiramisu is out of this world.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-ink-600 py-20 sm:py-28">
      <div className="container-app">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow justify-center">Testimonials</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">What Our Guests Say</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.12} className="rounded-2xl bg-white/5 p-7 backdrop-blur-sm">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <FiStar key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 font-display text-sm font-bold text-white">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-white/50">{r.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
