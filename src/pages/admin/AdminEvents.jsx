// ============================================================================
// ADMIN — MANAGE EVENTS & ANNOUNCEMENTS
// ============================================================================
// Create event posters (Diwali, Annual Day, Sports Day, Admission Open,
// holiday notices…) that appear as a popup on the public homepage.
//
// Everything here writes through src/services/eventService.js, whose record
// shape matches the planned Supabase `events` table, so connecting Supabase
// later is a service-layer swap — this screen does not change.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  X,
  Save,
  MonitorPlay,
  CheckCircle2,
  CircleSlash,
} from 'lucide-react'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { EmptyState } from '../../components/admin/AdminUI.jsx'
import { useToast } from '../../components/admin/Toast.jsx'
import { useEvents } from '../../services/hooks.js'
import {
  createEvent,
  updateEvent,
  deleteEvent,
  setPublished,
  setActive,
  moveEvent,
  eventImageUrl,
  eventStatus,
  validateEvent,
  validateEventImage,
  clearDismissed,
  EVENT_IMAGE_ACCEPT,
  EVENT_IMAGE_MAX_MB,
} from '../../services/eventService.js'

const BLANK = {
  title: '',
  description: '',
  button_text: '',
  button_url: '',
  start_date: '',
  expiry_date: '',
  published: true,
  active: true,
}

const STATUS_LABEL = {
  live: 'Live on website',
  draft: 'Draft',
  inactive: 'Inactive',
  expired: 'Expired',
  scheduled: 'Scheduled',
}

