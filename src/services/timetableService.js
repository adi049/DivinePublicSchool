// ============================================================================
// TIMETABLE SERVICE — CRUD over class timetables (photo-based)
// ============================================================================
// Record shape matches the Supabase `timetables` table:
//   id              string
//   class_id        string   — from catalogue.CLASS_LIST
//   stream          string|null — 'science' | 'commerce' | 'arts'
//   title           string
//   image_file_id   string   — object path in the Supabase Storage bucket
//   academic_session string  — e.g. '2026–27'
//   effective_date  string   — ISO date the timetable applies from / was last updated for
//   published       boolean
//   created_at      ISO timestamp
//   updated_at      ISO timestamp
// ============================================================================

import { loadRecords, saveRecords, putFile, deleteFile, getFileUrl, newId, nowISO } from './localStore.js'
import { comboKey } from './catalogue.js'
import { emitContentChanged } from './events.js'

const KEY = 'timetables'

function all() {
  return loadRecords(KEY, [])
}

async function persist(records) {
  await saveRecords(KEY, records)
  emitContentChanged()
}

/** All timetable records, newest first. */
export function listTimetables() {
  return [...all()].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
}

/** The record for a class (and stream, when applicable) — one per combo. */
export function getTimetable(classId, stream = null) {
  const key = comboKey(classId, stream)
  return all().find((r) => comboKey(r.class_id, r.stream) === key) || null
}

/** The published record for the public website (or null). */
export function getPublishedTimetable(classId, stream = null) {
  const rec = getTimetable(classId, stream)
  return rec && rec.published ? rec : null
}

/**
 * Create or replace the timetable for a class/stream.
 * @param {object} input { class_id, stream, title, academic_session, effective_date, published, file (File|Blob|null) }
 */
export async function saveTimetable(input) {
  const records = all()
  const existing = records.find(
    (r) => comboKey(r.class_id, r.stream) === comboKey(input.class_id, input.stream ?? null),
  )

  let imageFileId = existing?.image_file_id || null
  if (input.file) {
    imageFileId = newId('tt')
    await putFile(imageFileId, input.file)
    if (existing?.image_file_id && existing.image_file_id !== imageFileId) {
      await deleteFile(existing.image_file_id)
    }
  }

  const record = {
    id: existing?.id || newId('tt'),
    class_id: input.class_id,
    stream: input.stream ?? null,
    title: (input.title || '').trim(),
    image_file_id: imageFileId,
    academic_session: (input.academic_session || '').trim(),
    effective_date: input.effective_date || '',
    published: Boolean(input.published),
    created_at: existing?.created_at || nowISO(),
    updated_at: nowISO(),
  }

  const next = existing ? records.map((r) => (r.id === existing.id ? record : r)) : [...records, record]
  await persist(next)
  return record
}

/** Toggle publish state without touching the image. */
export async function setTimetablePublished(id, published) {
  const records = all().map((r) => (r.id === id ? { ...r, published, updated_at: nowISO() } : r))
  await persist(records)
}

/** Delete a timetable and its stored photo. */
export async function deleteTimetable(id) {
  const record = all().find((r) => r.id === id)
  if (record?.image_file_id) await deleteFile(record.image_file_id)
  await persist(all().filter((r) => r.id !== id))
}

/** Resolve a record's stored photo to a displayable object URL. */
export function timetableImageUrl(record) {
  return getFileUrl(record?.image_file_id)
}
