import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import { getErrorMessage } from '../../utils/errors';

export default function AdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role !== 'admin') {
        setError('This account does not have admin access.');
        await logout(); // don't leave a customer session open from the admin door
        return;
      }
      toast.success('Welcome to the admin dashboard');
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-700 px-4">
      <div className="pointer-events-none absolute inset-0 bg-grain" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-lift sm:p-10"
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-600 text-white">
            <FiShield size={22} />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-600">Admin Access</h1>
          <p className="mt-1 text-sm text-ink-400">Restricted area — authorized staff only</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label-field flex items-center gap-1.5"><FiMail size={13} className="text-primary-500" />Admin Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="admin@bellavista.com"
            />
          </div>
          <div>
            <label className="label-field flex items-center gap-1.5"><FiLock size={13} className="text-primary-500" />Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="rounded-lg bg-primary-50 px-4 py-2.5 text-xs font-medium text-primary-700">{error}</div>}

          <button type="submit" disabled={loading} className="w-full justify-center btn bg-ink-600 py-3.5 text-white hover:bg-ink-700">
            {loading ? <Spinner size={16} /> : 'Access Dashboard'}
          </button>
        </form>


        <p className="mt-6 text-center text-xs text-ink-300">
          <Link to="/" className="hover:text-ink-500">&larr; Back to website</Link>
        </p>
      </motion.div>
    </div>
  );
}
