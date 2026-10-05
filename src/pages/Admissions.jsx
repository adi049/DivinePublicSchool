import { Phone, MessageCircle, MapPin, FileText, Handshake, Mail } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import EnquiryForm from '../components/forms/EnquiryForm.jsx'
import { SCHOOL } from '../data/school.js'

const STEPS = [
  {
    icon: FileText,
    title: 'Send an enquiry',
    text: 'Fill in the form on this page, call us or message us on WhatsApp. The school office will note your details.',
  },
  {
    icon: Phone,
    title: 'Speak with the school office',
    text: 'The office will get in touch to share class availability, explain the admission process and answer your questions.',
  },
  {
    icon: Handshake,
    title: 'Complete admission at the school',
    text: 'Once the school confirms the details with you, the admission formalities are completed at the school office.',
  },
]

export default function Admissions() {
  useSEO(
    'Admissions 2026–27 | Divine Public School, Vatika Kunj Extension, Gurugram',
    'Admission enquiries for the 2026–27 session at Divine Public School, Gurugram — Nursery to Class XII with Science, Commerce and Humanities streams. Contact the school for availability and details.',
  )

  return (
    <>
      <PageHero
        title="Admissions 2026–27"
        description={`Admission enquiries for the ${SCHOOL.session} session are welcome, from Nursery to Class XII. Please contact the school for class availability and admission details.`}
        image="/images/hero-campus.jpg"
        crumb="Admissions"
      />

      {/* ------------------------------------------------- CLASSES OFFERED */}
      <section className="section" aria-labelledby="classes-open">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Now Enrolling"
              title="Classes offered at the school"
              sub="Admission enquiries for 2026–27 are welcome for all classes from Nursery to Class XII. Please contact the school for class availability and admission details."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="class-cloud" aria-label="Classes offered">
              {['Nursery', 'LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)].map(
                (label) => (
                  <span className="tag" key={label}>
                    {label}
                  </span>
                ),
              )}
              <span className="tag tag--green">Class 11 – Science / Commerce / Humanities</span>
              <span className="tag tag--green">Class 12 – Science / Commerce / Humanities</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- PROCESS */}
      <section className="section section--tint" aria-labelledby="how-to-apply">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="The Process"
              title="How to enquire"
              sub="A simple, transparent enquiry process — the school office will guide you at each step."
            />
          </Reveal>
          <div className="steps">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <article className="step">
                  <span className="step__num">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- ENQUIRY FORM */}
      <section className="section" aria-labelledby="adm-form">
        <div className="container adm-grid">
          <Reveal>
            <div className="form-card">
              <h3 id="adm-form">Admission enquiry form</h3>
              <p className="form-card__sub">
                Share your details and our admissions office will call you back with the next steps.
              </p>
              <EnquiryForm variant="admissions" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="side-stack">
            <div className="side-card">
              <h3>Speak to the admissions office</h3>
              <ul className="info-list">
                {SCHOOL.phones.map((p) => (
                  <li key={p.display}>
                    <span className="info-list__icon">
                      <Phone size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="info-list__label">{p.label}</span>
                      <span className="info-list__value">
                        <a href={p.href}>{p.display}</a>
                      </span>
                    </span>
                  </li>
                ))}
                <li>
                  <span className="info-list__icon">
                    <MessageCircle size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="info-list__label">WhatsApp</span>
                    <span className="info-list__value">
                      <a href={SCHOOL.whatsapp.url} target="_blank" rel="noreferrer">
                        {SCHOOL.whatsapp.display}
                      </a>
                    </span>
                  </span>
                </li>
                <li>
                  <span className="info-list__icon">
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="info-list__label">Email</span>
                    <span className="info-list__value">
                      <a href={SCHOOL.email.href}>{SCHOOL.email.display}</a>
                    </span>
                  </span>
                </li>
                <li>
                  <span className="info-list__icon">
                    <MapPin size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="info-list__label">Campus</span>
                    <span className="info-list__value">{SCHOOL.address}</span>
                  </span>
                </li>
              </ul>
            </div>
            <div className="side-card" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
              <h3>A note for parents</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-soft)' }}>
                We recommend speaking with the school office before making a decision. If you would
                like to visit the campus, please call ahead so the office can plan your visit.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
