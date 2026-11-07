import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import AnnouncementBar from '../ui/AnnouncementBar.jsx'

/** Shell for all public pages: announcement + navbar + content + footer. */
export default function PublicLayout() {
  // Keyboard users land on the nav first; this lets them jump straight to the
  // page content. preventDefault is required: a bare href="#main-content"
  // would overwrite the HashRouter route and navigate to a 404.
  const skipToContent = (e) => {
    e.preventDefault()
    const el = document.getElementById('main-content')
    if (!el) return
    el.setAttribute('tabindex', '-1')
    el.focus()
    el.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <a className="skip-link" href="#main-content" onClick={skipToContent}>
        Skip to main content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
