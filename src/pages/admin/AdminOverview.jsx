// ============================================================================
// ADMIN — OVERVIEW (all numbers computed from the actual stored records)
// ============================================================================

import { Link } from 'react-router-dom'
import {
  GraduationCap,
  CalendarDays,
  BookMarked,
  FileClock,
  Clock3,
  ArrowRight,
  Images,
  Megaphone,
  Settings,
  Inbox,
} from 'lucide-react'
import { StatCard, EmptyState } from '../../components/admin/AdminUI.jsx'
import { useTimetables, useDateSheets, useContentReady, useEvents } from '../../services/hooks.js'
import { countSubjects, classesConfigured } from '../../services/subjectService.js'
import { classFullLabel } from '../../services/catalogue.js'
import { eventStatus } from '../../services/eventService.js'
import { loadRecords } from '../../services/localStore.js'

function formatWhen(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const QUICK_LINKS = [
  { to: '/admin/timetables', label: 'Upload a class timetable', icon: CalendarDays },
  { to: '/admin/subjects', label: 'Edit subject lists', icon: BookMarked },
  { to: '/admin/date-sheets', label: 'Publish a date sheet', icon: FileClock },
  { to: '/admin/gallery', label: 'Add gallery photographs', icon: Images },
  { to: '/admin/events', label: 'Create an event popup', icon: Megaphone },
  { to: '/admin/enquiries', label: 'Review website enquiries', icon: Inbox },
  { to: '/admin/settings', label: 'Website settings', icon: Settings },
]

export default function AdminOverview() {
  useContentReady() // re-render when any service changes
  const timetables = useTimetables()
  const dateSheets = useDateSheets()
  const events = useEvents()

  // --- real counts ---------------------------------------------------------
  const totalClasses = classesConfigured()
  const totalTimetables = timetables.length
  const totalSubjects = countSubjects()
  const totalDateSheets = dateSheets.length
  const liveEvents = events.filter((e) => eventStatus(e) === 'live').length

  // --- recently updated (merged across services) ----------------------------
  const subjectUpdates = Object.values(
    loadRecords('subjects', []).reduce((acc, r) => {
      const key = `${r.class_id}:${r.stream || ''}`
      const existing = acc[key]
      if (!existing || (r.updated_at || '') > (existing.updated_at || '')) {
        acc[key] = {
          type: 'Subjects',
          label: classFullLabel(r.class_id, r.stream),
          updated_at: r.updated_at,
        }
      }
      return acc
    }, {}),
  )

  const recent = [
    ...timetables.map((t) => ({
      type: 'Timetable',
      label: t.title || classFullLabel(t.class_id, t.stream),
      updated_at: t.updated_at,
    })),
    ...dateSheets.map((d) => ({
      type: 'Date Sheet',
      label: `${d.exam_name || 'Examination'} — ${classFullLabel(d.class_id, d.stream)}`,
      updated_at: d.updated_at,
    })),
    ...subjectUpdates,
    ...events.map((e) => ({
      type: 'Event',
      label: e.title,
      updated_at: e.updated_at,
    })),
  ]
    .filter((r) => r.updated_at)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 6)

  return (
    <div className="stack">
      <div className="stat-grid">
        <StatCard icon={GraduationCap} label="Classes configured" value={totalClasses} accent="blue" />
        <StatCard icon={CalendarDays} label="Timetables stored" value={totalTimetables} accent="green" />
        <StatCard icon={BookMarked} label="Subjects on record" value={totalSubjects} accent="magenta" />
        <StatCard icon={FileClock} label="Date sheets stored" value={totalDateSheets} accent="silver" />
        <StatCard icon={Megaphone} label="Events live on site" value={liveEvents} accent="magenta" />
      </div>

      <section className="acard" aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="acard__title">
          <Clock3 size={17} aria-hidden="true" /> Recently updated content
        </h2>
        {recent.length === 0 ? (
          <EmptyState
            icon={Clock3}
            title="No content changes yet"
            text="Timetables, date sheets and subject edits will appear here once the school team starts publishing them."
          />
        ) : (
          <ul className="recent-list">
            {recent.map((r, i) => (
              <li key={`${r.type}-${r.label}-${i}`}>
                <span className={`tag ${r.type === 'Timetable' ? '' : r.type === 'Date Sheet' ? 'tag--magenta' : 'tag--green'}`}>
                  {r.type}
                </span>
                <span className="recent-list__label">{r.label}</span>
                <span className="recent-list__when">{formatWhen(r.updated_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="acard__title" style={{ marginBottom: '0.9rem' }}>
          Quick actions
        </h2>
        <div className="quick-grid">
          {QUICK_LINKS.map((q) => (
            <Link key={q.to} to={q.to} className="quick-link">
              <q.icon size={18} aria-hidden="true" />
              <span>{q.label}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <p className="admin-note">
        Content records are synchronized to Supabase Database. Uploaded media is stored in Supabase Storage, so published updates are shared across devices.
      </p>
    </div>
  )
}
