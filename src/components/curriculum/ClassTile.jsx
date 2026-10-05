import { CheckCircle2 } from 'lucide-react'

/**
 * Selectable class card used in the curriculum class picker.
 */
export default function ClassTile({ cls, active, onSelect }) {
  return (
    <button
      type="button"
      className={`class-tile ${active ? 'is-active' : ''}`}
      onClick={() => onSelect(cls.id)}
      aria-pressed={active}
    >
      {active && <CheckCircle2 size={16} className="class-tile__check" aria-hidden="true" />}
      <span className="class-tile__label">{cls.label}</span>
      <span className="class-tile__stage">{cls.stage}</span>
    </button>
  )
}
