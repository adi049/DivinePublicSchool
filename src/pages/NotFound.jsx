import { Home, Phone } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  useSEO(
    'Page Not Found | Divine Public School, Gurugram',
    'The page you are looking for could not be found on the Divine Public School website.',
  )

  return (
    <section className="nf">
      <div className="container">
        <div className="nf__code" aria-hidden="true">
          404
        </div>
        <h1>This page could not be found</h1>
        <p>
          The page may have been moved, or the link you followed may be incorrect. Let us help you
          get back on track.
        </p>
        <div className="nf__actions">
          <Button to="/" variant="primary" icon={Home}>
            Back to Home
          </Button>
          <Button to="/contact" variant="outline" icon={Phone}>
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  )
}
