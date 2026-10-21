import { NavLink } from 'react-router-dom';
import { FiGrid, FiBook, FiCalendar, FiShoppingBag, FiExternalLink } from 'react-icons/fi';
import { RESTAURANT } from '../../utils/constants';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: FiGrid, end: true },
  { to: '/admin/menu', label: 'Menu Management', icon: FiBook },
  { to: '/admin/reservations', label: 'Reservations', icon: FiCalendar },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
];

export default function AdminSidebar({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-ink-700 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="font-display text-xl font-bold">{RESTAURANT.name}</p>
        <p className="text-xs uppercase tracking-widest text-primary-400">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <link.icon size={17} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <FiExternalLink size={16} /> View Website
        </a>
      </div>
    </div>
  );
}
