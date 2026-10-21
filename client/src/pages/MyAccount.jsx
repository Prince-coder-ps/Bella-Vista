import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/orderService';
import { fetchMyReservations } from '../services/reservationService';
import { formatCurrency, formatDate } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Preparing: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyAccount() {
  const { user } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    Promise.all([fetchMyOrders(), fetchMyReservations()])
      .then(([o, r]) => {
        setOrders(o);
        setReservations(r);
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load your account details.')))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <PageHero eyebrow="My Account" title={`Welcome, ${user?.name?.split(' ')[0] || 'Guest'}`} />

      <section className="container-app py-16">
        <Reveal className="card mb-8 flex flex-wrap items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 font-display text-xl font-bold text-white">
            {user?.name?.charAt(0) || <FiUser />}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink-600">{user?.name}</p>
            <p className="text-sm text-ink-400">{user?.email}</p>
          </div>
          <span className="badge ml-auto bg-primary-50 capitalize text-primary-600">{user?.role}</span>
        </Reveal>

        <div className="mb-8 flex gap-2">
          {[
            { id: 'orders', label: 'Order History', icon: FiPackage },
            { id: 'reservations', label: 'Reservations', icon: FiCalendar },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.id ? 'bg-primary-500 text-white' : 'bg-ink-50 text-ink-500 hover:text-primary-600'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {error && <div className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">{error}</div>}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : tab === 'orders' ? (
          <OrdersList orders={orders} />
        ) : (
          <ReservationsList reservations={reservations} />
        )}
      </section>
    </>
  );
}

function OrdersList({ orders }) {
  if (orders.length === 0) return <EmptyState icon={FiPackage} text="No orders yet — your food adventures start here." />;
  return (
    <div className="space-y-4">
      {orders.map((o, i) => (
        <motion.div
          key={o._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-mono text-xs text-ink-400">#{o._id.slice(-8)}</p>
            <p className="mt-1 text-sm font-medium text-ink-600">
              {o.items?.map((i) => `${i.quantity}\u00d7 ${i.title}`).join(', ')}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-400"><FiClock size={11} /> {new Date(o.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-display text-base font-bold text-ink-600">{formatCurrency(o.totalAmount)}</span>
            <span className={`badge ${STATUS_STYLES[o.status] || 'bg-ink-100 text-ink-600'}`}>{o.status}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ReservationsList({ reservations }) {
  if (reservations.length === 0) return <EmptyState icon={FiCalendar} text="No reservations yet — book a table to see it here." />;
  return (
    <div className="space-y-4">
      {reservations.map((r, i) => (
        <motion.div
          key={r._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-ink-600">{formatDate(r.date)} &middot; {r.time}</p>
            <p className="mt-1 text-xs text-ink-400">{r.guests} guest(s) {r.message && `\u00b7 "${r.message}"`}</p>
          </div>
          <span className={`badge ${STATUS_STYLES[r.status] || 'bg-ink-100 text-ink-600'}`}>{r.status}</span>
        </motion.div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-50 text-ink-300">
        <Icon size={24} />
      </div>
      <p className="text-sm text-ink-400">{text}</p>
    </div>
  );
}
