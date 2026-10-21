import { FiAward, FiUsers, FiClock, FiMapPin } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import CTA from '../components/home/CTA';
import aboutImg from '../assets/images/about-img.avif';
import heroImg from '../assets/images/hero-img.avif';

const STATS = [
  { icon: FiClock, value: '25+', label: 'Years of Legacy' },
  { icon: FiUsers, value: '50K+', label: 'Happy Guests' },
  { icon: FiAward, value: '12', label: 'Culinary Awards' },
  { icon: FiMapPin, value: '3', label: 'City Locations' },
];

const TEAM = [
  { name: 'Marco Rossi', role: 'Executive Chef', img: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&q=80' },
  { name: 'Elena Bianchi', role: 'Head Pastry Chef', img: 'https://images.unsplash.com/photo-1595257841889-be47ee7bc9c9?w=400&q=80' },
  { name: 'Luca Ferrari', role: 'Restaurant Manager', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="About Bella Vista" subtitle="A family tradition of authentic Italian hospitality since 1998." />

      <section className="container-app py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right">
            <img src={aboutImg} alt="Restaurant interior" className="h-[420px] w-full rounded-3xl object-cover shadow-card" />
          </Reveal>
          <Reveal direction="left">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title mt-3">Where Every Plate Tells a Story</h2>
            <p className="mt-5 leading-relaxed text-ink-400">
              Bella Vista was founded in 1998 by the Moretti family with a single goal: to share the warmth,
              flavor, and tradition of Southern Italian cooking with our city. What began as a small
              trattoria has grown into a beloved neighborhood institution — but our kitchen still runs on
              the same handwritten recipes passed down from Nonna Moretti.
            </p>
            <p className="mt-4 leading-relaxed text-ink-400">
              We import our tomatoes from San Marzano, our olive oil from Puglia, and our cheese from small
              family dairies in Emilia-Romagna. Everything else — the pasta, the bread, the desserts — is
              made from scratch in our kitchen, every single day.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-20 grid grid-cols-2 gap-6 rounded-3xl bg-ink-600 p-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center text-white">
              <s.icon className="mb-2 text-primary-400" size={22} />
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
        <div className="container-app grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal direction="right" className="order-2 lg:order-1">
            <span className="section-eyebrow">Our Philosophy</span>
            <h2 className="section-title mt-3">Cooked With Care, Served With Pride</h2>
            <p className="mt-5 leading-relaxed text-ink-400">
              We believe great food starts with respect — for the ingredients, for the craft, and for the
              people we serve. Our wood-fired oven burns at the heart of the restaurant, just as it has
              since day one, turning out pizzas with the perfect char in under ninety seconds.
            </p>
          </Reveal>
          <Reveal direction="left" className="order-1 lg:order-2">
            <img src={heroImg} alt="Wood-fired oven" className="h-[380px] w-full rounded-3xl object-cover shadow-card" />
          </Reveal>
        </div>
      </section>

      <section className="container-app py-20 sm:py-28">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="section-eyebrow justify-center">Meet The Team</span>
          <h2 className="section-title mt-3">The Hands Behind Every Dish</h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.1} className="group text-center">
              <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-full">
                <img src={member.img} alt={member.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-600">{member.name}</h3>
              <p className="text-sm text-primary-500">{member.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
