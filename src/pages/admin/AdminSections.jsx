import { useEffect, useMemo, useState } from 'react'
import { Layers3, Plus, Pencil, Check, X, Trash2, Power, RefreshCw } from 'lucide-react'
import { CLASS_LIST } from '../../services/catalogue.js'
import {
  createClassSection,
  deleteClassSection,
  listClassSections,
  updateClassSection,
} from '../../services/classSectionService.js'
import { useToast } from '../../components/admin/Toast.jsx'
import { EmptyState } from '../../components/admin/AdminUI.jsx'

export default function AdminSections() {
  const toast = useToast()
  const [classId, setClassId] = useState(CLASS_LIST[0].id)
  const [sections, setSections] = useState([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selectedClass = useMemo(() => CLASS_LIST.find((item) => item.id === classId), [classId])

  const refresh = async () => {
    setLoading(true)
    try {
      const rows = await listClassSections(classId)
      setSections(rows || [])
    } catch (error) {
      toast.error(error.message || 'Could not load class sections.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // refresh is intentionally scoped to the selected class.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId])

  const addSection = async (event) => {
    event.preventDefault()
    const clean = newName.trim()
    if (!clean || saving) return
    if (sections.some((item) => item.section_name.toLowerCase() === clean.toLowerCase())) {
      toast.error('This section already exists for the selected class.')
      return
    }
    setSaving(true)
    try {
      const nextOrder = sections.reduce((max, item) => Math.max(max, Number(item.display_order) || 0), 0) + 1
      const created = await createClassSection({ classId, sectionName: clean, displayOrder: nextOrder })
      setSections((current) => [...current, created].sort((a, b) => a.display_order - b.display_order))
      setNewName('')
      toast.success(`${clean} added to ${selectedClass.label}.`)
    } catch (error) {
      toast.error(error.message || 'Could not add this section.')
    } finally {
      setSaving(false)
    }
  }

  const saveEdit = async (id) => {
    const clean = editingName.trim()
    if (!clean) {
      toast.error('Section name cannot be empty.')
      return
    }
    if (sections.some((item) => item.id !== id && item.section_name.toLowerCase() === clean.toLowerCase())) {
      toast.error('This section name already exists.')
      return
    }
    setSaving(true)
    try {
      const updated = await updateClassSection(id, { section_name: clean })
      setSections((current) => current.map((item) => item.id === id ? updated : item))
      setEditingId(null)
      toast.success('Section name updated.')
    } catch (error) {
      toast.error(error.message || 'Could not update section.')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (section) => {
    setSaving(true)
    try {
      const updated = await updateClassSection(section.id, { active: !section.active })
      setSections((current) => current.map((item) => item.id === section.id ? updated : item))
      toast.success(`${section.section_name} is now ${updated.active ? 'active' : 'inactive'}.`)
    } catch (error) {
      toast.error(error.message || 'Could not update section status.')
    } finally {
      setSaving(false)
    }
  }

  const removeSection = async (section) => {
    if (!window.confirm(`Delete section ${section.section_name} from ${selectedClass.label}? Existing timetable/date-sheet links will be detached, not deleted.`)) return
    setSaving(true)
    try {
      await deleteClassSection(section.id)
      setSections((current) => current.filter((item) => item.id !== section.id))
      toast.success(`${section.section_name} deleted.`)
    } catch (error) {
      toast.error(error.message || 'Could not delete section.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title"><Layers3 size={18} /> Class sections</h2>
        <p className="acard__sub">
          Choose a class and create its sections. Only active sections will be offered on the public website.
          Classes without sections will continue to open directly.
        </p>
        <div className="picker">
          <label className="picker__field">
            <span className="picker__label">Select class</span>
            <select className="select" value={classId} onChange={(event) => setClassId(event.target.value)}>
              {CLASS_LIST.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <button type="button" className="btn btn--outline" onClick={refresh} disabled={loading}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </section>

      <section className="acard">
        <h2 className="acard__title">{selectedClass?.label}: section list</h2>
        <form className="subj-add" onSubmit={addSection}>
          <input
            className="input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Section name, e.g. A, B, C"
            maxLength={40}
            aria-label="New section name"
          />
          <button className="btn btn--green" type="submit" disabled={saving || !newName.trim()}>
            <Plus size={15} /> {saving ? 'Saving…' : 'Add section'}
          </button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          {loading ? (
            <p className="admin-note">Loading sections…</p>
          ) : sections.length === 0 ? (
            <EmptyState
              icon={Layers3}
              title="No sections configured"
              text={`${selectedClass?.label} has no sections. The public website will show this class directly until you add one.`}
            />
          ) : (
            <ul className="subj-list">
              {sections.map((section, index) => (
                <li className="subj-row" key={section.id}>
                  <span className="subj-row__order">{index + 1}</span>
                  {editingId === section.id ? (
                    <input
                      className="input subj-row__input"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') saveEdit(section.id)
                        if (event.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                    />
                  ) : (
                    <strong className="subj-row__input" style={{ padding: '0.5rem 0.7rem' }}>
                      {section.section_name}
                    </strong>
                  )}
                  <span className={`tag ${section.active ? 'tag--green' : 'tag--silver'}`}>
                    {section.active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="subj-row__tools">
                    {editingId === section.id ? (
                      <>
                        <button type="button" disabled={saving} onClick={() => saveEdit(section.id)} aria-label="Save section name"><Check size={15} /></button>
                        <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel editing"><X size={15} /></button>
                      </>
                    ) : (
                      <button type="button" disabled={saving} onClick={() => { setEditingId(section.id); setEditingName(section.section_name) }} aria-label="Edit section"><Pencil size={15} /></button>
                    )}
                    <button type="button" disabled={saving} onClick={() => toggleActive(section)} aria-label={section.active ? 'Deactivate section' : 'Activate section'}><Power size={15} /></button>
                    <button type="button" className="subj-row__del" disabled={saving} onClick={() => removeSection(section)} aria-label="Delete section"><Trash2 size={15} /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="acard__foot">
          Section changes are saved directly to the shared school database. Deleting a section does not delete its uploaded documents.
        </p>
      </section>
    </div>
  )
}
