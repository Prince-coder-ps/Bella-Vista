import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import aboutImg from '../../assets/images/about-img.avif';
import Reveal from '../ui/Reveal';

const POINTS = ['Imported Italian ingredients', 'Wood-fired brick oven', 'Handmade pasta daily'];

export default function AboutPreview() {
  return (
    <section id="about-preview" className="bg-white py-20 sm:py-28">
      <div className="container-app grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal direction="right" className="relative">
          <div className="relative overflow-hidden rounded-3xl">
            <img src={aboutImg} alt="Restaurant interior" className="h-[420px] w-full object-cover sm:h-[480px]" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-primary-500 px-7 py-5 text-white shadow-lift sm:block">
            <p className="font-display text-3xl font-bold">25+</p>
            <p className="text-xs uppercase tracking-wide text-white/85">Years of Legacy</p>
          </div>
        </Reveal>

        <Reveal direction="left">
          <span className="section-eyebrow">Our Story</span>
          <h2 className="section-title mt-3">A Taste of Italy, Rooted in Tradition</h2>
          <p className="mt-5 text-ink-400 leading-relaxed">
            Bella Vista opened its doors in 1998 with a simple mission: bring the honest, rustic flavors of
            Italian family cooking to the city. Every recipe on our menu has been passed down through three
            generations, prepared daily with imported ingredients and unwavering care.
          </p>
          <p className="mt-4 text-ink-400 leading-relaxed">
            From our wood-fired oven to our handmade pasta, every dish tells a story of tradition, passion,
            and the pursuit of authentic flavor.
          </p>

          <ul className="mt-6 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-medium text-ink-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                  <FiCheck size={13} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <Link to="/about" className="btn-outline group mt-8">
            Discover Our Story
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
