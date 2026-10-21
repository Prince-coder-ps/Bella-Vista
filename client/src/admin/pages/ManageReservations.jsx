import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusSelect from '../../components/admin/StatusSelect';
import Spinner from '../../components/ui/Spinner';
import { fetchReservations, updateReservationStatus, deleteReservation } from '../../services/reservationService';
import { RESERVATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errors';

const FILTERS = ['All', ...RESERVATION_STATUSES];

export default function ManageReservations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () =>
    fetchReservations()
      .then(setList)
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load reservations.')))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return list.filter((r) => {
      const matchesFilter = filter === 'All' || r.status === filter;
      const matchesSearch = r.name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [list, filter, search]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      toast.success(`Reservation marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the reservation.'));
    }
    load();
  };

  const handleDelete = async () => {
    try {
      await deleteReservation(deleteTarget._id);
      toast.success('Reservation removed');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete the reservation.'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-600">Reservations</h1>
        <p className="mt-1 text-sm text-ink-400">Review and manage incoming table bookings.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                filter === f ? 'bg-primary-500 text-white' : 'bg-ink-50 text-ink-500 hover:text-primary-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300" size={14} />
          <input className="input-field !py-2.5 !pl-9 text-sm" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-ink-50/60">
              <tr className="text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Date &amp; Time</th>
                <th className="px-5 py-3 font-medium">Guests</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center"><Spinner size={20} className="mx-auto text-primary-500" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-ink-400"><FiCalendar className="mx-auto mb-2" size={22} />No reservations found.</td></tr>
              ) : (
                filtered.map((r, i) => (
                  <motion.tr
                    key={r._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40"
                  >
                    <td className="px-5 py-3 font-medium text-ink-600">{r.name}</td>
                    <td className="px-5 py-3 text-ink-500">{formatDate(r.date)} &middot; {r.time}</td>
                    <td className="px-5 py-3 text-ink-500">{r.guests}</td>
                    <td className="px-5 py-3 text-xs text-ink-400">{r.email}<br />{r.phone}</td>
                    <td className="px-5 py-3">
                      <StatusSelect value={r.status} options={RESERVATION_STATUSES} onChange={(status) => handleStatusChange(r._id, status)} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-2 text-ink-400 hover:bg-primary-50 hover:text-primary-600" aria-label="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Reservation"
        message={`Remove the reservation for "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
}
