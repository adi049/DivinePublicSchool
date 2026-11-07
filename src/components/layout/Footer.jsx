import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Phone, MessageCircle, Mail, CalendarCheck } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { SCHOOL } from '../../data/school.js'

/**
 * Staff access trigger — a very small school logo in the bottom bar.
 * Three consecutive clicks (within 1.2s each) open the Admin Access screen.
 * Deliberately discreet; harmless when clicked normally.
 */
function AdminShortcut() {
  const navigate = useNavigate()
  const [count, setCount] = useState(0)
  const timer = useRef(null)

  const handleClick = () => {
    const next = count + 1
    setCount(next)
    window.clearTimeout(timer.current)
    if (next >= 3) {
      setCount(0)
      navigate('/admin')
      return
    }
    timer.current = window.setTimeout(() => setCount(0), 1200)
  }

  return (
    <button
      type="button"
      className="footer__adminkey"
      onClick={handleClick}
      aria-label="School administration"
      title="School administration"
    >
      <Logo size={22} />
    </button>
  )
}

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Curriculum', to: '/curriculum' },
  { label: 'Contact Us', to: '/contact' },
]

const EXPLORE_LINKS = [
  { label: 'Admissions 2026–27', to: '/admissions' },
  { label: 'Public Mandatory Disclosure', to: '/mandatory-disclosure' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brandrow">
              <Logo size={44} />
              <span className="brand__text">
                <span className="brand__name">Divine Public School</span>
                <span className="brand__tag">CBSE Curriculum</span>
              </span>
            </div>
            <p className="footer__about">
              A CBSE-curriculum school at {SCHOOL.address}, offering classes from Nursery to
              Class XII in a safe, disciplined and caring environment.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer__title">Quick Links</h3>
            <ul className="footer__links">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="footer__title">Explore</h3>
            <ul className="footer__links">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer__link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__contact">
              <li>
                <MapPin size={16} aria-hidden="true" />
                <span>{SCHOOL.address}</span>
              </li>
              {SCHOOL.phones.map((phone) => (
                <li key={phone.display}>
                  <Phone size={16} aria-hidden="true" />
                  <a href={phone.href}>
                    {phone.label}: {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <MessageCircle size={16} aria-hidden="true" />
                <a href={SCHOOL.whatsapp.url} target="_blank" rel="noreferrer">
                  WhatsApp — {SCHOOL.whatsapp.display}
                </a>
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                <a href={SCHOOL.email.href}>{SCHOOL.email.display}</a>
              </li>
            </ul>
            <Link to="/admissions" className="footer__badge">
              <CalendarCheck size={14} aria-hidden="true" />
              Admissions 2026–27 · Enquiries Welcome
            </Link>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="footer__copy">
            <AdminShortcut />
            <span>
              © {year} Divine Public School, {SCHOOL.addressShort}. All rights reserved.
            </span>
          </span>
          <nav className="footer__legal" aria-label="Legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
