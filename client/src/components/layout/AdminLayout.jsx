import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import AdminSidebar from '../admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import ScrollRestoration from './ScrollRestoration';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-ink-50/50">
      <ScrollRestoration />
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-900/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white/90 px-5 py-4 backdrop-blur-sm sm:px-8">
          <button onClick={() => setMobileOpen(true)} className="text-ink-600 lg:hidden" aria-label="Open menu">
            <FiMenu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink-600">{user?.name}</p>
              <p className="text-xs text-ink-400">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
              <FiUser size={16} />
            </div>
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
              aria-label="Logout"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
