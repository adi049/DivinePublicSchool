import { Info, MoveHorizontal } from 'lucide-react'

const DAY_HEADINGS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Renders a weekly class timetable.
 * On small screens the table scrolls horizontally inside its frame.
 * Data shape comes from src/data/curriculum.js (TIMETABLES).
 */
export default function Timetable({ timetable }) {
  return (
    <div className="tt">
      <p className="tt__label">{timetable.label}</p>
      <div className="tt__scroll">
        <table className="tt__table">
          <thead>
            <tr>
              <th scope="col">{timetable.periodLabel || 'Period'}</th>
              <th scope="col">Time</th>
              {DAY_HEADINGS.map((day) => (
                <th key={day} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetable.rows.map((row, i) =>
              row.breakRow ? (
                <tr key={`break-${i}`} className="tt__break">
                  <th scope="row">—</th>
                  <td className="tt__time">{row.time}</td>
                  <td colSpan={6}>{row.label}</td>
                </tr>
              ) : (
                <tr key={row.period}>
                  <th scope="row">{row.period}</th>
                  <td className="tt__time">{row.time}</td>
                  {row.days.map((subject, d) => (
                    <td key={d}>{subject}</td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <p className="tt__hint">
        <MoveHorizontal size={14} aria-hidden="true" />
        Swipe sideways to see the full week.
      </p>
      <p className="tt__note">
        <Info size={15} aria-hidden="true" />
        This is a sample timetable for website preview only. The confirmed class timetable will be
        shared by the school and updated here.
      </p>
    </div>
  )
}
