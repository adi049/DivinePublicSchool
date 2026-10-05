import { GraduationCap, BookOpen, MapPin, CalendarCheck } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import DirectorCard from '../components/ui/DirectorCard.jsx'
import CTABand from '../components/ui/CTABand.jsx'
import { SCHOOL, SCHOOL_VALUES, ABOUT_INTRO } from '../data/school.js'

export default function About() {
  useSEO(
    'About Us | Divine Public School, Vatika Kunj Extension, Gurugram',
    'Learn about Divine Public School — a CBSE-curriculum school in Vatika Kunj Extension, Gurugram, its vision, mission, values and the Director’s message.',
  )

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
                  <BookOpen size={17} aria-hidden="true" />
                  <span>
                    <strong>Curriculum:</strong> CBSE pattern, from foundational years to board
                    classes
                  </span>
                </li>
                <li>
                  <GraduationCap size={17} aria-hidden="true" />
                  <span>
                    <strong>Classes:</strong> {SCHOOL.classesOffered} — with Science, Commerce and
                    Humanities streams in Classes 11–12
                  </span>
                </li>
                <li>
                  <MapPin size={17} aria-hidden="true" />
                  <span>
                    <strong>Location:</strong> {SCHOOL.address}
                  </span>
                </li>
                <li>
                  <CalendarCheck size={17} aria-hidden="true" />
                  <span>
                    <strong>Session {SCHOOL.session}:</strong> Admission enquiries welcome for all
                    classes
                  </span>
                </li>
              </ul>
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

      <CTABand />
    </>
  )
}
