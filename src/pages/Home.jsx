import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import DirectorCard from '../components/ui/DirectorCard.jsx'
import CTABand from '../components/ui/CTABand.jsx'
import MapPlaceholder from '../components/ui/MapPlaceholder.jsx'
import { SCHOOL, WHY_CHOOSE } from '../data/school.js'
import { GALLERY_IMAGES } from '../data/gallery.js'
import { ASSETS } from '../data/assets.js'

const HERO_EASE = [0.22, 1, 0.36, 1]

const STAGE_ROWS = [
  { name: 'Pre-Primary', range: 'Nursery · LKG · UKG' },
  { name: 'Primary', range: 'Classes 1 – 5' },
  { name: 'Middle School', range: 'Classes 6 – 8' },
  { name: 'Secondary', range: 'Classes 9 – 10' },
  { name: 'Senior Secondary', range: 'Classes 11 – 12 · Science, Commerce, Humanities' },
]

export default function Home() {
  useSEO(
    'Divine Public School | CBSE School in Vatika Kunj Extension, Gurugram',
    'Divine Public School is a CBSE-curriculum school on Nayagaon Rd, Vatika Kunj Extension, Gurugram, offering classes from Nursery to Class XII. Admission enquiries welcome for 2026–27.',
  )

  const lifePreview = GALLERY_IMAGES.slice(0, 6)

  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src={ASSETS.heroCampus}
            alt="Campus of Divine Public School, Gurugram"
            fetchpriority="high"
            decoding="async"
          />
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="container">
          <div className="hero__inner">
            <motion.span
              className="hero__badge"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: HERO_EASE }}
            >
              <CalendarCheck size={15} aria-hidden="true" />
              Admissions {SCHOOL.session} · Enquiries Welcome
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: HERO_EASE }}
            >
              Divine Public School
            </motion.h1>
            <motion.p
              className="hero__headline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: HERO_EASE }}
            >
              A CBSE school in Vatika Kunj Extension, Gurugram, where strong academics and good
              values grow together.
            </motion.p>
            <motion.p
              className="hero__lead"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: HERO_EASE }}
            >
              From Nursery to Class XII, we give every child a safe, disciplined and encouraging
              environment in which to learn, ask questions and grow.
            </motion.p>
            <motion.div
              className="hero__cta"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: HERO_EASE }}
            >
              <Button to="/about" variant="light" size="lg" icon={ArrowRight}>
                Explore Our School
              </Button>
              <Button to="/admissions" variant="primary" size="lg" icon={CalendarCheck}>
                Admissions 2026–27
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- INFO STRIP */}
      <div className="strip">
        <div className="container">
          <Reveal delay={0.1}>
            <div className="strip__card">
              <div className="strip__item">
                <span className="strip__icon">
                  <GraduationCap size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="strip__label">Classes Offered</span>
                  <span className="strip__value">Nursery – Class XII</span>
                </span>
              </div>
              <div className="strip__item">
                <span className="strip__icon">
                  <BookOpen size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="strip__label">Curriculum</span>
                  <span className="strip__value">CBSE Pattern</span>
                </span>
              </div>
              <div className="strip__item">
                <span className="strip__icon">
                  <MapPin size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="strip__label">Campus</span>
                  <span className="strip__value">Vatika Kunj Ext., Gurugram</span>
                </span>
              </div>
              <div className="strip__item">
                <span className="strip__icon">
                  <Phone size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="strip__label">Phone</span>
                  <span className="strip__value">
                    <a href={SCHOOL.phones[0].href}>{SCHOOL.phones[0].display}</a>
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------------------------------------------- ABOUT THE SCHOOL */}
      <section className="section" aria-labelledby="home-about">
        <div className="container split">
          <Reveal className="split__media">
            <img
              src={ASSETS.aboutBuilding}
              alt="Front facade of Divine Public School"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
          <Reveal className="split__body" delay={0.1}>
            <span className="eyebrow">About Our School</span>
            <h2 id="home-about">A school families can trust</h2>
            <p>
              Divine Public School is a CBSE-curriculum school located on Nayagaon Road, Vatika
              Kunj Extension, Gurugram, Haryana. We run classes from Nursery to Class XII, with
              Science, Commerce and Humanities streams at the senior secondary level.
            </p>
            <p>
              Our classrooms are built around clear teaching, patient teachers and steady values —
              so children feel secure, parents stay informed, and learning becomes a habit rather
              than a burden.
            </p>
            <Button to="/about" variant="outline" icon={ArrowRight}>
              Read More About Us
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ WHY CHOOSE */}
      <section className="section section--tint" aria-labelledby="why-choose">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Why Divine Public School"
              title="Why parents choose us"
              sub="A few of the things we work on every single day — in every classroom, for every child."
            />
          </Reveal>
          <div className="why-grid">
            {WHY_CHOOSE.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <article className="why-card">
                  <span className="why-card__icon">
                    <item.icon size={21} aria-hidden="true" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- CURRICULUM PREVIEW */}
      <section className="section" aria-labelledby="curr-preview">
        <div className="container split">
          <Reveal className="split__body">
            <span className="eyebrow">Academics</span>
            <h2 id="curr-preview">From first steps to board classes</h2>
            <p>
              We follow the CBSE pattern across every stage — play-based learning in the
              pre-primary years, strong foundations in primary and middle school, and focused board
              preparation in Classes 9 to 12.
            </p>
            <p>
              At the senior secondary level, students choose from Science, Commerce and Humanities
              streams, with subject combinations guided by CBSE norms.
            </p>
            <Button to="/curriculum" variant="primary" icon={ArrowRight}>
              Explore the Curriculum
            </Button>
          </Reveal>
          <Reveal className="stage-list" delay={0.1} aria-label="School stages">
            {STAGE_ROWS.map((row) => (
              <Link to="/curriculum" className="stage-row" key={row.name}>
                <span>
                  <span className="stage-row__name">{row.name}</span>
                  <span className="stage-row__range">{row.range}</span>
                </span>
                <span className="stage-row__arrow">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- SCHOOL LIFE */}
      <section className="section section--tint" aria-labelledby="school-life">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="School Life"
              title="A glimpse of life on campus"
              sub="Classrooms, events, activities and celebrations — school life here is busy, balanced and joyful."
            />
          </Reveal>
          <div className="life-grid">
            {lifePreview.map((img, i) => (
              <Reveal key={img.src} delay={i * 0.05}>
                <Link to="/gallery" className="g-item" aria-label={`${img.alt} — open gallery`}>
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                  <span className="g-item__cap">
                    <span className="g-item__cat">{img.category}</span>
                    {img.caption}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="life-more">
            <Button to="/gallery" variant="outline" icon={ArrowRight}>
              View Full Gallery
            </Button>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------- DIRECTOR'S MESSAGE */}
      <section className="section" aria-labelledby="director-preview">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="director-preview"
              eyebrow="From the Director's Desk"
              title="A word from our Director"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <DirectorCard variant="preview" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ ADMISSIONS ENQUIRY */}
      <CTABand />

      {/* ------------------------------------------------ CONTACT PREVIEW */}
      <section className="section" aria-labelledby="contact-preview">
        <div className="container contact-grid">
          <Reveal className="contact-grid__info">
            <span className="eyebrow">Get in Touch</span>
            <h2 id="contact-preview">Visit us or give us a call</h2>
            <p>
              We are always happy to speak with parents — about admissions, academics or anything
              else concerning your child.
            </p>
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
              <li>
                <span className="info-list__icon">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="info-list__label">Phone</span>
                  <span className="info-list__value">
                    {SCHOOL.phones.map((p, i) => (
                      <span key={p.display}>
                        {i > 0 && ' · '}
                        <a href={p.href}>{p.display}</a>
                      </span>
                    ))}
                  </span>
                </span>
              </li>
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
            </ul>
            <div className="contact-grid__actions">
              <Button href={SCHOOL.phones[0].href} variant="primary" icon={Phone}>
                Call Now
              </Button>
              <Button to="/contact" variant="outline" icon={ArrowRight}>
                Contact Us
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <MapPlaceholder />
          </Reveal>
        </div>
      </section>
    </>
  )
}
