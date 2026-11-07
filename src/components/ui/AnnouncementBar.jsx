import { Megaphone } from 'lucide-react'
import { useSettings } from '../../services/hooks.js'

/**
 * Announcement ribbon above the navbar — managed from
 * Admin Dashboard → Website Settings. Hidden when disabled.
 */
export default function AnnouncementBar() {
  const { announcement } = useSettings()
  if (!announcement?.enabled || !announcement.text?.trim()) return null
  return (
    <div className="announce" role="status">
      <div className="container announce__inner">
        <Megaphone size={14} aria-hidden="true" />
        <span>{announcement.text}</span>
      </div>
    </div>
  )
}
