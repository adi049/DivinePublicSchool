// ============================================================================
// ADMIN — MANAGE SUBJECTS (per class, per stream for Classes 11–12)
// ============================================================================
// Add / edit / delete / reorder subjects, then Save. The public curriculum
// page reads the saved list directly, so changes go live immediately.
// ============================================================================

import { useEffect, useMemo, useState } from 'react'
import { BookMarked, Plus, ArrowUp, ArrowDown, Trash2, Save, RotateCcw } from 'lucide-react'
import ClassStreamPicker from '../../components/admin/ClassStreamPicker.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useToast } from '../../components/admin/Toast.jsx'
import { listSubjectNames, replaceSubjects } from '../../services/subjectService.js'
import { classFullLabel, needsStream } from '../../services/catalogue.js'

const EXAMPLE_SUGGESTIONS = ['Hindi', 'English', 'Mathematics', 'Science', 'General Knowledge', 'Art and Craft', 'Physical Education']

export default function AdminSubjects() {
  const toast = useToast()
  const [combo, setCombo] = useState({ classId: 'nursery', stream: null })
  const [names, setNames] = useState([])
  const [savedSnapshot, setSavedSnapshot] = useState([])
  const [newName, setNewName] = useState('')
  const [removeIndex, setRemoveIndex] = useState(null)
  const [tick, setTick] = useState(0)

  const saved = useMemo(
    () => listSubjectNames(combo.classId, needsStream(combo.classId) ? combo.stream : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [combo.classId, combo.stream, tick],
  )

  useEffect(() => {
    setNames(saved)
    setSavedSnapshot(saved)
  }, [saved])

  const dirty = JSON.stringify(names) !== JSON.stringify(savedSnapshot)
  const label = classFullLabel(combo.classId, needsStream(combo.classId) ? combo.stream : null)

  const edit = (i, value) => setNames((n) => n.map((x, k) => (k === i ? value : x)))
  const move = (i, dir) => {
    setNames((n) => {
      const next = [...n]
      const j = i + dir
      if (j < 0 || j >= next.length) return next
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }
  const add = () => {
    const clean = newName.trim()
    if (!clean) return
    if (names.some((n) => n.toLowerCase() === clean.toLowerCase())) {
      toast.error(`“${clean}” is already in this list.`)
      return
    }
    setNames((n) => [...n, clean])
    setNewName('')
  }

  const handleSave = () => {
    if (names.length === 0) {
      toast.error('Add at least one subject before saving.')
      return
    }
    try {
      replaceSubjects(combo.classId, needsStream(combo.classId) ? combo.stream : null, names)
      setTick((t) => t + 1)
      toast.success(`Subjects for ${label} saved — live on the website now.`)
    } catch {
      toast.error('Could not save subjects. Please try again.')
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">Select class</h2>
        <ClassStreamPicker value={combo} onChange={setCombo} />
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <BookMarked size={17} aria-hidden="true" /> Subjects for {label}
          {dirty && (
            <span className="tag tag--magenta" style={{ marginLeft: 8 }}>
              Unsaved changes
            </span>
          )}
        </h2>
        <p className="acard__sub">
          {names.length} subject{names.length === 1 ? '' : 's'}. These lists start from the current
          website data — edit and save to update the public page.
        </p>

        <ul className="subj-list">
          {names.map((name, i) => (
            <li key={`${i}`} className="subj-row">
              <span className="subj-row__order">{i + 1}</span>
              <input
                className="input subj-row__input"
                value={name}
                onChange={(e) => edit(i, e.target.value)}
                aria-label={`Subject ${i + 1}`}
              />
              <span className="subj-row__tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === names.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  className="subj-row__del"
                  onClick={() => setRemoveIndex(i)}
                  aria-label={`Remove ${name}`}
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </li>
          ))}
        </ul>

        <div className="subj-add">
          <input
            className="input"
            placeholder="New subject name, e.g. General Knowledge"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add()
              }
            }}
            list="subject-suggestions"
          />
          <datalist id="subject-suggestions">
            {EXAMPLE_SUGGESTIONS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <button type="button" className="btn btn--outline" onClick={add}>
            <Plus size={15} aria-hidden="true" /> Add subject
          </button>
        </div>

        <div className="aform__actions">
          <button type="button" className="btn btn--green" onClick={handleSave} disabled={!dirty}>
            <Save size={15} aria-hidden="true" /> Save changes
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setNames(savedSnapshot)}
            disabled={!dirty}
          >
            <RotateCcw size={15} aria-hidden="true" /> Discard changes
          </button>
        </div>
      </section>

      <ConfirmDialog
        open={removeIndex !== null}
        title="Remove this subject?"
        message={`“${removeIndex !== null ? names[removeIndex] : ''}” will be removed from ${label}. The change applies when you press Save changes.`}
        confirmLabel="Remove"
        onCancel={() => setRemoveIndex(null)}
        onConfirm={() => {
          setNames((n) => n.filter((_, k) => k !== removeIndex))
          setRemoveIndex(null)
        }}
      />
    </div>
  )
}
