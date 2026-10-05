import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FlaskConical, Briefcase, Landmark, Info, CheckCircle2, Sparkles } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import CTABand from '../components/ui/CTABand.jsx'
import ClassTile from '../components/curriculum/ClassTile.jsx'
import SubjectList from '../components/curriculum/SubjectList.jsx'
import Timetable from '../components/curriculum/Timetable.jsx'
import { CLASSES, STREAMS, TIMETABLES } from '../data/curriculum.js'

const STREAM_ICONS = { science: FlaskConical, commerce: Briefcase, humanities: Landmark }

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'timetable', label: 'Timetable' },
]

export default function Curriculum() {
  useSEO(
    'Curriculum | Divine Public School — Classes Nursery to XII, CBSE Pattern',
    'Class-wise CBSE curriculum of Divine Public School, Gurugram — subjects and timetables for Nursery to Class XII, including Science, Commerce and Humanities streams.',
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('class') || 'nursery'
  const selected = CLASSES.find((c) => c.id === selectedId) || CLASSES[0]

  const [tab, setTab] = useState('overview')
  const [stream, setStream] = useState('science')
  const panelRef = useRef(null)

  const selectClass = (id) => {
    if (id === selectedId) return
    setSearchParams(id === 'nursery' ? {} : { class: id })
    setTab('overview')
    setStream('science')
    // Keep the panel in view on small screens after changing class
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  // Resolve what the panel displays (handles stream-based classes)
  const isStreamClass = Boolean(selected.hasStreams)
  const activeStream = STREAMS[stream]
  const subjects = isStreamClass ? activeStream.subjects : selected.subjects
  const timetableKey = isStreamClass ? activeStream.timetable : selected.timetable
  const timetable = TIMETABLES[timetableKey]

  return (
    <>
      <PageHero
        title="Academic Curriculum"
        description="Class-wise subjects, timetables and academic information from Nursery to Class XII, following the CBSE pattern."
        image="/images/gallery/classroom.jpg"
        crumb="Curriculum"
      />

      <section className="section" aria-labelledby="class-wise">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Classes We Offer"
              title="Class-wise curriculum"
              sub="Select a class to view its subjects, sample timetable and stage details. Classes 11 and 12 can be explored stream-wise."
            />
          </Reveal>

          <Reveal delay={0.05}>
            <p className="sample-note">
              <Info size={16} aria-hidden="true" />
              The subjects and timetables shown below are placeholder data for the website. The
              school’s confirmed curriculum and timetables will replace them.
            </p>
          </Reveal>

          {/* ------------------------------------------------ CLASS PICKER */}
          <Reveal delay={0.08}>
            <div
              className="class-grid"
              role="group"
              aria-label="Select a class"
              style={{ marginTop: '1.75rem' }}
            >
              {CLASSES.map((cls) => (
                <ClassTile
                  key={cls.id}
                  cls={cls}
                  active={cls.id === selected.id}
                  onSelect={selectClass}
                />
              ))}
            </div>
          </Reveal>

          {/* ------------------------------------------------ DETAIL PANEL */}
          <div className="panel" ref={panelRef}>
            <div className="panel__head">
              <div className="panel__title">
                <h2>{selected.label}</h2>
              </div>
              <div className="panel__meta">
                <span className="tag">{selected.stage}</span>
                <span className="tag tag--green">Age {selected.age}</span>
                {isStreamClass && <span className="tag tag--green">3 Streams</span>}
              </div>
            </div>

            {/* Stream picker for Classes 11 & 12 */}
            {isStreamClass && (
              <>
                <p className="panel__blurb">
                  <strong>Choose a stream</strong> to see its subject combination and sample
                  timetable. Students are guided before confirming a stream.
                </p>
                <div className="stream-row" role="group" aria-label="Select stream">
                  {Object.values(STREAMS).map((s) => {
                    const Icon = STREAM_ICONS[s.id]
                    const active = s.id === stream
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`stream-btn ${active ? 'is-active' : ''}`}
                        onClick={() => setStream(s.id)}
                        aria-pressed={active}
                      >
                        <span className="stream-btn__icon">
                          <Icon size={19} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="stream-btn__label">{s.label}</span>
                          <span className="stream-btn__sub">{s.blurb}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Tabs */}
            <div className="tabs" role="tablist" aria-label="Curriculum details">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tab ${tab === t.id ? 'is-active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="tab__body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.id}-${isStreamClass ? stream : 'std'}-${tab}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tab === 'overview' && (
                    <div role="tabpanel" aria-label="Overview">
                      <p style={{ maxWidth: 720 }}>{selected.summary}</p>
                      {isStreamClass && (
                        <p style={{ maxWidth: 720, marginTop: '0.85rem' }}>
                          <strong>{activeStream.label} stream:</strong> {activeStream.blurb}
                        </p>
                      )}
                      <ul className="hl-list">
                        {selected.highlights.map((h) => (
                          <li key={h}>
                            <CheckCircle2 size={17} aria-hidden="true" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tab === 'subjects' && (
                    <div role="tabpanel" aria-label="Subjects">
                      {isStreamClass && (
                        <p className="panel__blurb" style={{ padding: 0, marginBottom: '1.1rem' }}>
                          <Sparkles size={15} aria-hidden="true" style={{ verticalAlign: '-2px' }} />{' '}
                          Subjects for <strong>{activeStream.label}</strong> ({selected.label}):
                        </p>
                      )}
                      <SubjectList subjects={subjects} />
                    </div>
                  )}

                  {tab === 'timetable' && (
                    <div role="tabpanel" aria-label="Timetable">
                      <Timetable timetable={timetable} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  )
}
