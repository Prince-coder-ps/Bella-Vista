import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { RESTAURANT, NAV_LINKS } from '../../utils/constants';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-600 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="container-app relative grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl font-bold">{RESTAURANT.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-100/80">
            Authentic Italian cuisine in the heart of the city. Experience the taste of Italy with every bite.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { icon: FiFacebook, href: RESTAURANT.social.facebook },
              { icon: FiInstagram, href: RESTAURANT.social.instagram },
              { icon: FiTwitter, href: RESTAURANT.social.twitter },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-500"
                aria-label="social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-ink-100/80">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-primary-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Opening Hours</h4>
          <ul className="space-y-2.5 text-sm text-ink-100/80">
            {RESTAURANT.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-white/90">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base font-semibold">Contact</h4>
          <ul className="space-y-3 text-sm text-ink-100/80">
            <li className="flex items-start gap-2.5">
              <FiMapPin className="mt-0.5 shrink-0 text-primary-400" size={15} />
              {RESTAURANT.address}
            </li>
            <li className="flex items-center gap-2.5">
              <FiPhone className="shrink-0 text-primary-400" size={15} />
              {RESTAURANT.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <FiMail className="shrink-0 text-primary-400" size={15} />
              {RESTAURANT.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-ink-100/60">
          &copy; {new Date().getFullYear()} {RESTAURANT.name} Restaurant. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
