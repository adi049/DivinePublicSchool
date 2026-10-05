import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ChevronRight, CalendarCheck, Phone, MessageCircle } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import { SCHOOL, NAV_LINKS } from '../../data/school.js'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Shadow after slight scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer whenever the route changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Divine Public School — home">
          <Logo />
          <span className="brand__text">
            <span className="brand__name">Divine Public School</span>
            <span className="brand__tag">Vatika Kunj Ext., Gurugram · CBSE</span>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <Button to="/admissions" variant="primary" icon={CalendarCheck}>
            <span className="navbar__cta-label">Admissions&nbsp;</span>2026–27
          </Button>
          <button
            className="navbar__burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-drawer"
            className="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container drawer__nav">
              <nav aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `drawer__link ${isActive ? 'is-active' : ''}`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </NavLink>
                ))}
              </nav>
              <Button to="/admissions" variant="primary" block icon={CalendarCheck} className="drawer__cta">
                Admissions 2026–27
              </Button>
              <div className="drawer__contact">
                <a href={SCHOOL.phones[0].href}>
                  <Phone size={14} aria-hidden="true" /> {SCHOOL.phones[0].display}
                </a>
                <a href={SCHOOL.whatsapp.url} target="_blank" rel="noreferrer">
                  <MessageCircle size={14} aria-hidden="true" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
