import { Phone, MessageCircle, Navigation, MapPin, Clock, Mail } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import MapPlaceholder from '../components/ui/MapPlaceholder.jsx'
import EnquiryForm from '../components/forms/EnquiryForm.jsx'
import { SCHOOL } from '../data/school.js'

export default function Contact() {
  useSEO({ page: 'contact' })

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Questions about admissions, classes or anything else? Call us, message us on WhatsApp, or send an enquiry below."
        image="/images/gallery/playground-transport.jpg"
        crumb="Contact Us"
      />

      {/* -------------------------------------------------- QUICK ACTIONS */}
      <section className="section" aria-label="Quick contact options">
        <div className="container">
          <div className="c-cards">
            <Reveal>
              <article className="c-card">
                <span className="c-card__icon">
                  <Phone size={22} aria-hidden="true" />
                </span>
                <h2>Call the School Office</h2>
                <p>
                  {SCHOOL.phones.map((p) => (
                    <span key={p.display}>
                      <a href={p.href}>{p.display}</a>
                      <br />
                    </span>
                  ))}
                </p>
                <Button href={SCHOOL.phones[0].href} variant="primary" block icon={Phone}>
                  Call Now
                </Button>
              </article>
            </Reveal>
            <Reveal delay={0.07}>
              <article className="c-card c-card--green">
                <span className="c-card__icon">
                  <MessageCircle size={22} aria-hidden="true" />
                </span>
                <h2>Chat on WhatsApp</h2>
                <p>{SCHOOL.whatsapp.display}</p>
                <Button
                  href={SCHOOL.whatsapp.url}
                  target="_blank"
                  rel="noreferrer"
                  variant="green"
                  block
                  icon={MessageCircle}
                >
                  WhatsApp Us
                </Button>
              </article>
            </Reveal>
            <Reveal delay={0.14}>
              <article className="c-card">
                <span className="c-card__icon">
                  <Mail size={22} aria-hidden="true" />
                </span>
                <h2>Email Us</h2>
                <p>
                  <a href={SCHOOL.email.href}>{SCHOOL.email.display}</a>
                </p>
                <Button href={SCHOOL.email.href} variant="outline" block icon={Mail}>
                  Write an Email
                </Button>
              </article>
            </Reveal>
            <Reveal delay={0.21}>
              <article className="c-card">
                <span className="c-card__icon">
                  <MapPin size={22} aria-hidden="true" />
                </span>
                <h2>Visit the Campus</h2>
                <p>{SCHOOL.address}</p>
                <Button href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" variant="outline" block icon={Navigation}>
                  Get Directions
                </Button>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ ENQUIRY FORM + DETAILS */}
      <section className="section section--tint" aria-labelledby="enquiry-heading">
        <div className="container contact-page-grid">
          <Reveal>
            <div className="form-card">
              <h2 id="enquiry-heading">Send us an enquiry</h2>
              <p className="form-card__sub">
                Fill in the details below and the school office will get back to you.
              </p>
              <EnquiryForm variant="contact" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="side-stack">
            <div className="side-card">
              <h2>School office</h2>
              <ul className="info-list">
                <li>
                  <span className="info-list__icon">
                    <MapPin size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="info-list__label">Address</span>
                    <span className="info-list__value">{SCHOOL.address}</span>
                  </span>
                </li>
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
                    <Clock size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="info-list__label">Planning a visit</span>
                    <span className="info-list__value">{SCHOOL.visitingNote}</span>
                  </span>
                </li>
              </ul>
            </div>
            <MapPlaceholder />
          </Reveal>
        </div>
      </section>
    </>
  )
}
