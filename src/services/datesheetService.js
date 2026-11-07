// ============================================================================
// DATE SHEET SERVICE — examination date sheets (image or PDF)
// ============================================================================
// Record shape (matches the future Supabase `date_sheets` table):
//   id               string
//   class_id         string
//   stream           string|null
//   exam_name        string      — e.g. 'Half-Yearly Examination'
//   academic_session string
//   document_file_id string      — blob key in localStore (→ Storage path later)
//   document_type    'image' | 'pdf'
//   publication_date string      — ISO date
//   published        boolean
//   created_at / updated_at
// ============================================================================

import { loadRecords, saveRecords, putFile, deleteFile, getFileUrl, newId, nowISO } from './localStore.js'
import { comboKey } from './catalogue.js'
import { emitContentChanged } from './events.js'

const KEY = 'date_sheets'

function all() {
  return loadRecords(KEY, [])
}

function persist(records) {
  saveRecords(KEY, records)
  emitContentChanged()
}

export function listDateSheets() {
  return [...all()].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''))
}

export function getDateSheet(classId, stream = null) {
  const key = comboKey(classId, stream)
  return all().find((r) => comboKey(r.class_id, r.stream) === key) || null
}

export function getPublishedDateSheet(classId, stream = null) {
  const rec = getDateSheet(classId, stream)
  return rec && rec.published ? rec : null
}

export function documentTypeOf(file) {
  if (!file) return null
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return 'pdf'
  return 'image'
}

/** Create or replace the date sheet for a class/stream. */
export async function saveDateSheet(input) {
  const records = all()
  const existing = records.find(
    (r) => comboKey(r.class_id, r.stream) === comboKey(input.class_id, input.stream ?? null),
  )

  let fileId = existing?.document_file_id || null
  let docType = existing?.document_type || null
  if (input.file) {
    fileId = newId('ds')
    await putFile(fileId, input.file)
    docType = documentTypeOf(input.file)
    if (existing?.document_file_id && existing.document_file_id !== fileId) {
      await deleteFile(existing.document_file_id)
    }
  }

  const record = {
    id: existing?.id || newId('ds'),
    class_id: input.class_id,
    stream: input.stream ?? null,
    exam_name: (input.exam_name || '').trim(),
    academic_session: (input.academic_session || '').trim(),
    document_file_id: fileId,
    document_type: docType,
    publication_date: input.publication_date || '',
    published: Boolean(input.published),
    created_at: existing?.created_at || nowISO(),
    updated_at: nowISO(),
  }

  const next = existing ? records.map((r) => (r.id === existing.id ? record : r)) : [...records, record]
  persist(next)
  return record
}

export function setDateSheetPublished(id, published) {
  const records = all().map((r) => (r.id === id ? { ...r, published, updated_at: nowISO() } : r))
  persist(records)
}

export async function deleteDateSheet(id) {
  const record = all().find((r) => r.id === id)
  if (record?.document_file_id) await deleteFile(record.document_file_id)
  persist(all().filter((r) => r.id !== id))
}

export function dateSheetDocumentUrl(record) {
  return getFileUrl(record?.document_file_id)
}
