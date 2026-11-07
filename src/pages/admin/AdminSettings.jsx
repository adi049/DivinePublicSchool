// ============================================================================
// ADMIN — WEBSITE SETTINGS + SECURITY
// ============================================================================

import { useState } from 'react'
import { Megaphone, Save, ShieldCheck, Database } from 'lucide-react'
import { useToast } from '../../components/admin/Toast.jsx'
import { useSettings } from '../../services/hooks.js'
import { saveSettings } from '../../services/settingsService.js'

export default function AdminSettings() {
  const toast = useToast()
  const settings = useSettings()

  const [enabled, setEnabled] = useState(settings.announcement.enabled)
  const [text, setText] = useState(settings.announcement.text)



  const saveAnnouncement = (e) => {
    e.preventDefault()
    if (enabled && !text.trim()) {
      toast.error('Add announcement text or switch the banner off.')
      return
    }
    saveSettings({ announcement: { enabled, text: text.trim() } })
    toast.success(enabled ? 'Announcement is live on the website.' : 'Announcement banner switched off.')
  }



  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">
          <ShieldCheck size={17} aria-hidden="true" /> Secure admin access
        </h2>
        <p className="acard__sub">
          Admin access uses Supabase email-and-password authentication. Only accounts listed in
          the school's <code>school_admins</code> table can open the dashboard. There is no device-local PIN.
          Sign out from the dashboard menu when you finish.
        </p>
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <Database size={17} aria-hidden="true" /> Shared data storage
        </h2>
        <p className="acard__sub">
          Timetables, subjects, date sheets, gallery photos, events and announcement settings are
          synchronized with the school's Supabase database. Uploaded images and documents are kept
          in the public school-media bucket; upload and delete access is restricted to school admins.
        </p>
      </section>
    </div>
  )
}
