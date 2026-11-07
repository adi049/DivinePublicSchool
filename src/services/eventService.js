// ============================================================================
// EVENT SERVICE — admin-managed events / announcements + homepage popup
// Supabase Database stores event records; Supabase Storage stores poster files.
// localStorage is used only as a fast browser cache and is hydrated from Supabase.
//
// ============================================================================

import {
  loadRecords,
  saveRecords,
  putFile,
  deleteFile,
  getFileUrl,
  newId,
  nowISO,
} from './localStore.js'
import { emitContentChanged } from './events.js'

const KEY = 'events'
const DISMISS_KEY = 'dps.events.dismissed' // sessionStorage (per browsing session)

export const EVENT_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const EVENT_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
export const EVENT_IMAGE_MAX_MB = 5

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

function readAll() {
  return loadRecords(KEY, [])
}

async function persist(records) {
  // always store normalised + ordered
  const ordered = [...records]
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((r, i) => ({ ...r, display_order: i }))
  await saveRecords(KEY, ordered)
  emitContentChanged()
  return ordered
}

/** Local midnight 'YYYY-MM-DD' — avoids UTC off-by-one near midnight IST. */
export function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// ---------------------------------------------------------------------------
// queries
// ---------------------------------------------------------------------------

/** All events in admin display order (newest ordering is admin-defined). */
export function listEvents() {
  return readAll().sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
}

export function getEvent(id) {
  return readAll().find((e) => e.id === id) || null
}

/** Expired = has an expiry date that is already in the past. */
export function isExpired(ev, today = todayISO()) {
  return Boolean(ev.expiry_date) && ev.expiry_date < today
}

/** Scheduled = has a start date that has not arrived yet. */
export function isScheduled(ev, today = todayISO()) {
  return Boolean(ev.start_date) && ev.start_date > today
}

/** Human-readable state for the admin table. */
export function eventStatus(ev, today = todayISO()) {
  if (!ev.published) return 'draft'
  if (!ev.active) return 'inactive'
  if (isExpired(ev, today)) return 'expired'
  if (isScheduled(ev, today)) return 'scheduled'
  return 'live'
}

/**
 * Events the public website may show right now:
 * published AND active AND started AND not expired — in admin order.
 */
export function listLiveEvents(today = todayISO()) {
  return listEvents().filter(
    (ev) => ev.published && ev.active && !isExpired(ev, today) && !isScheduled(ev, today),
  )
}

/** Resolve a poster to its shared Supabase Storage URL. */
export function eventImageUrl(ev) {
  if (!ev) return Promise.resolve(null)
  if (ev.image_url) return Promise.resolve(ev.image_url)
  return getFileUrl(ev.image_file_id)
}

// ---------------------------------------------------------------------------
// validation
// ---------------------------------------------------------------------------

/** Returns '' when the file is acceptable, otherwise a human message. */
export function validateEventImage(file) {
  if (!file) return 'Please choose an event photograph or poster.'
  const okType =
    EVENT_IMAGE_TYPES.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name || '')
  if (!okType) return 'Only JPG, PNG and WebP images are allowed.'
  if (file.size > EVENT_IMAGE_MAX_MB * 1024 * 1024)
    return `Image is larger than ${EVENT_IMAGE_MAX_MB} MB. Please choose a smaller file.`
  return ''
}

