// ============================================================================
// SETTINGS SERVICE — small site-wide switches managed from the dashboard
// ============================================================================
// Mirrors a future Supabase `site_settings` row. Kept deliberately small:
//   announcement: { enabled, text } — a royal-theme banner above the navbar.
// ============================================================================

import { loadRecords, saveRecords, nowISO } from './localStore.js'
import { emitContentChanged } from './events.js'

const KEY = 'settings'

const DEFAULTS = {
  announcement: { enabled: false, text: '' },
  updated_at: null,
}

export function getSettings() {
  const stored = loadRecords(KEY, null)
  return stored ? { ...DEFAULTS, ...stored, announcement: { ...DEFAULTS.announcement, ...stored.announcement } } : DEFAULTS
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch, updated_at: nowISO() }
  saveRecords(KEY, next)
  emitContentChanged()
  return next
}
