// ============================================================================
// SUBJECT SERVICE — per-class (and per-stream) subject lists
// ============================================================================
// Record shape (matches the future Supabase `subjects` table):
//   id             string
//   class_id       string
//   stream         string|null
//   subject_name   string
//   display_order  number
//   created_at / updated_at  ISO timestamps
//
// On first run the lists are seeded from src/data/curriculum.js (the lists
// already shown on the website) so the school starts from familiar content
// and can edit freely afterwards.
// ============================================================================

import { loadRecords, saveRecords, hasKey, newId, nowISO } from './localStore.js'
import { comboKey, needsStream } from './catalogue.js'
import { CLASSES, STREAMS } from '../data/curriculum.js'
import { emitContentChanged } from './events.js'

const KEY = 'subjects'
const CURR_TO_CATALOG = { lkg: 'kg', ukg: 'ekg' } // legacy id mapping (kept for safety)
const STREAM_ID_MAP = { humanities: 'arts' }

function all() {
  return loadRecords(KEY, [])
}

async function persist(records) {
  await saveRecords(KEY, records)
  emitContentChanged()
}

function seedIfNeeded() {
  if (hasKey(KEY)) return
  const seeded = []
  for (const cls of CLASSES) {
    const classId = CURR_TO_CATALOG[cls.id] || cls.id
    if (needsStream(classId)) {
      for (const [streamId, stream] of Object.entries(STREAMS)) {
        stream.subjects.forEach((name, i) =>
          seeded.push({
            id: newId('sub'),
            class_id: classId,
            stream: STREAM_ID_MAP[streamId] || streamId,
            subject_name: name,
            display_order: i,
            created_at: nowISO(),
            updated_at: nowISO(),
          }),
        )
      }
    } else {
      ;(cls.subjects || []).forEach((name, i) =>
        seeded.push({
          id: newId('sub'),
          class_id: classId,
          stream: null,
          subject_name: name,
          display_order: i,
          created_at: nowISO(),
          updated_at: nowISO(),
        }),
      )
    }
  }
  saveRecords(KEY, seeded)
}

/** Ordered subject records for a class/stream. */
export function listSubjects(classId, stream = null) {
  seedIfNeeded()
  const key = comboKey(classId, stream)
  return all()
    .filter((r) => comboKey(r.class_id, r.stream) === key)
    .sort((a, b) => a.display_order - b.display_order)
}

/** Just the names, in display order (handy for the public page). */
export function listSubjectNames(classId, stream = null) {
  return listSubjects(classId, stream).map((r) => r.subject_name)
}

/**
 * Replace the full subject list for a class/stream with ordered names.
 * (Simplest reliable way to apply the admin's add/edit/reorder/delete edits.)
 */
export async function replaceSubjects(classId, stream, names) {
  seedIfNeeded()
  const key = comboKey(classId, stream)
  const kept = all().filter((r) => comboKey(r.class_id, r.stream) !== key)
  const clean = names.map((n) => n.trim()).filter(Boolean)
  const added = clean.map((name, i) => ({
    id: newId('sub'),
    class_id: classId,
    stream: stream ?? null,
    subject_name: name,
    display_order: i,
    created_at: nowISO(),
    updated_at: nowISO(),
  }))
  await persist([...kept, ...added])
}

/** Deduplicated count helpers for the dashboard. */
export function countSubjects() {
  seedIfNeeded()
  return all().length
}

export function classesConfigured() {
  seedIfNeeded()
  return new Set(all().map((r) => r.class_id)).size
}

/** Recent subject edits for the dashboard "recently updated" list. */
export function recentSubjectRecords(limit = 5) {
  return [...all()]
    .sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
    .slice(0, limit)
}
