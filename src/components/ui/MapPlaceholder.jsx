import { MapPin, Navigation } from 'lucide-react'
import Button from './Button.jsx'
import { SCHOOL } from '../../data/school.js'

/**
 * Placeholder panel where a live Google Maps embed can later be dropped in.
 * (Replace this component's contents with an <iframe> embed when ready.)
 */
export default function MapPlaceholder({ compact = false }) {
  return (
    <div className="map-ph" role="img" aria-label={`Map placeholder for ${SCHOOL.address}`}>
      <span className="map-ph__icon">
        <MapPin size={24} aria-hidden="true" />
      </span>
      <h4>{SCHOOL.address}</h4>
      {!compact && (
        <p>
          An interactive Google Map of the school location will be embedded here. In the meantime,
          use the button below to open directions.
        </p>
      )}
      <Button href={SCHOOL.mapsUrl} target="_blank" rel="noreferrer" variant="outline" icon={Navigation}>
        Get Directions
      </Button>
    </div>
  )
}
