import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { isValidEmail, isNotEmpty } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/';

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email';
    if (!isNotEmpty(form.password)) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : redirectTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err, 'Login failed. Please try again.'));
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
          <h1 className="mt-4 font-display text-xl font-semibold text-ink-600">Welcome Back</h1>
          <p className="mt-1 text-sm text-ink-400">Log in to manage orders and reservations.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label className="label-field flex items-center gap-1.5"><FiMail size={13} className="text-primary-500" />Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label-field flex items-center gap-1.5"><FiLock size={13} className="text-primary-500" />Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field !pr-11"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.password}</p>}
          </div>

          {serverError && (
            <div className="rounded-lg bg-primary-50 px-4 py-2.5 text-xs font-medium text-primary-700">{serverError}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? <Spinner size={16} /> : (<><FiLogIn size={15} /> Log In</>)}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Don&rsquo;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
