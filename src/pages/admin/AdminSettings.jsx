// ============================================================================
// ADMIN — WEBSITE SETTINGS + SECURITY
// ============================================================================

import { useState } from 'react'
import { Megaphone, Save, ShieldCheck, Database } from 'lucide-react'
import { useToast } from '../../components/admin/Toast.jsx'
import { useSettings } from '../../services/hooks.js'
import { saveSettings } from '../../services/settingsService.js'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

export default function AdminSettings() {
  const toast = useToast()
  const settings = useSettings()
  const { changePin } = useAdminAuth()

  const [enabled, setEnabled] = useState(settings.announcement.enabled)
  const [text, setText] = useState(settings.announcement.text)

  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [pinBusy, setPinBusy] = useState(false)

  const saveAnnouncement = (e) => {
    e.preventDefault()
    if (enabled && !text.trim()) {
      toast.error('Add announcement text or switch the banner off.')
      return
    }
    saveSettings({ announcement: { enabled, text: text.trim() } })
    toast.success(enabled ? 'Announcement is live on the website.' : 'Announcement banner switched off.')
  }

  const handlePin = async (e) => {
    e.preventDefault()
    if (!/^\d{4}$/.test(newPin)) {
      toast.error('The new PIN must be exactly 4 digits.')
      return
    }
    setPinBusy(true)
    const ok = await changePin(currentPin, newPin)
    setPinBusy(false)
    if (ok) {
      toast.success('Admin PIN changed on this device.')
      setCurrentPin('')
      setNewPin('')
    } else {
      toast.error('Current PIN is incorrect.')
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">
          <Megaphone size={17} aria-hidden="true" /> Announcement banner
        </h2>
        <p className="acard__sub">
          Shows a slim banner at the very top of every public page. Use it for open-day dates,
          holiday notices or admission announcements.
        </p>
        <form className="aform" onSubmit={saveAnnouncement}>
          <label className="acheck">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            <span>Show announcement banner on the website</span>
          </label>
          <label className="afield">
            <span>Announcement text</span>
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Parent-Teacher Meeting on 22 November 2026"
              maxLength={140}
            />
          </label>
          <div className="aform__actions">
            <button type="submit" className="btn btn--primary">
              <Save size={15} aria-hidden="true" /> Save settings
            </button>
          </div>
        </form>
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <ShieldCheck size={17} aria-hidden="true" /> Admin sign-in
        </h2>
        <p className="acard__sub">
          Change the 4-digit PIN for this device. This temporary PIN is a screen against casual
          access only — Supabase authentication will replace it before launch.
        </p>
        <form className="aform aform--inline" onSubmit={handlePin}>
          <label className="afield">
            <span>Current PIN</span>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </label>
          <label className="afield">
            <span>New PIN (4 digits)</span>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              required
            />
          </label>
          <div className="aform__actions">
            <button type="submit" className="btn btn--primary" disabled={pinBusy || currentPin.length !== 4 || newPin.length !== 4}>
              {pinBusy ? 'Updating…' : 'Change PIN'}
            </button>
          </div>
        </form>
      </section>

      <section className="acard">
        <h2 className="acard__title">
          <Database size={17} aria-hidden="true" /> Data storage
        </h2>
        <p className="acard__sub">
          Records (timetables, subjects, date sheets, settings) are stored in this browser via
          localStorage, and uploaded photographs/documents in IndexedDB — a temporary layer designed
          so Supabase Database + Storage can replace it without touching the dashboard or public
          pages. Content saved on one device does not sync to other devices yet.
        </p>
      </section>
    </div>
  )
}
