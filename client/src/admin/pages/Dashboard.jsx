import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiShoppingBag, FiDollarSign, FiBook, FiClock } from 'react-icons/fi';
import StatCard from '../../components/admin/StatCard';
import MiniBarChart from '../../components/admin/MiniBarChart';
import { fetchDashboardStats } from '../../services/adminService';
import { formatCurrency } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errors';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Preparing: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, 'Could not load dashboard stats.')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-600">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-ink-400">A snapshot of how Bella Vista is doing today.</p>
      </div>

      {error && <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">{error}</div>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiCalendar} label="Total Reservations" value={loading ? '—' : stats?.totalReservations ?? 0} tone="accent" />
        <StatCard icon={FiShoppingBag} label="Active Orders" value={loading ? '—' : stats?.activeOrders ?? 0} tone="gold" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={loading ? '—' : formatCurrency(stats?.totalRevenue ?? 0)} tone="green" />
        <StatCard icon={FiBook} label="Menu Items" value={loading ? '—' : stats?.menuCount ?? 0} tone="primary" />
      </div>

      {!loading && stats && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <h3 className="font-display text-base font-semibold text-ink-600">Revenue This Week</h3>
              <div className="mt-6">
                <MiniBarChart data={stats.revenueByDay} />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-base font-semibold text-ink-600">Recent Reservations</h3>
              <div className="mt-4 space-y-3">
                {stats.recentReservations.map((r) => (
                  <div key={r._id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-ink-600">{r.name}</p>
                      <p className="flex items-center gap-1 text-xs text-ink-400"><FiClock size={10} /> {r.date} · {r.time}</p>
                    </div>
                    <span className={`badge ${STATUS_STYLES[r.status]}`}>{r.status}</span>
                  </div>
                ))}
                {stats.recentReservations.length === 0 && <p className="text-sm text-ink-400">No reservations yet.</p>}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-ink-600">Recent Orders</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-50 text-xs uppercase tracking-wide text-ink-400">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o, i) => (
                    <motion.tr
                      key={o._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-ink-50 last:border-0"
                    >
                      <td className="py-3 font-mono text-xs text-ink-500">#{o._id.slice(-8)}</td>
                      <td className="py-3 text-ink-600">{o.customerName}</td>
                      <td className="py-3 font-semibold text-ink-600">{formatCurrency(o.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`badge ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {stats.recentOrders.length === 0 && <p className="py-6 text-center text-sm text-ink-400">No orders yet.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
