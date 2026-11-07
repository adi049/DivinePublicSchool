// ============================================================================
// ADMIN — MANAGE TIMETABLES (Nursery → Class 12; 11/12 per stream)
// ============================================================================
// Workflow: pick class (→ stream) → upload photograph → title / session /
// effective date → preview → publish, replace or delete. One record per
// class-stream combination; saving replaces the previous one.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Eye, EyeOff, Trash2, Save, ImageOff } from 'lucide-react'
import ClassStreamPicker from '../../components/admin/ClassStreamPicker.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import UploadField from '../../components/admin/UploadField.jsx'
import { EmptyState } from '../../components/admin/AdminUI.jsx'
import { useToast } from '../../components/admin/Toast.jsx'
import {
  getTimetable,
  saveTimetable,
  deleteTimetable,
  setTimetablePublished,
  timetableImageUrl,
} from '../../services/timetableService.js'
import { classFullLabel, needsStream } from '../../services/catalogue.js'
import { SCHOOL } from '../../data/school.js'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminTimetables() {
  const toast = useToast()
  const [combo, setCombo] = useState({ classId: 'nursery', stream: null })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null) // object URL (selected file or stored blob)
  const [title, setTitle] = useState('')
  const [session, setSession] = useState(SCHOOL.session)
  const [effectiveDate, setEffectiveDate] = useState(todayISO())
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [tick, setTick] = useState(0) // force reload after save/delete
  const localPreview = useRef(null) // object URL created from the selected File (revoked on change/unmount)

  const existing = useMemo(
    () => getTimetable(combo.classId, combo.stream),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo.classId, combo.stream, tick],
  )

  // Load the existing record into the form whenever the combo changes
  useEffect(() => {
    setFile(null)
    if (existing) {
      setTitle(existing.title || `${classFullLabel(existing.class_id, existing.stream)} Timetable`)
      setSession(existing.academic_session || SCHOOL.session)
      setEffectiveDate(existing.effective_date || todayISO())
      setPublished(existing.published)
      timetableImageUrl(existing).then((url) => setPreview(url))
    } else {
      setTitle(`${classFullLabel(combo.classId, combo.stream)} Timetable`)
      setSession(SCHOOL.session)
      setEffectiveDate(todayISO())
      setPublished(true)
      setPreview(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo.classId, combo.stream, tick])

  // Revoke only the preview URL we created ourselves (never service-cached URLs)
  useEffect(() => {
    return () => {
      if (localPreview.current) URL.revokeObjectURL(localPreview.current)
    }
  }, [])

  const onFile = (f) => {
    setFile(f)
    if (localPreview.current) {
      URL.revokeObjectURL(localPreview.current)
      localPreview.current = null
    }
    if (f) {
      localPreview.current = URL.createObjectURL(f)
      setPreview(localPreview.current)
    } else if (existing) {
      timetableImageUrl(existing).then(setPreview)
    } else {
      setPreview(null)
    }
  }

  const canSave = title.trim() && (file || existing?.image_file_id)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!canSave || saving) return
    setSaving(true)
    try {
      await saveTimetable({
        class_id: combo.classId,
        stream: needsStream(combo.classId) ? combo.stream : null,
        title,
        academic_session: session,
        effective_date: effectiveDate,
        published,
        file,
      })
      toast.success(
        existing
          ? `Timetable for ${classFullLabel(combo.classId, combo.stream)} updated.`
          : `Timetable for ${classFullLabel(combo.classId, combo.stream)} published.`,
      )
      setTick((t) => t + 1)
    } catch {
      toast.error('Could not save the timetable. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setConfirmDel(false)
    try {
      await deleteTimetable(existing.id)
      toast.success('Timetable deleted.')
      setTick((t) => t + 1)
    } catch {
      toast.error('Could not delete the timetable.')
    }
  }

  const togglePublish = async () => {
    try {
      await setTimetablePublished(existing.id, !existing.published)
      toast.success(existing.published ? 'Timetable unpublished (hidden from website).' : 'Timetable published.')
      setTick((t) => t + 1)
    } catch (error) {
      toast.error(error.message || 'Could not update timetable publishing status.')
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">Select class</h2>
        <p className="acard__sub">
          Choose the class whose timetable you want to manage. Classes 11 and 12 also need a stream —
          their timetables are kept separate.
        </p>
        <ClassStreamPicker value={combo} onChange={(c) => setCombo(c)} />
      </section>

      <section className="acard" aria-live="polite">
        <h2 className="acard__title">
          <CalendarDays size={17} aria-hidden="true" /> {classFullLabel(combo.classId, combo.stream)} timetable
          {existing && (
            <span className={`tag ${existing.published ? 'tag--green' : 'tag--silver'}`} style={{ marginLeft: 8 }}>
              {existing.published ? 'Published' : 'Hidden'}
            </span>
          )}
        </h2>

        {!existing && (
          <p className="acard__sub">No timetable has been uploaded for this selection yet.</p>
        )}

        <form className="aform" onSubmit={handleSave}>
          <div className="aform__grid">
            <div>
              <UploadField
                accept="image/*"
                file={file}
                onFile={onFile}
                label={existing ? 'Upload a replacement photograph' : 'Upload timetable photograph'}
                hint="Clear JPG/PNG photo of the timetable"
              />

              <div className="aform__preview">
                {preview ? (
                  <img
                      src={preview}
                      alt={`Preview — ${classFullLabel(combo.classId, combo.stream)} timetable`}
                      loading="lazy"
                      decoding="async"
                    />
                ) : (
                  <span className="aform__preview-empty">
                    <ImageOff size={18} aria-hidden="true" /> Image preview will appear here
                  </span>
                )}
              </div>
            </div>

            <div className="aform__fields">
              <label className="afield">
                <span>Timetable title</span>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class 4 Timetable"
                  required
                />
              </label>
              <label className="afield">
                <span>Academic session</span>
                <input
                  className="input"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="e.g. 2026–27"
                />
              </label>
              <label className="afield">
                <span>Effective / last-updated date</span>
                <input
                  className="input"
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </label>
              <label className="acheck">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <span>Publish on the public website</span>
              </label>
            </div>
          </div>

          <div className="aform__actions">
            <button type="submit" className="btn btn--green" disabled={!canSave || saving}>
              <Save size={15} aria-hidden="true" />
              {saving ? 'Saving…' : existing ? 'Save / update timetable' : 'Publish timetable'}
            </button>
            {existing && (
              <>
                <button type="button" className="btn btn--outline" onClick={togglePublish}>
                  {existing.published ? (
                    <>
                      <EyeOff size={15} aria-hidden="true" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Eye size={15} aria-hidden="true" /> Publish
                    </>
                  )}
                </button>
                <button type="button" className="btn btn--danger" onClick={() => setConfirmDel(true)}>
                  <Trash2 size={15} aria-hidden="true" /> Delete
                </button>
              </>
            )}
          </div>
          {canSave === false && (
            <p className="aform__hint">A photograph is required before the timetable can be saved.</p>
          )}
        </form>

        {existing && (
          <p className="acard__foot">
            Last updated{' '}
            {new Date(existing.updated_at).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
            {existing.effective_date && ` · effective ${existing.effective_date}`} · session{' '}
            {existing.academic_session || '—'}
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirmDel}
        title="Delete this timetable?"
        message={`The timetable for ${classFullLabel(combo.classId, combo.stream)} and its photograph will be removed. Visitors will see the “available soon” note instead.`}
        onCancel={() => setConfirmDel(false)}
        onConfirm={handleDelete}
      />

      {!existing && (
        <EmptyState
          icon={CalendarDays}
          title="Nothing published for this class yet"
          text="This is normal — upload the first timetable using the form above."
        />
      )}
    </div>
  )
}
