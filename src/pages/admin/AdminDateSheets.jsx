// ============================================================================
// ADMIN — DATE SHEETS FOR EXAMINATIONS (image or PDF, per class / stream)
// ============================================================================

import { useEffect, useMemo, useRef, useState } from 'react'
import { FileClock, Eye, EyeOff, Trash2, Save, FileText, ImageOff } from 'lucide-react'
import ClassStreamPicker from '../../components/admin/ClassStreamPicker.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import UploadField from '../../components/admin/UploadField.jsx'
import { useToast } from '../../components/admin/Toast.jsx'
import {
  getDateSheet,
  saveDateSheet,
  deleteDateSheet,
  setDateSheetPublished,
  dateSheetDocumentUrl,
  documentTypeOf,
} from '../../services/datesheetService.js'
import { classFullLabel, needsStream } from '../../services/catalogue.js'
import { SCHOOL } from '../../data/school.js'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminDateSheets() {
  const toast = useToast()
  const [combo, setCombo] = useState({ classId: 'nursery', stream: null })
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [examName, setExamName] = useState('')
  const [session, setSession] = useState(SCHOOL.session)
  const [pubDate, setPubDate] = useState(todayISO())
  const [published, setPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [tick, setTick] = useState(0)
  const localPreview = useRef(null)

  // Revoke our own temporary preview URL on unmount
  useEffect(() => {
    return () => {
      if (localPreview.current) URL.revokeObjectURL(localPreview.current)
    }
  }, [])

  const existing = useMemo(
    () => getDateSheet(combo.classId, needsStream(combo.classId) ? combo.stream : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo.classId, combo.stream, tick],
  )

  const docType = file ? documentTypeOf(file) : existing?.document_type || null

  useEffect(() => {
    setFile(null)
    if (existing) {
      setExamName(existing.exam_name || '')
      setSession(existing.academic_session || SCHOOL.session)
      setPubDate(existing.publication_date || todayISO())
      setPublished(existing.published)
      dateSheetDocumentUrl(existing).then(setPreviewUrl)
    } else {
      setExamName('')
      setSession(SCHOOL.session)
      setPubDate(todayISO())
      setPublished(true)
      setPreviewUrl(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo.classId, combo.stream, tick])

  const onFile = (f) => {
    setFile(f)
    if (localPreview.current) {
      URL.revokeObjectURL(localPreview.current)
      localPreview.current = null
    }
    if (f) {
      localPreview.current = URL.createObjectURL(f)
      setPreviewUrl(localPreview.current)
    } else if (existing) {
      dateSheetDocumentUrl(existing).then(setPreviewUrl)
    } else {
      setPreviewUrl(null)
    }
  }

  const canSave = examName.trim() && (file || existing?.document_file_id)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!canSave || saving) return
    setSaving(true)
    try {
      await saveDateSheet({
        class_id: combo.classId,
        stream: needsStream(combo.classId) ? combo.stream : null,
        exam_name: examName,
        academic_session: session,
        publication_date: pubDate,
        published,
        file,
      })
      toast.success(
        existing
          ? `Date sheet for ${classFullLabel(combo.classId, combo.stream)} updated.`
          : `Date sheet for ${classFullLabel(combo.classId, combo.stream)} published.`,
      )
      setTick((t) => t + 1)
    } catch {
      toast.error('Could not save the date sheet. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setConfirmDel(false)
    try {
      await deleteDateSheet(existing.id)
      toast.success('Date sheet deleted.')
      setTick((t) => t + 1)
    } catch {
      toast.error('Could not delete the date sheet.')
    }
  }

  const togglePublish = () => {
    setDateSheetPublished(existing.id, !existing.published)
    toast.success(existing.published ? 'Date sheet unpublished (hidden from website).' : 'Date sheet published.')
    setTick((t) => t + 1)
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">Select class</h2>
        <ClassStreamPicker value={combo} onChange={setCombo} />
      </section>

      <section className="acard" aria-live="polite">
        <h2 className="acard__title">
          <FileClock size={17} aria-hidden="true" /> Date sheet — {classFullLabel(combo.classId, combo.stream)}
          {existing && (
            <span className={`tag ${existing.published ? 'tag--green' : 'tag--silver'}`} style={{ marginLeft: 8 }}>
              {existing.published ? 'Published' : 'Hidden'}
            </span>
          )}
          {existing && (
            <span className="tag tag--magenta" style={{ marginLeft: 8 }}>
              {existing.document_type === 'pdf' ? 'PDF' : 'Image'}
            </span>
          )}
        </h2>

        <form className="aform" onSubmit={handleSave}>
          <div className="aform__grid">
            <div>
              <UploadField
                accept="image/*,application/pdf"
                file={file}
                onFile={onFile}
                label={existing ? 'Upload a replacement (image or PDF)' : 'Upload date sheet (image or PDF)'}
                hint="JPG/PNG image or PDF"
              />

              <div className="aform__preview">
                {previewUrl ? (
                  docType === 'pdf' ? (
                    <div className="aform__preview-pdf">
                      <FileText size={20} aria-hidden="true" />
                      <span>PDF selected</span>
                      <a href={previewUrl} target="_blank" rel="noreferrer" className="btn btn--outline">
                        Preview PDF
                      </a>
                    </div>
                  ) : (
                    <img src={previewUrl} alt="Date sheet preview" loading="lazy" decoding="async" />
                  )
                ) : (
                  <span className="aform__preview-empty">
                    <ImageOff size={18} aria-hidden="true" /> Preview will appear here
                  </span>
                )}
              </div>
            </div>

            <div className="aform__fields">
              <label className="afield">
                <span>Examination name</span>
                <input
                  className="input"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Half-Yearly Examination"
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
                <span>Publication date</span>
                <input
                  className="input"
                  type="date"
                  value={pubDate}
                  onChange={(e) => setPubDate(e.target.value)}
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
              {saving ? 'Saving…' : existing ? 'Save / update date sheet' : 'Publish date sheet'}
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
          {!canSave && (
            <p className="aform__hint">
              An examination name and a document (image or PDF) are required before saving.
            </p>
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
            {existing.publication_date && ` · published ${existing.publication_date}`} · session{' '}
            {existing.academic_session || '—'}
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirmDel}
        title="Delete this date sheet?"
        message={`The date sheet for ${classFullLabel(combo.classId, combo.stream)} and its file will be removed. Visitors will see the “available soon” note instead.`}
        onCancel={() => setConfirmDel(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
