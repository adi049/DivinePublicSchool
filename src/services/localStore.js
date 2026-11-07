// ============================================================================
// LOCAL STORE — temporary persistence layer
// ============================================================================
// Hybrid browser storage used ONLY until Supabase is connected:
//   • JSON records (timetables, subjects, date sheets, settings) → localStorage
//   • Uploaded binary files (timetable photos, date-sheet PDFs…) → IndexedDB
//
// Everything goes through the functions below, so swapping this module for a
// Supabase-backed implementation requires touching only this file (the service
// modules above it already think in terms of async file put/get/delete and
// record CRUD).
//
// ⚠️  Data is stored in THIS browser only — it is not shared across devices.
// ============================================================================

const LS_PREFIX = 'dps.'
const DB_NAME = 'dps-media'
const DB_VERSION = 1
const FILE_STORE = 'files'

// ---------------------------------------------------------------------------
// JSON records (localStorage)
// ---------------------------------------------------------------------------

/** Load a JSON record array. Returns `fallback` when nothing is stored. */
export function loadRecords(key, fallback = []) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Persist a JSON record array. */
export function saveRecords(key, records) {
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(records))
}

/** True when the key has ever been written (distinguishes "empty" from "uninitialised"). */
export function hasKey(key) {
  return localStorage.getItem(LS_PREFIX + key) !== null
}

export function removeKey(key) {
  localStorage.removeItem(LS_PREFIX + key)
}

// ---------------------------------------------------------------------------
// Binary files (IndexedDB) + object-URL cache
// ---------------------------------------------------------------------------

let dbPromise = null

function openDB() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(FILE_STORE)) {
        req.result.createObjectStore(FILE_STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function withStore(mode, run) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(FILE_STORE, mode)
        const result = run(tx.objectStore(FILE_STORE))
        tx.oncomplete = () => resolve(result?.result !== undefined ? result.result : result)
        tx.onerror = () => reject(tx.error)
      }),
  )
}

/** Store a File/Blob under `fileId`. */
export async function putFile(fileId, blob) {
  await withStore('readwrite', (store) => store.put(blob, fileId))
  urlCache.delete(fileId) // force fresh object URL next time
}

/** Retrieve a stored Blob (or undefined). */
export async function getFile(fileId) {
  if (!fileId) return undefined
  return withStore('readonly', (store) => new Promise((resolve, reject) => {
    const req = store.get(fileId)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }))
}

/** Delete a stored Blob and revoke any cached object URL. */
export async function deleteFile(fileId) {
  if (!fileId) return
  await withStore('readwrite', (store) => store.delete(fileId))
  const cached = urlCache.get(fileId)
  if (cached) {
    URL.revokeObjectURL(cached)
    urlCache.delete(fileId)
  }
}

// Object-URL cache so the same file renders instantly across the session
const urlCache = new Map()

/**
 * Resolve a stored file id to a usable object URL.
 * Returns null when the file does not exist (safe for <img src>).
 */
export async function getFileUrl(fileId) {
  if (!fileId) return null
  if (urlCache.has(fileId)) return urlCache.get(fileId)
  const blob = await getFile(fileId)
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  urlCache.set(fileId, url)
  return url
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export function newId(prefix) {
  const rand =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}_${rand}`
}

export function nowISO() {
  return new Date().toISOString()
}
