// ============================================================================
// ADMIN LAYOUT — sidebar + top header + content outlet (responsive)
// ============================================================================
// Rendered for authenticated admin routes only (see App.jsx). The public
// Navbar/Footer are intentionally absent here.
// ============================================================================

import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  Layers3,
  BookMarked,
  FileClock,
  Images,
  Megaphone,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { ToastProvider } from './Toast.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import useSEO from '../../hooks/useSEO.js'

const NAV = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/timetables', label: 'Manage Timetables', icon: CalendarDays },
  { to: '/admin/sections', label: 'Manage Sections', icon: Layers3 },
  { to: '/admin/subjects', label: 'Manage Subjects', icon: BookMarked },
  { to: '/admin/date-sheets', label: 'Date Sheets', icon: FileClock },
  { to: '/admin/gallery', label: 'Gallery Management', icon: Images },
  { to: '/admin/events', label: 'Manage Events & Announcements', icon: Megaphone },
  { to: '/admin/enquiries', label: 'Website Enquiries', icon: Inbox },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
]

function SidebarLinks({ onNavigate }) {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <nav className="aside__nav" aria-label="Admin">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `aside__link ${isActive ? 'is-active' : ''}`}
          >
            <item.icon size={17} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="aside__foot">
        <NavLink to="/" className="aside__link aside__link--site" onClick={onNavigate}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Back to Website</span>
        </NavLink>
        <button type="button" className="aside__link aside__link--logout" onClick={handleLogout}>
          <LogOut size={17} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </>
  )
}

export default function AdminLayout() {
  useSEO({
    title: 'Admin Dashboard | Divine Public School',
    description: 'School administration dashboard.',
    noindex: true,
  })
  const [drawer, setDrawer] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setDrawer(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const current = NAV.find((n) =>
    location.pathname === n.to || (!n.end && location.pathname.startsWith(n.to)),
  )

  return (
    <ToastProvider>
      <div className="admin">
        {/* Sidebar — fixed on desktop */}
        <aside className="aside">
          <div className="aside__brand">
            <Logo size={38} />
            <span className="aside__brand-text">
              <strong>Divine Public School</strong>
              <span>Admin Dashboard</span>
            </span>
          </div>
          <SidebarLinks />
        </aside>

        {/* Mobile top bar + drawer */}
        <header className="admin-top">
          <button
            type="button"
            className="admin-top__burger"
            onClick={() => setDrawer(true)}
            aria-label="Open admin menu"
            aria-expanded={drawer}
          >
            <Menu size={20} />
          </button>
          <span className="admin-top__brand">
            <Logo size={26} /> <strong>{current?.label || 'Admin'}</strong>
          </span>
        </header>

        <AnimatePresence>
          {drawer && (
            <motion.div
              className="aside-drawer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="aside-drawer__backdrop" onClick={() => setDrawer(false)} />
              <motion.aside
                className="aside-drawer__panel"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                aria-label="Admin navigation"
              >
                <div className="aside__brand">
                  <Logo size={34} />
                  <span className="aside__brand-text">
                    <strong>Divine Public School</strong>
                    <span>Admin Dashboard</span>
                  </span>
                  <button
                    type="button"
                    className="aside-drawer__close"
                    onClick={() => setDrawer(false)}
                    aria-label="Close admin menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <SidebarLinks onNavigate={() => setDrawer(false)} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main column */}
        <div className="admin-main">
          <header className="admin-head">
            <h1>{current?.label || 'Overview'}</h1>
            <span className="admin-head__chip">
              Supabase connected · Shared school data
            </span>
          </header>
          <main className="admin-body">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
