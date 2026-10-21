import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { fetchMenu } from '../../services/menuService';
import Reveal from '../ui/Reveal';
import SkeletonCard from '../ui/SkeletonCard';
import MenuCard from '../menu/MenuCard';

export default function FeaturedMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu()
      .then((all) => setItems(all.filter((i) => i.isChefSpecial && i.isAvailable).slice(0, 3)))
      .catch(() => setItems([])) // homepage degrades quietly if the API is down
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="featured" className="bg-cream py-20 sm:py-28">
      <div className="container-app">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow justify-center">Chef&rsquo;s Special</span>
          <h2 className="section-title mt-3">Dishes Everyone&rsquo;s Talking About</h2>
          <p className="section-subtitle mx-auto mt-4">
            A curated selection of our most-loved plates, crafted fresh with imported Italian ingredients.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : items.map((item, i) => (
                <Reveal key={item._id} delay={i * 0.1}>
                  <MenuCard item={item} />
                </Reveal>
              ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <Link to="/menu" className="btn-outline group">
            Explore Full Menu
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
