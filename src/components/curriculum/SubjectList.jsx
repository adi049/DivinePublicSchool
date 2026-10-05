import { BookMarked, Info } from 'lucide-react'

/**
 * Grid list of subjects for a class (or stream).
 */
export default function SubjectList({ subjects }) {
  return (
    <div>
      <div className="subject-grid">
        {subjects.map((subject) => (
          <div className="subject-item" key={subject}>
            <BookMarked size={16} aria-hidden="true" />
            <span>{subject}</span>
          </div>
        ))}
      </div>
      <p className="subject-note">
        <Info size={15} aria-hidden="true" />
        The subject list shown is website placeholder data based on the standard CBSE pattern. It
        will be updated with the school’s confirmed subject combinations.
      </p>
    </div>
  )
}
