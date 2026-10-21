import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { isValidEmail, isNotEmpty, isStrongPassword } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) next.name = 'Full name is required';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email';
    if (!isStrongPassword(form.password)) next.password = 'At least 8 characters';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to Bella Vista, ${user.name.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Could not create your account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md p-8 sm:p-10"
      >
        <div className="text-center">
          <Link to="/" className="font-display text-2xl font-bold text-ink-600">Bella Vista</Link>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-600">Create Your Account</h1>
          <p className="mt-1 text-sm text-ink-400">Order online and track reservations with ease.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label className="label-field flex items-center gap-1.5"><FiUser size={13} className="text-primary-500" />Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            {errors.name && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.name}</p>}
          </div>
          <div>
            <label className="label-field flex items-center gap-1.5"><FiMail size={13} className="text-primary-500" />Email</label>
            <input type="email" className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field flex items-center gap-1.5"><FiLock size={13} className="text-primary-500" />Password</label>
              <input type="password" className="input-field" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              {errors.password && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.password}</p>}
            </div>
            <div>
              <label className="label-field">Confirm</label>
              <input type="password" className="input-field" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} placeholder="••••••••" />
              {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg bg-primary-50 px-4 py-2.5 text-xs font-medium text-primary-700">{serverError}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? <Spinner size={16} /> : (<><FiUserPlus size={15} /> Create Account</>)}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
