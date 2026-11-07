// ============================================================================
// ADMIN — WEBSITE SETTINGS, ADMIN ACCOUNT & SHARED STORAGE
// ============================================================================

import { useEffect, useState } from 'react'
import { Megaphone, Save, ShieldCheck, Database, Mail, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../components/admin/Toast.jsx'
import { useSettings } from '../../services/hooks.js'
import { saveSettings } from '../../services/settingsService.js'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function AdminSettings() {
  const toast = useToast()
  const settings = useSettings()
  const { user } = useAdminAuth()
  const [enabled, setEnabled] = useState(Boolean(settings.announcement?.enabled))
  const [text, setText] = useState(settings.announcement?.text || '')
  const [saving, setSaving] = useState(false)

  // Keep the editor in sync if settings are refreshed from the shared database.
  useEffect(() => {
    setEnabled(Boolean(settings.announcement?.enabled))
    setText(settings.announcement?.text || '')
  }, [settings.announcement?.enabled, settings.announcement?.text])

  const saveAnnouncement = async (e) => {
    e.preventDefault()
    if (enabled && !text.trim()) {
      toast.error('Add announcement text or switch the banner off.')
      return
    }
    setSaving(true)
    try {
      await saveSettings({ announcement: { enabled, text: text.trim() } })
      toast.success(enabled ? 'Announcement saved and published.' : 'Announcement banner switched off.')
    } catch (error) {
      toast.error(error.message || 'Could not save website settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">
          <Megaphone size={17} aria-hidden="true" /> Website announcement
        </h2>
        <p className="acard__sub">
          Write a short notice for parents. When enabled, it appears above the navigation bar
          on the public website and is shared across devices.
        </p>
        <form className="aform" onSubmit={saveAnnouncement}>
          <label className="afield">
            <span>Announcement message</span>
            <textarea
              className="textarea"
              rows={3}
              maxLength={240}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Admissions are open for the 2026–27 academic session."
            />
            <small>{text.length}/240 characters</small>
          </label>
          <label className="afield" style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span>Show announcement on the website</span>
          </label>
          <div className="aform__actions">
            <button className="btn btn--primary" type="submit" disabled={saving}>
              <Save size={15} aria-hidden="true" /> {saving ? 'Saving…' : 'Save Website Settings'}
            </button>
          </div>
        </form>
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <ShieldCheck size={17} aria-hidden="true" /> Admin access
        </h2>
        <p className="acard__sub">
          This dashboard is protected by Supabase email-and-password authentication. Only
          accounts registered in the school's <code>school_admins</code> table are authorised.
        </p>
        <div className="settings-account">
          <Mail size={18} aria-hidden="true" />
          <div>
            <strong>Signed-in administrator</strong>
            <span>{user?.email || 'Account email unavailable'}</span>
          </div>
          <span className="tag tag--green"><CheckCircle2 size={12} /> Verified</span>
        </div>
        <p className="acard__sub" style={{ marginTop: '.8rem' }}>
          To change the account password, use the password reset flow for this email in Supabase Auth.
          Never share your password with anyone.
        </p>
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <Database size={17} aria-hidden="true" /> Shared data storage
        </h2>
        <p className="acard__sub">
          Timetables, subjects, date sheets, gallery photographs, events and website announcements
          are synchronized with the school's Supabase database. Uploaded images and PDFs use the
          school-media storage bucket. Public visitors can view published content; write access is
          restricted to authorised school administrators.
        </p>
      </section>
    </div>
  )
}
