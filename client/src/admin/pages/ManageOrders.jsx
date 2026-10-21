import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiShoppingBag, FiEye, FiX } from 'react-icons/fi';
import StatusSelect from '../../components/admin/StatusSelect';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { fetchOrders, updateOrderStatus } from '../../services/orderService';
import { ORDER_STATUSES } from '../../utils/constants';
import { formatCurrency } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errors';

const FILTERS = ['All', ...ORDER_STATUSES];

export default function ManageOrders() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  const load = () =>
    fetchOrders()
      .then(setList)
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load orders.')))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return list.filter((o) => {
      const matchesFilter = filter === 'All' || o.status === filter;
      const matchesSearch =
        o.customerName?.toLowerCase().includes(search.toLowerCase()) || o._id.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [list, filter, search]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the order.'));
    }
    load(); // always re-sync so the dropdown reflects the real status
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-600">Orders</h1>
        <p className="mt-1 text-sm text-ink-400">Track and update live customer orders.</p>
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
          <input className="input-field !py-2.5 !pl-9 text-sm" placeholder="Search by name or order ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink-50/60">
              <tr className="text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center"><Spinner size={20} className="mx-auto text-primary-500" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-ink-400"><FiShoppingBag className="mx-auto mb-2" size={22} />No orders found.</td></tr>
              ) : (
                filtered.map((o, i) => (
                  <motion.tr
                    key={o._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-ink-500">#{o._id.slice(-8)}</td>
                    <td className="px-5 py-3 font-medium text-ink-600">{o.customerName}</td>
                    <td className="px-5 py-3 text-xs text-ink-400">{o.items?.length} item(s)</td>
                    <td className="px-5 py-3 font-semibold text-ink-600">{formatCurrency(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <StatusSelect value={o.status} options={ORDER_STATUSES} onChange={(status) => handleStatusChange(o._id, status)} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => setViewOrder(o)} className="rounded-lg p-2 text-ink-400 hover:bg-accent-500/10 hover:text-accent-600" aria-label="View order">
                        <FiEye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order #${viewOrder?._id.slice(-8)}`}>
        {viewOrder && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-ink-400">Customer</p><p className="font-medium text-ink-600">{viewOrder.customerName}</p></div>
              <div><p className="text-xs text-ink-400">Email</p><p className="font-medium text-ink-600">{viewOrder.customerEmail}</p></div>
              <div className="col-span-2"><p className="text-xs text-ink-400">Delivery Address</p><p className="font-medium text-ink-600">{viewOrder.deliveryAddress}</p></div>
            </div>
            <div className="border-t border-ink-50 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase text-ink-400">Items</p>
              <div className="space-y-2">
                {viewOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-ink-600">{it.quantity} &times; {it.title}</span>
                    <span className="font-medium text-ink-600">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between border-t border-ink-50 pt-4 text-base font-bold text-ink-600">
              <span>Total</span>
              <span>{formatCurrency(viewOrder.totalAmount)}</span>
            </div>
            <button onClick={() => setViewOrder(null)} className="btn-outline w-full justify-center">
              <FiX size={14} /> Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
