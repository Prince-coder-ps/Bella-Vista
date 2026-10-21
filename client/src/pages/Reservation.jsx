import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUsers, FiClock, FiCheck, FiAlertCircle, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import Spinner from '../components/ui/Spinner';
import { createReservation, checkAvailability } from '../services/reservationService';
import { TIME_SLOTS, RESTAURANT } from '../utils/constants';
import { isValidEmail, isValidPhone, isNotEmpty, isFutureDate, todayLocalISO } from '../utils/validators';
import { getErrorMessage } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

const GUEST_OPTIONS = ['1', '2', '3', '4', '5', '6+'];
const initialForm = { name: '', email: '', phone: '', date: '', time: '', guests: '', message: '' };

export default function Reservation() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...initialForm, name: user?.name || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === 'date' || key === 'time') setAvailability(null);
  };

  const handleCheckAvailability = async () => {
    if (!form.date || !form.time) return;
    setChecking(true);
    try {
      setAvailability(await checkAvailability(form.date, form.time));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not check availability right now.'));
    } finally {
      setChecking(false);
    }
  };

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) next.name = 'Full name is required';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address';
    if (!isValidPhone(form.phone)) next.phone = 'Enter a valid phone number';
    if (!isFutureDate(form.date)) next.date = 'Select a valid upcoming date';
    if (!form.time) next.time = 'Select a time slot';
    if (!form.guests) next.guests = 'Select number of guests';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const reservation = await createReservation(form);
      setSuccess(reservation);
      setForm({ ...initialForm, name: user?.name || '', email: user?.email || '' });
      setAvailability(null);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not submit your reservation. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Reservation" title="Book Your Table" subtitle="Reserve a table in seconds and we'll take care of the rest." />

      <section className="container-app grid grid-cols-1 gap-14 py-16 sm:py-24 lg:grid-cols-5">
        <Reveal direction="right" className="lg:col-span-2">
          <div className="card sticky top-28 space-y-6 p-7">
            <h3 className="font-display text-xl font-semibold text-ink-600">Visit Us</h3>
            <div className="space-y-4 text-sm text-ink-500">
              <p><strong className="block text-ink-600">Address</strong>{RESTAURANT.address}</p>
              <p><strong className="block text-ink-600">Phone</strong>{RESTAURANT.phone}</p>
              <p><strong className="block text-ink-600">Email</strong>{RESTAURANT.email}</p>
            </div>
            <div className="border-t border-ink-50 pt-5">
              <h4 className="mb-3 text-sm font-semibold text-ink-600">Opening Hours</h4>
              <ul className="space-y-2 text-sm text-ink-400">
                {RESTAURANT.hours.map((h) => (
                  <li key={h.days} className="flex justify-between">
                    <span>{h.days}</span>
                    <span className="text-ink-600">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-primary-50 p-4 text-xs leading-relaxed text-primary-700">
              Large parties (8+) or private events? Call us directly and our host team will arrange everything.
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="card flex flex-col items-center p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
                >
                  <FiCheck size={28} />
                </motion.div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink-600">Reservation Requested!</h3>
                <p className="mt-2 max-w-sm text-sm text-ink-400">
                  Thanks, {success.name}. We&rsquo;ve received your request for {success.guests} guest(s) on{' '}
                  {success.date} at {success.time}. Our team will review it and contact you to confirm. You can track its status in your account.
                </p>
                <button onClick={() => setSuccess(null)} className="btn-primary mt-6">
                  Book Another Table
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="card space-y-5 p-7 sm:p-8"
                noValidate
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full Name" icon={FiUser} error={errors.name}>
                    <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="John Doe" />
                  </Field>
                  <Field label="Email" icon={FiMail} error={errors.email}>
                    <input type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="john@example.com" />
                  </Field>
                </div>

                <Field label="Phone" icon={FiPhone} error={errors.phone}>
                  <input type="tel" className="input-field" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 123-4567" />
                </Field>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="Date" icon={FiCalendar} error={errors.date}>
                    <input
                      type="date"
                      className="input-field"
                      value={form.date}
                      min={todayLocalISO()}
                      onChange={(e) => update('date', e.target.value)}
                    />
                  </Field>
                  <Field label="Time" icon={FiClock} error={errors.time}>
                    <select className="input-field" value={form.time} onChange={(e) => update('time', e.target.value)}>
                      <option value="">Select</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Guests" icon={FiUsers} error={errors.guests}>
                    <select className="input-field" value={form.guests} onChange={(e) => update('guests', e.target.value)}>
                      <option value="">Select</option>
                      {GUEST_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g} Guest{g !== '1' ? 's' : ''}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {form.date && form.time && (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl bg-ink-50 px-4 py-3">
                    <button
                      type="button"
                      onClick={handleCheckAvailability}
                      disabled={checking}
                      className="text-xs font-semibold text-accent-600 hover:text-accent-500 disabled:opacity-60"
                    >
                      {checking ? 'Checking...' : 'Check table availability for this slot'}
                    </button>
                    {checking && <Spinner size={14} className="text-accent-500" />}
                    <AnimatePresence>
                      {availability && !checking && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center gap-1.5 text-xs font-semibold ${availability.available ? 'text-green-600' : 'text-primary-600'}`}
                        >
                          {availability.available ? <FiCheck size={13} /> : <FiAlertCircle size={13} />}
                          {availability.available
                            ? `Available — ${availability.remaining} tables left`
                            : 'Fully booked, please pick another slot'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <Field label="Special Requests (optional)">
                  <textarea
                    rows={3}
                    maxLength={500}
                    className="input-field resize-none"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Dietary requirements, allergies, celebration details..."
                  />
                </Field>

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4">
                  {submitting ? <Spinner size={16} /> : 'Submit Reservation'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </section>
    </>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="label-field flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-primary-500" />}
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-xs font-medium text-primary-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