function fmt(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Thumbnail that resolves the stored blob to an object URL. */
function EventThumb({ event, className = 'evt-thumb' }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    let alive = true
    eventImageUrl(event).then((u) => alive && setUrl(u))
    return () => {
      alive = false
    }
  }, [event])
  return (
    <span className={className}>
      {url ? (
        <img src={url} alt="" loading="lazy" />
      ) : (
        <ImageIcon size={16} aria-hidden="true" />
      )}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Create / edit form
// ---------------------------------------------------------------------------
function EventForm({ editing, onDone, onCancel }) {
  const toast = useToast()
  const fileRef = useRef(null)
  const [form, setForm] = useState(BLANK)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileError, setFileError] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // Load the record being edited (and its existing poster).
  useEffect(() => {
    if (!editing) {
      setForm(BLANK)
      setFile(null)
      setPreviewUrl(null)
      return
    }
    setForm({
      title: editing.title || '',
      description: editing.description || '',
      button_text: editing.button_text || '',
      button_url: editing.button_url || '',
      start_date: editing.start_date || '',
      expiry_date: editing.expiry_date || '',
      published: Boolean(editing.published),
      active: Boolean(editing.active),
    })
    setFile(null)
    let alive = true
    eventImageUrl(editing).then((u) => alive && setPreviewUrl(u))
    return () => {
      alive = false
    }
  }, [editing])

  // Preview for a newly chosen file.
  useEffect(() => {
    if (!file) return undefined
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const chooseFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    const problem = validateEventImage(f)
    if (problem) {
      setFileError(problem)
      return
    }
    setFileError('')
    setFile(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    const found = validateEvent(form)
    // A poster is required for a new event (the popup is poster-led).
    if (!editing && !file) found.image = 'Please upload an event photograph or poster.'
    setErrors(found)
    if (Object.keys(found).length) return

    setSaving(true)
    try {
      if (editing) {
        await updateEvent(editing.id, form, file)
        toast.success('Event updated.')
      } else {
        await createEvent({ ...form, file })
        toast.success(
          form.published && form.active
            ? 'Event created and published — it now appears on the homepage.'
            : 'Event saved as a draft.',
        )
      }
      onDone()
    } catch {
      toast.error('Could not save the event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="aform evt-form" onSubmit={handleSubmit}>
      <div className="evt-form__grid">
        {/* ------------------------------------------------ poster column */}
        <div className="evt-form__media">
          <span className="afield__cap">Event photograph / poster</span>
          <div className={`aform__preview ${errors.image ? 'is-invalid' : ''}`}>
            {previewUrl ? (
              <img src={previewUrl} alt="Selected event poster preview" loading="lazy" decoding="async" />
            ) : (
              <span className="aform__preview-empty">
                <ImageIcon size={16} aria-hidden="true" />
                Poster preview appears here
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn btn--outline btn--xs evt-form__pick"
            onClick={() => fileRef.current?.click()}
          >
            <ImageIcon size={13} aria-hidden="true" />
            {previewUrl ? 'Replace image' : 'Choose image'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={EVENT_IMAGE_ACCEPT}
            className="visually-hidden"
            onChange={chooseFile}
          />
          <p className="aform__hint">JPG, PNG or WebP · up to {EVENT_IMAGE_MAX_MB} MB</p>
          {(fileError || errors.image) && (
            <p className="upload__error" role="alert">
              {fileError || errors.image}
            </p>
          )}
        </div>

        {/* ------------------------------------------------ fields column */}
        <div className="aform__fields">
          <label className="afield">
            <span>Event title *</span>
            <input
              className={`input ${errors.title ? 'is-invalid' : ''}`}
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Diwali Celebration 2026"
              maxLength={90}
            />
            {errors.title && <span className="afield__err">{errors.title}</span>}
          </label>

          <label className="afield">
            <span>Short description</span>
            <textarea
              className="textarea"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="One or two lines shown under the poster."
              maxLength={300}
            />
          </label>

          <div className="evt-form__row">
            <label className="afield">
              <span>Button text (optional)</span>
              <input
                className="input"
                value={form.button_text}
                onChange={set('button_text')}
                placeholder="e.g. Learn More"
                maxLength={30}
              />
            </label>
            <label className="afield">
              <span>Button link (optional)</span>
              <input
                className={`input ${errors.button_url ? 'is-invalid' : ''}`}
                value={form.button_url}
                onChange={set('button_url')}
                placeholder="#/admissions or https://…"
              />
              {errors.button_url && <span className="afield__err">{errors.button_url}</span>}
            </label>
          </div>

          <div className="evt-form__row">
            <label className="afield">
              <span>Start date</span>
              <input
                className="input"
                type="date"
                value={form.start_date}
                onChange={set('start_date')}
              />
            </label>
            <label className="afield">
              <span>Expiry date</span>
              <input
                className={`input ${errors.expiry_date ? 'is-invalid' : ''}`}
                type="date"
                value={form.expiry_date}
                onChange={set('expiry_date')}
              />
              {errors.expiry_date && <span className="afield__err">{errors.expiry_date}</span>}
            </label>
          </div>
          <p className="aform__hint">
            Leave the dates empty to show the event until you unpublish it. The popup stops on the
            day after the expiry date.
          </p>

          <div className="evt-form__toggles">
            <label className="acheck">
              <input type="checkbox" checked={form.published} onChange={set('published')} />
              <span>Published (visible on the website)</span>
            </label>
            <label className="acheck">
              <input type="checkbox" checked={form.active} onChange={set('active')} />
              <span>Active (included in the popup queue)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="aform__actions">
        <button type="submit" className="btn btn--green" disabled={saving}>
          <Save size={15} aria-hidden="true" />
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
        </button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Preview modal (what visitors see)
// ---------------------------------------------------------------------------
function PreviewModal({ event, onClose }) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    let alive = true
    if (event) eventImageUrl(event).then((u) => alive && setUrl(u))
    return () => {
      alive = false
    }
  }, [event])
  if (!event) return null
  return (
    <div className="evt-preview" role="dialog" aria-modal="true" aria-label="Event preview">
      <div className="evt-preview__backdrop" onClick={onClose} />
      <div className="evt-preview__card">
        <button type="button" className="evt-preview__close" onClick={onClose} aria-label="Close preview">
          <X size={18} aria-hidden="true" />
        </button>
        {url && <img src={url} alt={`${event.title} poster`} loading="eager" decoding="async" />}
        <div className="evt-preview__body">
          <h3>{event.title}</h3>
          {event.description && <p>{event.description}</p>}
          {event.button_text && event.button_url && (
            <span className="btn btn--primary btn--xs">{event.button_text}</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function AdminEvents() {
  const toast = useToast()
  const events = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const [preview, setPreview] = useState(null)

  const liveCount = useMemo(() => events.filter((e) => eventStatus(e) === 'live').length, [events])

  const openCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (ev) => {
    setEditing(ev)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = async () => {
    const ev = confirmDel
    setConfirmDel(null)
    try {
      await deleteEvent(ev.id)
      toast.success('Event deleted.')
    } catch {
      toast.error('Could not delete the event.')
    }
  }

  const togglePublish = (ev) => {
    setPublished(ev.id, !ev.published)
    toast.success(ev.published ? 'Event unpublished.' : 'Event published to the homepage.')
  }

  const toggleActive = (ev) => {
    setActive(ev.id, !ev.active)
    toast.success(ev.active ? 'Event set to inactive.' : 'Event set to active.')
  }

  return (
    <div className="stack">
      {/* ------------------------------------------------------- intro bar */}
      <section className="acard">
        <div className="evt-head">
          <div>
            <h2 className="acard__title">
              <Megaphone size={17} aria-hidden="true" /> Events &amp; Announcements
            </h2>
            <p className="acard__sub">
              Published, active events appear as a poster popup on the homepage — one at a time, in
              the order below. {liveCount === 0 ? 'No events are live right now.' : null}
              {liveCount > 0 ? (
                <strong>
                  {' '}
                  {liveCount} event{liveCount > 1 ? 's are' : ' is'} live on the website.
                </strong>
              ) : null}
            </p>
          </div>
          {!showForm && (
            <button type="button" className="btn btn--green evt-head__cta" onClick={openCreate}>
              <Plus size={16} aria-hidden="true" /> Create New Event
            </button>
          )}
        </div>

        {showForm && (
          <>
            <h3 className="evt-form__heading">
              {editing ? `Edit — ${editing.title}` : 'New event'}
            </h3>
            <EventForm editing={editing} onDone={closeForm} onCancel={closeForm} />
          </>
        )}
      </section>

      {/* ------------------------------------------------------ event table */}
      <section className="acard">
        <h2 className="acard__title">All events ({events.length})</h2>
        <p className="acard__sub">
          Use the arrows to set the order visitors see. Expired events stop showing automatically.
        </p>

        {events.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No events yet"
            text="Create your first event — a Diwali celebration poster, Annual Day notice or an Admission Open announcement — and it will appear on the homepage."
          >
            <button type="button" className="btn btn--green" onClick={openCreate}>
              <Plus size={15} aria-hidden="true" /> Create New Event
            </button>
          </EmptyState>
        ) : (
          <div className="evt-table-wrap">
            <table className="evt-table">
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Image</th>
                  <th scope="col">Event</th>
                  <th scope="col">Publish</th>
                  <th scope="col">Active</th>
                  <th scope="col">Start</th>
                  <th scope="col">Expiry</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => {
                  const status = eventStatus(ev)
                  return (
                    <tr key={ev.id} className={status === 'expired' ? 'is-expired' : ''}>
                      <td data-label="Order">
                        <span className="evt-order">
                          <button
                            type="button"
                            className="evt-order__btn"
                            onClick={() => moveEvent(ev.id, -1)}
                            disabled={i === 0}
                            aria-label={`Move ${ev.title} up`}
                          >
                            <ArrowUp size={13} aria-hidden="true" />
                          </button>
                          <span className="evt-order__num">{i + 1}</span>
                          <button
                            type="button"
                            className="evt-order__btn"
                            onClick={() => moveEvent(ev.id, 1)}
                            disabled={i === events.length - 1}
                            aria-label={`Move ${ev.title} down`}
                          >
                            <ArrowDown size={13} aria-hidden="true" />
                          </button>
                        </span>
                      </td>
                      <td data-label="Image">
                        <EventThumb event={ev} />
                      </td>
                      <td data-label="Event">
                        <span className="evt-title">{ev.title}</span>
                        {ev.description && <span className="evt-desc">{ev.description}</span>}
                        <span className={`tag evt-status evt-status--${status}`}>
                          {STATUS_LABEL[status]}
                        </span>
                      </td>
                      <td data-label="Publish">
                        <button
                          type="button"
                          className={`evt-pill ${ev.published ? 'is-on' : ''}`}
                          onClick={() => togglePublish(ev)}
                          aria-pressed={ev.published}
                        >
                          {ev.published ? <CheckCircle2 size={13} /> : <CircleSlash size={13} />}
                          {ev.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td data-label="Active">
                        <button
                          type="button"
                          className={`evt-pill ${ev.active ? 'is-on' : ''}`}
                          onClick={() => toggleActive(ev)}
                          aria-pressed={ev.active}
                        >
                          {ev.active ? <Eye size={13} /> : <EyeOff size={13} />}
                          {ev.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td data-label="Start">{fmt(ev.start_date)}</td>
                      <td data-label="Expiry">{fmt(ev.expiry_date)}</td>
                      <td data-label="Actions">
                        <span className="evt-actions">
                          <button
                            type="button"
                            className="btn btn--outline btn--xs"
                            onClick={() => setPreview(ev)}
                          >
                            <MonitorPlay size={13} aria-hidden="true" /> Preview
                          </button>
                          <button
                            type="button"
                            className="btn btn--outline btn--xs"
                            onClick={() => openEdit(ev)}
                          >
                            <Pencil size={13} aria-hidden="true" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger btn--xs"
                            onClick={() => setConfirmDel(ev)}
                          >
                            <Trash2 size={13} aria-hidden="true" /> Delete
                          </button>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="acard__foot evt-foot">
          <button
            type="button"
            className="btn btn--outline btn--xs"
            onClick={() => {
              clearDismissed()
              toast.success('Popup reset — open the homepage to see the sequence again.')
            }}
          >
            Reset popup for this browser
          </button>
          <span className="aform__hint">
            Visitors see each poster once per browsing session. Use this to review the sequence
            again on this device.
          </span>
        </div>
      </section>

      <p className="admin-note">
        Events and poster images are synchronized with Supabase Database + Storage. Published events are shared with every website visitor.
      </p>

      <ConfirmDialog
        open={Boolean(confirmDel)}
        title="Delete this event?"
        message={`“${confirmDel?.title}” and its poster image will be permanently removed. This cannot be undone.`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
      />

      {preview && <PreviewModal event={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
