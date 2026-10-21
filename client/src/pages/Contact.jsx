import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';
import Spinner from '../components/ui/Spinner';
import { RESTAURANT } from '../utils/constants';
import { isValidEmail, isNotEmpty } from '../utils/validators';
import { sendContactMessage } from '../services/contactService';
import { getErrorMessage } from '../utils/errors';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isNotEmpty(form.name)) next.name = 'Required';
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email';
    if (!isNotEmpty(form.message)) next.message = 'Please write a message';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      await sendContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setForm(initialForm);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send your message. Please try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Get In Touch" title="Contact Us" subtitle="Questions, feedback, or private event inquiries — we'd love to hear from you." />

      <section className="container-app grid grid-cols-1 gap-14 py-16 sm:py-24 lg:grid-cols-5">
        <Reveal direction="right" className="space-y-6 lg:col-span-2">
          <InfoCard icon={FiMapPin} title="Visit Us" lines={[RESTAURANT.address]} />
          <InfoCard icon={FiPhone} title="Call Us" lines={[RESTAURANT.phone]} />
          <InfoCard icon={FiMail} title="Email Us" lines={[RESTAURANT.email]} />
          <motion.div whileHover={{ scale: 1.01 }} className="card overflow-hidden">
            <div className="flex h-48 items-center justify-center bg-ink-50 text-ink-300">
              <FiMapPin size={32} />
              <span className="ml-2 text-sm">Map preview</span>
            </div>
          </motion.div>
        </Reveal>

        <Reveal direction="left" className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="card space-y-5 p-7 sm:p-8" noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label-field">Full Name</label>
                <input className="input-field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
                {errors.name && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.name}</p>}
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                {errors.email && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label className="label-field">Subject</label>
              <input className="input-field" value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="How can we help?" />
            </div>
            <div>
              <label className="label-field">Message</label>
              <textarea rows={5} maxLength={2000} className="input-field resize-none" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Write your message..." />
              {errors.message && <p className="mt-1.5 text-xs font-medium text-primary-600">{errors.message}</p>}
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-4">
              {sending ? <Spinner size={16} /> : (<><FiSend size={15} /> Send Message</>)}
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, lines }) {
  return (
    <motion.div whileHover={{ x: 4 }} className="card flex items-start gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="font-display text-sm font-semibold text-ink-600">{title}</h4>
        {lines.map((l) => (
          <p key={l} className="mt-0.5 text-sm text-ink-400">{l}</p>
        ))}
      </div>
    </motion.div>
  );
}
