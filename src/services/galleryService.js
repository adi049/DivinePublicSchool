// ============================================================================
// GALLERY SERVICE — official photos (bundled) + admin-added photos
// ============================================================================
// • Official photographs bundled with the site are NEVER deletable from the
//   admin panel — they can only be hidden (the school asked that existing
//   photos stay intact).
// • Admin-added photos and their metadata are stored in Supabase Storage/Database.
// • localStorage is only a browser cache synchronized with Supabase.
// ============================================================================

import { loadRecords, saveRecords, hasKey, putFile, deleteFile, getFileUrl, newId, nowISO } from './localStore.js'
import { GALLERY_IMAGES } from '../data/gallery.js'
import { emitContentChanged } from './events.js'

const KEY = 'gallery_photos' // admin-added photo records
const HIDDEN_KEY = 'gallery_hidden' // ids of hidden photos (official + added)

function added() {
  return loadRecords(KEY, [])
}

function hiddenIds() {
  return hasKey(HIDDEN_KEY) ? loadRecords(HIDDEN_KEY, []) : []
}

async function persist(records, hidden) {
  // Wait for both Supabase writes so the UI never reports success before the
  // shared database confirms the photo metadata and visibility state.
  await Promise.all([saveRecords(KEY, records), saveRecords(HIDDEN_KEY, hidden)])
  emitContentChanged()
}

/**
 * Unified photo list for admin screens.
 * Each item: { uid, source: 'official'|'admin', src?, file_id?, caption, alt, category, hidden, recordId? }
 */
export function listAllPhotos() {
  const hidden = hiddenIds()
  const official = GALLERY_IMAGES.map((img, i) => ({
    uid: `official-${i}`,
    source: 'official',
    src: img.src,
    caption: img.caption,
    alt: img.alt,
    category: img.category,
    hidden: hidden.includes(`official-${i}`),
  }))
  const custom = added().map((r) => ({
    uid: r.id,
    source: 'admin',
    recordId: r.id,
    file_id: r.image_file_id,
    caption: r.caption,
    alt: r.alt || r.caption,
    category: r.category,
    created_at: r.created_at,
    hidden: hidden.includes(r.id),
  }))
  return [...official, ...custom]
}

/** Photos for the public website (visible only). */
export function listPublicPhotos() {
  return listAllPhotos().filter((p) => !p.hidden)
}

/** Add a new photograph (file + caption + category). */
export async function addPhoto({ file, caption, category }) {
  const fileId = newId('photo')
  await putFile(fileId, file)
  const record = {
    id: newId('gal'),
    image_file_id: fileId,
    caption: (caption || '').trim(),
    alt: (caption || '').trim(),
    category,
    created_at: nowISO(),
    updated_at: nowISO(),
    hidden: false,
  }
  await persist([...added(), record], hiddenIds())
  return record
}

/** Hide or show any photo (official photos can be hidden, not deleted). */
export async function setPhotoHidden(uid, hidden) {
  const list = hiddenIds()
  const next = hidden ? [...new Set([...list, uid])] : list.filter((id) => id !== uid)
  await persist(added(), next)
}

/** Delete an admin-added photo and its file. Official photos cannot be deleted. */
export async function deletePhoto(uid) {
  const record = added().find((r) => r.id === uid)
  if (!record) return false // official photo ids aren't deletable
  await deleteFile(record.image_file_id)
  await persist(
    added().filter((r) => r.id !== uid),
    hiddenIds().filter((id) => id !== uid),
  )
  return true
}

export function photoUrl(photo) {
  return photo.src ? Promise.resolve(photo.src) : getFileUrl(photo.file_id)
}
