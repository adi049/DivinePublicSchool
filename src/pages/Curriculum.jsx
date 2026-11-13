import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FlaskConical,
  Briefcase,
  Landmark,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  FileClock,
} from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import CTABand from '../components/ui/CTABand.jsx'
import ClassTile from '../components/curriculum/ClassTile.jsx'
import SubjectList from '../components/curriculum/SubjectList.jsx'
import DocumentViewer from '../components/ui/DocumentViewer.jsx'
import { CLASSES, STREAMS } from '../data/curriculum.js'
import { needsStream } from '../services/catalogue.js'
import { listClassSections } from '../services/classSectionService.js'
import {
  useSubjects,
  usePublishedTimetable,
  usePublishedDateSheet,
  useFileUrl,
} from '../services/hooks.js'

const STREAM_ICONS = { science: FlaskConical, commerce: Briefcase, arts: Landmark }

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'datesheet', label: 'Date Sheet' },
]

/* ------------------------------------------------------------------ */
/*  Timetable tab — photograph published by the school office          */
/* ------------------------------------------------------------------ */
function TimetablePanel({ classId, stream, sectionId }) {
  const record = usePublishedTimetable(classId, stream, sectionId)
  const url = useFileUrl(record?.image_file_id)

  if (!record) {
    return (
      <div className="csoon">
        <CalendarDays size={20} aria-hidden="true" />
        <p>
          The class timetable will be published here soon. For the current schedule, please contact
          the school office.
        </p>
      </div>
    )
  }
  if (!url) return <p className="csoon">Loading timetable…</p>

  return (
    <div>
      <p className="doc-meta">
        <strong>{record.title}</strong>
        {record.academic_session && <span className="tag">Session {record.academic_session}</span>}
        {record.effective_date && <span className="tag tag--silver">Effective {record.effective_date}</span>}
      </p>
      <DocumentViewer
        url={url}
        type="image"
        title={record.title}
        downloadName={`timetable-${record.class_id}${record.stream ? `-${record.stream}` : ''}`}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Date-sheet tab — image or PDF published by the school office       */
/* ------------------------------------------------------------------ */
function DateSheetPanel({ classId, stream, sectionId }) {
  const record = usePublishedDateSheet(classId, stream, sectionId)
  const url = useFileUrl(record?.document_file_id)

  if (!record) {
    return (
      <div className="csoon">
        <FileClock size={20} aria-hidden="true" />
        <p>Date sheet for this class will be available soon.</p>
      </div>
    )
  }
  if (!url) return <p className="csoon">Loading date sheet…</p>

  const name = `${record.exam_name || 'Date Sheet'} — ${record.academic_session || ''}`.trim()
  return (
    <div>
      <p className="doc-meta">
        <strong>{record.exam_name || 'Examination Date Sheet'}</strong>
        {record.academic_session && <span className="tag">Session {record.academic_session}</span>}
        {record.publication_date && (
          <span className="tag tag--magenta">Published {record.publication_date}</span>
        )}
      </p>
      <DocumentViewer
        url={url}
        type={record.document_type === 'pdf' ? 'pdf' : 'image'}
        title={name}
        downloadName={`date-sheet-${record.class_id}${record.stream ? `-${record.stream}` : ''}`}
      />
    </div>
  )
}

export default function Curriculum() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('class') || 'nursery'
  const selected = CLASSES.find((c) => c.id === selectedId) || CLASSES[0]

  // Deep-link support for the crawlable /timetable/ and /date-sheets/ entry
  // pages: /#/curriculum?tab=timetable — defaults to the overview tab.
  const requestedTab = searchParams.get('tab')
  const [tab, setTab] = useState(() =>
    TABS.some((t) => t.id === requestedTab) ? requestedTab : 'overview',
  )

  // Unique title/description/canonical per view — the timetable and date-sheet
  // tabs are indexed through their own static entry pages.
  useSEO({
    page: tab === 'timetable' ? 'timetable' : tab === 'datesheet' ? 'date-sheets' : 'curriculum',
  })
  const [stream, setStream] = useState('science')
  const [sections, setSections] = useState([])
  const [sectionId, setSectionId] = useState(null)
  const [sectionsLoading, setSectionsLoading] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    let alive = true
    setSectionsLoading(true)
    setSections([])
    setSectionId(null)
    listClassSections(selected.id, { includeInactive: false })
      .then((rows) => { if (alive) setSections(rows || []) })
      .catch(() => { if (alive) setSections([]) })
      .finally(() => { if (alive) setSectionsLoading(false) })
    return () => { alive = false }
  }, [selected.id])

  const selectClass = (id) => {
    if (id === selectedId) return
    setSearchParams(id === 'nursery' ? {} : { class: id })
    setTab('overview')
    setStream('science')
    setSectionId(null)
    // Keep the panel in view on small screens after changing class
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  // Resolve what the panel displays (handles stream-based classes)
  const isStreamClass = Boolean(selected.hasStreams)
  const activeStream = STREAMS[stream]
  const streamId = needsStream(selected.id) ? stream : null
  const subjectRecords = useSubjects(selected.id, streamId)
  const subjects = subjectRecords.map((r) => r.subject_name)

  return (
    <>
      <PageHero
        title="Academic Curriculum"
        description="Class-wise subjects, timetables and examination date sheets from Nursery to Class XII, following the CBSE pattern."
        image="/images/gallery/building-front.jpg"
        crumb="Curriculum"
      />

      <section className="section" aria-labelledby="class-wise">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Classes We Offer"
              title="Class-wise curriculum"
              sub="Select a class to view its subjects, timetable and examination date sheet. Classes 11 and 12 can be explored stream-wise. Timetables and date sheets are published by the school office."
            />
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
                {isStreamClass && <span className="tag tag--magenta">3 Streams</span>}
              </div>
            </div>

            {/* Stream picker for Classes 11 & 12 */}
            {isStreamClass && (
              <>
                <p className="panel__blurb">
                  <strong>Choose a stream</strong> to see its subject combination, timetable and
                  examination date sheet. Students are guided before confirming a stream.
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

            {sections.length > 0 && (
              <div className="section-choice" style={{ margin: '1.2rem 0' }}>
                <p className="panel__blurb"><strong>Choose your section</strong> to view the correct class timetable and date sheet.</p>
                <div className="stream-row" role="group" aria-label="Select class section">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={`stream-btn ${sectionId === section.id ? 'is-active' : ''}`}
                      onClick={() => setSectionId(section.id)}
                      aria-pressed={sectionId === section.id}
                    >
                      <span className="stream-btn__label">Section {section.section_name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {sectionsLoading && <p className="csoon">Loading class sections…</p>}

            {/* Tabs */}
            <div className="tabs" role="tablist" aria-label="Curriculum details">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  className={`tab ${tab === t.id ? 'is-active' : ''} ${t.id === 'datesheet' ? 'tab--accent' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="tab__body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selected.id}-${isStreamClass ? stream : 'std'}-${sectionId || 'unselected'}-${tab}`}
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
                      {subjects.length > 0 ? (
                        <SubjectList subjects={subjects} />
                      ) : (
                        <div className="csoon">
                          <p>Subjects for this class will be published soon.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'timetable' && (
                    <div role="tabpanel" aria-label="Timetable">
                      {sections.length > 0 && !sectionId ? <p className="csoon">Please select your section above to view its timetable.</p> : <TimetablePanel classId={selected.id} stream={streamId} sectionId={sectionId} />}
                    </div>
                  )}

                  {tab === 'datesheet' && (
                    <div role="tabpanel" aria-label="Date sheet">
                      {sections.length > 0 && !sectionId ? <p className="csoon">Please select your section above to view its date sheet.</p> : <DateSheetPanel classId={selected.id} stream={streamId} sectionId={sectionId} />}
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
