import { Ruler, School, FlaskConical, Users, Wifi, ArrowRight } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import DirectorCard from '../components/ui/DirectorCard.jsx'
import CTABand from '../components/ui/CTABand.jsx'
import Button from '../components/ui/Button.jsx'
import { SCHOOL_VALUES, ABOUT_INTRO, FACILITIES } from '../data/school.js'
import { assetUrl } from '../utils/assetUrl.js'

export default function About() {
  useSEO({ page: 'about' })

  return (
    <>
      <PageHero
        title="About Divine Public School"
        description="A CBSE-curriculum school in Vatika Kunj Extension, Gurugram — built on clear teaching, steady values and genuine care for every child."
        image="/images/about-building.jpg"
        crumb="About Us"
      />

      {/* -------------------------------------------------- INTRODUCTION */}
      <section className="section" aria-labelledby="about-intro">
        <div className="container about-grid">
          <Reveal>
            <span className="eyebrow">Who We Are</span>
            <h2 id="about-intro">Welcome to Divine Public School</h2>
            {ABOUT_INTRO.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
          <Reveal delay={0.12}>
            <aside className="fact-card" aria-label="School at a glance">
              <h3>The school at a glance</h3>
              <ul>
                <li>
                  <Ruler size={17} aria-hidden="true" />
                  <span>
                    <strong>Campus area:</strong> 4056 sq. mtr.
                  </span>
                </li>
                <li>
                  <School size={17} aria-hidden="true" />
                  <span>
                    <strong>Classrooms:</strong> 18 well-ventilated classrooms
                  </span>
                </li>
                <li>
                  <FlaskConical size={17} aria-hidden="true" />
                  <span>
                    <strong>Laboratories:</strong> 4 labs, including a computer lab
                  </span>
                </li>
                <li>
                  <Users size={17} aria-hidden="true" />
                  <span>
                    <strong>Teaching staff:</strong> 21 teachers (PGT, TGT &amp; PRT)
                  </span>
                </li>
                <li>
                  <Wifi size={17} aria-hidden="true" />
                  <span>
                    <strong>Connectivity:</strong> Internet facility available on campus
                  </span>
                </li>
              </ul>
              <p className="fact-card__source">
                Figures as published in the school’s Public Mandatory Disclosure.
              </p>
              <Button to="/mandatory-disclosure" variant="outline" icon={ArrowRight} block>
                View Mandatory Disclosure
              </Button>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ DIRECTOR PROFILE */}
      <section className="section section--tint" id="director" aria-labelledby="director-heading">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="director-heading"
              eyebrow="Leadership"
              title="From the Director’s Desk"
              sub="A message for parents, students and well-wishers of the school."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <DirectorCard variant="full" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------- VISION / MISSION / VALUES */}
      <section className="section" aria-labelledby="values-heading">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="What Guides Us"
              title="Our vision, mission and values"
              sub="The principles that shape how we teach, how we discipline and how we treat every child."
            />
          </Reveal>
          <div className="value-grid">
            {SCHOOL_VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.06}>
                <article className="value-card">
                  <span className="value-card__icon">
                    <value.icon size={20} aria-hidden="true" />
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------- INFRASTRUCTURE & FACILITIES */}
      <section className="section section--tint" aria-labelledby="facilities-heading">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Campus"
              title="Infrastructure &amp; facilities"
              sub="Facilities for smooth teaching–learning, student development and administration — as listed by the school."
            />
          </Reveal>

          {/* Real campus photographs */}
          <div className="infra-photos">
            {[
              {
                src: 'images/campus-entrance.jpg',
                alt: 'Covered main entrance of Divine Public School with the school signboard',
                cap: 'Covered main entrance',
              },
              {
                src: 'images/gallery/building-front.jpg',
                alt: 'Main academic block of Divine Public School',
                cap: 'Academic building',
              },
              {
                src: 'images/gallery/playground-transport.jpg',
                alt: 'School buses and play area at Divine Public School',
                cap: 'Play area & transport',
              },
            ].map((p, i) => (
              <Reveal key={p.src} delay={0.05 + i * 0.06}>
                <figure className="infra-photo">
                  <img src={assetUrl(p.src)} alt={p.alt} loading="lazy" decoding="async" />
                  <figcaption>{p.cap}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <div className="why-grid">
            {FACILITIES.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.05, 0.3)}>
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

      <CTABand />
    </>
  )
}
