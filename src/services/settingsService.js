// ============================================================================
// SETTINGS SERVICE — small site-wide switches managed from the dashboard
// ============================================================================
// Persists the announcement in Supabase `site_settings`; localStorage is a cache.
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

export async function saveSettings(patch) {
  const next = { ...getSettings(), ...patch, updated_at: nowISO() }
  await saveRecords(KEY, next)
  emitContentChanged()
  return next
}
