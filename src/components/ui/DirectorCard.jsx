import { Quote, ArrowRight } from 'lucide-react'
import Button from './Button.jsx'
import { DIRECTOR } from '../../data/school.js'

/**
 * Director profile card — leadership section.
 * - variant="full"     → About page (full official message + profile area)
 * - variant="preview"  → Home page (short excerpt + read-more link)
 * All content comes from src/data/school.js (DIRECTOR) so the future
 * admin panel can edit it in one place.
 */
export default function DirectorCard({ variant = 'full' }) {
  const isPreview = variant === 'preview'

  return (
    <article className={`director-card ${isPreview ? 'director-card--flat' : ''}`}>
      <div className="director-card__photo">
        <img src={DIRECTOR.photo} alt={DIRECTOR.photoAlt} loading="lazy" decoding="async" />
      </div>

      <div className="director-card__msg">
        <Quote size={30} className="director-card__quote" aria-hidden="true" />

        {isPreview ? (
          <p className="serif-quote">“{DIRECTOR.excerpt}”</p>
        ) : (
          <>
            {DIRECTOR.message.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <p className="serif-quote">{DIRECTOR.quote}</p>
          </>
        )}

        <div className="director-card__sign">
          <div>
            <div className="director-card__name">{DIRECTOR.name}</div>
            <div className="director-card__role">{DIRECTOR.designation}</div>
          </div>
          {isPreview && (
            <Button to="/about#director" variant="outline" icon={ArrowRight}>
              Read Full Message
            </Button>
          )}
        </div>

        {!isPreview && DIRECTOR.bio?.length > 0 && (
          <div className="director-card__bio">
            <h4>About the Director</h4>
            <ul className="hl-list">
              {DIRECTOR.bio.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  )
}
