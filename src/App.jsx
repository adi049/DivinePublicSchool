import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'
import Curriculum from './pages/Curriculum.jsx'
import Contact from './pages/Contact.jsx'
import Admissions from './pages/Admissions.jsx'
import MandatoryDisclosure from './pages/MandatoryDisclosure.jsx'
import { PrivacyPolicy, TermsConditions } from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminAccess from './pages/AdminAccess.jsx'
import AdminPasswordReset from './pages/AdminPasswordReset.jsx'
import AdminOverview from './pages/admin/AdminOverview.jsx'
import AdminTimetables from './pages/admin/AdminTimetables.jsx'
import AdminSections from './pages/admin/AdminSections.jsx'
import AdminSubjects from './pages/admin/AdminSubjects.jsx'
import AdminDateSheets from './pages/admin/AdminDateSheets.jsx'
import AdminGallery from './pages/admin/AdminGallery.jsx'
import AdminEvents from './pages/admin/AdminEvents.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx'
import { useAdminAuth } from './context/AdminAuthContext.jsx'

/** Scrolls to top on route change — or to an anchor when a hash is present. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/** Admin routes render only after the Supabase admin session is verified. */
function RequireAuth() {
  const { authenticated, loading } = useAdminAuth()
  if (loading) return <div className="access"><div className="access__card">Checking secure admin session…</div></div>
  if (!authenticated) return <Navigate to="/admin" replace />
  return <AdminLayout />
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ------------------------------------------------ public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/mandatory-disclosure" element={<MandatoryDisclosure />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ------------------------------------------------- admin section */}
        <Route path="/admin" element={<AdminAccess />} />
        <Route path="/admin/reset-password" element={<AdminPasswordReset />} />
        <Route element={<RequireAuth />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/timetables" element={<AdminTimetables />} />
          <Route path="/admin/sections" element={<AdminSections />} />
          <Route path="/admin/subjects" element={<AdminSubjects />} />
          <Route path="/admin/date-sheets" element={<AdminDateSheets />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/enquiries" element={<AdminEnquiries />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}
