import { Home, Phone } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  useSEO({
    title: 'Page Not Found (404) | Divine Public School, Gurugram',
    description:
      'The page you are looking for could not be found on the Divine Public School website. Use the links below to return to the homepage or contact the school office.',
    noindex: true, // 404s must never be indexed
  })

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
