import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import {
  fetchMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} from '../../services/menuService';
import { CATEGORIES } from '../../data/menuCategories';
import { formatCurrency } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errors';

const emptyForm = { title: '', description: '', price: '', category: 'Appetizers', image: '', isChefSpecial: false };

export default function ManageMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () =>
    fetchMenu()
      .then(setItems)
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load the menu.')))
      .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, price: item.price, category: item.category, image: item.image, isChefSpecial: item.isChefSpecial });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Empty image => server keeps/applies its default image.
      const payload = { ...form, price: Number(form.price), image: form.image.trim() };
      if (editing) {
        await updateMenuItem(editing._id, payload);
        toast.success('Menu item updated');
      } else {
        await createMenuItem(payload);
        toast.success('Menu item added');
      }
      await load();
      setModalOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save the menu item.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenuItem(deleteTarget._id);
      toast.success('Menu item deleted');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete the menu item.'));
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAvailability(id);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update availability.'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-600">Menu Management</h1>
          <p className="mt-1 text-sm text-ink-400">Add, edit, and manage availability of menu items.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus size={15} /> Add Item
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink-50/60">
              <tr className="text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center"><Spinner size={20} className="mx-auto text-primary-500" /></td></tr>
              ) : (
                items.map((item, i) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-ink-50 last:border-0 hover:bg-ink-50/40"
                  >
                    <td className="flex items-center gap-3 px-5 py-3">
                      <img src={item.image} alt={item.title} className="h-11 w-11 rounded-lg object-cover" />
                      <div>
                        <p className="flex items-center gap-1.5 font-medium text-ink-600">
                          {item.title}
                          {item.isChefSpecial && <FiStar size={12} className="text-gold" fill="currentColor" />}
                        </p>
                        <p className="max-w-xs truncate text-xs text-ink-400">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{item.category}</td>
                    <td className="px-5 py-3 font-semibold text-ink-600">{formatCurrency(item.price)}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleToggle(item._id)} className="flex items-center gap-1.5 text-xs font-semibold">
                        {item.isAvailable ? (
                          <span className="flex items-center gap-1 text-green-600"><FiToggleRight size={22} /> Available</span>
                        ) : (
                          <span className="flex items-center gap-1 text-ink-400"><FiToggleLeft size={22} /> Unavailable</span>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="rounded-lg p-2 text-ink-400 hover:bg-accent-500/10 hover:text-accent-600" aria-label="Edit">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-ink-400 hover:bg-primary-50 hover:text-primary-600" aria-label="Delete">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Menu Item' : 'Add Menu Item'} maxWidth="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label-field">Title</label>
            <input required className="input-field" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label-field">Description</label>
            <textarea required rows={2} className="input-field resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Price ($)</label>
              <input required type="number" min="0" step="0.01" className="input-field" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <label className="label-field">Category</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Image URL (optional)</label>
            <input type="url" className="input-field" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-600">
            <input type="checkbox" checked={form.isChefSpecial} onChange={(e) => setForm((f) => ({ ...f, isChefSpecial: e.target.checked }))} className="h-4 w-4 rounded accent-primary-500" />
            Mark as Chef&rsquo;s Special
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Spinner size={16} /> : editing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
