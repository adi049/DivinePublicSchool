import { CLASS_LIST, STREAM_LIST, needsStream } from '../../services/catalogue.js'

/**
 * Shared class (+stream) selector used by all admin managers.
 * Controlled: value = { classId, stream }, onChange({ classId, stream }).
 */
export default function ClassStreamPicker({ value, onChange }) {
  const { classId, stream } = value
  const hasStreams = needsStream(classId)

  return (
    <div className="picker">
      <div className="picker__field">
        <label className="picker__label" htmlFor="picker-class">
          Class
        </label>
        <select
          id="picker-class"
          className="select"
          value={classId}
          onChange={(e) => {
            const nextClass = e.target.value
            onChange({
              classId: nextClass,
              stream: needsStream(nextClass) ? stream || 'science' : null,
            })
          }}
        >
          {CLASS_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {hasStreams && (
        <div className="picker__field">
          <span className="picker__label" id="picker-stream-label">
            Stream
          </span>
          <div className="picker__streams" role="group" aria-labelledby="picker-stream-label">
            {STREAM_LIST.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`picker__stream ${stream === s.id ? 'is-active' : ''}`}
                aria-pressed={stream === s.id}
                onClick={() => onChange({ classId, stream: s.id })}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
