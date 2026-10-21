import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { NAV_LINKS, RESTAURANT } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { count, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-app flex items-center justify-between py-4">
        <Link to="/" className="flex flex-col leading-tight">
          <span className={`font-display text-2xl font-bold transition-colors ${scrolled ? 'text-ink-600' : 'text-white'}`}>
            {RESTAURANT.name}
          </span>
          <span className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${scrolled ? 'text-primary-500' : 'text-white/80'}`}>
            {RESTAURANT.tagline}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  scrolled ? 'text-ink-500 hover:text-primary-600' : 'text-white/90 hover:text-white'
                } ${isActive ? (scrolled ? '!text-primary-600' : '!text-white') : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute -bottom-0.5 left-4 right-4 h-[2px] rounded-full ${scrolled ? 'bg-primary-500' : 'bg-white'}`}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className={`relative rounded-full p-2.5 transition-colors ${
              scrolled ? 'text-ink-600 hover:bg-ink-50' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Open cart"
          >
            <FiShoppingBag size={20} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="relative hidden md:block">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                scrolled ? 'text-ink-600 hover:bg-ink-50' : 'text-white hover:bg-white/10'
              }`}
            >
              <FiUser size={18} />
              {isAuthenticated ? user.name.split(' ')[0] : 'Account'}
            </button>
            <AnimatePresence>
              {accountOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-ink-50 bg-white py-2 shadow-lift"
                  >
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/account"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50"
                        >
                          My Account
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="block px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50"
                        >
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
                          Login
                        </Link>
                        <Link to="/register" onClick={() => setAccountOpen(false)} className="block px-4 py-2.5 text-sm text-ink-600 hover:bg-ink-50">
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Link to="/reservation" className={`hidden lg:inline-flex ${scrolled ? 'btn-primary !py-2.5 !px-5 !text-xs' : 'btn-secondary !py-2.5 !px-5 !text-xs'}`}>
            Reserve a Table
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`rounded-full p-2.5 md:hidden ${scrolled ? 'text-ink-600' : 'text-white'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white shadow-lift md:hidden"
          >
            <div className="container-app flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-600' : 'text-ink-600 hover:bg-ink-50'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 border-t border-ink-50" />
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="rounded-lg px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50">
                    My Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="rounded-lg px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-primary-600 hover:bg-primary-50">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-lg px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50">
                    Create Account
                  </Link>
                </>
              )}
              <Link to="/reservation" className="btn-primary mt-2 justify-center">
                Reserve a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
