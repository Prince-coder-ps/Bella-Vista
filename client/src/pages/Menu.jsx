import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageHero from '../components/ui/PageHero';
import MenuFilterTabs from '../components/menu/MenuFilterTabs';
import SearchBar from '../components/menu/SearchBar';
import MenuGrid from '../components/menu/MenuGrid';
import { fetchMenu } from '../services/menuService';
import { CATEGORIES } from '../data/menuCategories';
import useDebounce from '../hooks/useDebounce';
import { getErrorMessage } from '../utils/errors';

export default function Menu() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    fetchMenu()
      .then(setAllItems)
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load the menu.')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allItems, category, debouncedSearch]);

  return (
    <>
      <PageHero
        eyebrow="Our Menu"
        title="Crafted With Passion"
        subtitle="Every dish is made fresh to order using traditional recipes and quality ingredients."
      />

      <section className="container-app py-14 sm:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <MenuFilterTabs categories={CATEGORIES} active={category} onChange={setCategory} />
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="mt-10">
          <MenuGrid items={filtered} loading={loading} />
        </div>
      </section>
    </>
  );
}