/** Field-level validation for the create/edit form. */
export function validateEvent({ title, start_date, expiry_date, button_text, button_url }) {
  const errors = {}
  if (!String(title || '').trim()) errors.title = 'Event title is required.'
  if (start_date && expiry_date && expiry_date < start_date)
    errors.expiry_date = 'Expiry date cannot be before the start date.'
  if (button_text && !button_url) errors.button_url = 'Add a link for the button, or clear the button text.'
  if (button_url && !/^(https?:\/\/|\/|#|tel:|mailto:)/i.test(button_url.trim()))
    errors.button_url = 'Use a full link (https://…), an in-site link (#/admissions) or tel:/mailto:.'
  return errors
}

// ---------------------------------------------------------------------------
// mutations
// ---------------------------------------------------------------------------

/** Create an event. `file` is the poster (required for the popup to render). */
export async function createEvent({
  title,
  description = '',
  file = null,
  button_text = '',
  button_url = '',
  start_date = '',
  expiry_date = '',
  published = false,
  active = true,
}) {
  let imageFileId = null
  if (file) {
    imageFileId = newId('eventimg')
    await putFile(imageFileId, file)
  }
  const all = readAll()
  const record = {
    id: newId('evt'),
    title: String(title).trim(),
    description: String(description).trim(),
    image_file_id: imageFileId,
    image_url: null, // Storage path is resolved from image_file_id
    button_text: String(button_text).trim(),
    button_url: String(button_url).trim(),
    start_date: start_date || null,
    expiry_date: expiry_date || null,
    published: Boolean(published),
    active: Boolean(active),
    display_order: all.length,
    created_at: nowISO(),
    updated_at: nowISO(),
  }
  await persist([...all, record])
  return record
}

/** Update fields; pass `file` to replace the poster (old blob is removed). */
export async function updateEvent(id, patch = {}, file = null) {
  const all = readAll()
  const existing = all.find((e) => e.id === id)
  if (!existing) return null

  let imageFileId = existing.image_file_id
  if (file) {
    const nextId = newId('eventimg')
    await putFile(nextId, file)
    if (existing.image_file_id) await deleteFile(existing.image_file_id)
    imageFileId = nextId
  }

  const next = {
    ...existing,
    ...patch,
    title: patch.title !== undefined ? String(patch.title).trim() : existing.title,
    description:
      patch.description !== undefined ? String(patch.description).trim() : existing.description,
    button_text:
      patch.button_text !== undefined ? String(patch.button_text).trim() : existing.button_text,
    button_url:
      patch.button_url !== undefined ? String(patch.button_url).trim() : existing.button_url,
    start_date: patch.start_date !== undefined ? patch.start_date || null : existing.start_date,
    expiry_date: patch.expiry_date !== undefined ? patch.expiry_date || null : existing.expiry_date,
    image_file_id: imageFileId,
    updated_at: nowISO(),
  }
  await persist(all.map((e) => (e.id === id ? next : e)))
  return next
}

/** Delete an event and its stored poster. */
export async function deleteEvent(id) {
  const all = readAll()
  const existing = all.find((e) => e.id === id)
  if (!existing) return false
  if (existing.image_file_id) await deleteFile(existing.image_file_id)
  await persist(all.filter((e) => e.id !== id))
  return true
}

export async function setPublished(id, published) {
  const all = readAll()
  await persist(
    all.map((e) => (e.id === id ? { ...e, published: Boolean(published), updated_at: nowISO() } : e)),
  )
}

export async function setActive(id, active) {
  const all = readAll()
  await persist(all.map((e) => (e.id === id ? { ...e, active: Boolean(active), updated_at: nowISO() } : e)))
}

/** Move an event up/down in the popup order. dir = -1 (up) | +1 (down). */
export async function moveEvent(id, dir) {
  const ordered = listEvents()
  const i = ordered.findIndex((e) => e.id === id)
  const j = i + dir
  if (i === -1 || j < 0 || j >= ordered.length) return false
  ;[ordered[i], ordered[j]] = [ordered[j], ordered[i]]
  await persist(ordered.map((e, idx) => ({ ...e, display_order: idx })))
  return true
}

// ---------------------------------------------------------------------------
// session dismissal (popup "don't show again this session")
// ---------------------------------------------------------------------------

export function getDismissedIds() {
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function dismissEvents(ids) {
  try {
    const next = [...new Set([...getDismissedIds(), ...ids])]
    sessionStorage.setItem(DISMISS_KEY, JSON.stringify(next))
  } catch {
    /* private mode — popup simply reappears next load */
  }
}

export function clearDismissed() {
  try {
    sessionStorage.removeItem(DISMISS_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Live events this visitor has not dismissed in the current session.
 * A newly published event (new id) still appears straight away.
 */
export function listPendingPopupEvents(today = todayISO()) {
  const dismissed = getDismissedIds()
  return listLiveEvents(today).filter((ev) => !dismissed.includes(ev.id))
}
