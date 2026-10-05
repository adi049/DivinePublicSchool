import { CalendarCheck, Phone } from 'lucide-react'
import Button from './Button.jsx'
import Reveal from './Reveal.jsx'
import { SCHOOL } from '../../data/school.js'

/**
 * Reusable "Admissions Enquiry" call-to-action band.
 * Used on the home page and inner pages.
 */
export default function CTABand() {
  return (
    <section className="cta-band" aria-label="Admissions call to action">
      <div className="container cta-band__inner">
        <Reveal>
          <span className="eyebrow">Admissions {SCHOOL.session}</span>
          <h2>Admission Enquiries for 2026–27</h2>
          <p>
            Parents interested in admission for the {SCHOOL.session} session (Nursery to Class XII)
            are welcome to get in touch. Please contact the school for class availability and
            admission details.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="cta-band__actions">
          <Button to="/admissions" variant="primary" size="lg" icon={CalendarCheck}>
            Admission Enquiry
          </Button>
          <Button to="/contact" variant="outline" size="lg" icon={Phone}>
            Contact Us
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
