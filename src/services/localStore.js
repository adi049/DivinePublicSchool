// Shared persistence adapter: synchronous local cache + Supabase Database/Storage.
// Existing pages keep their current API. Data is hydrated at admin session start,
// and all content mutations are mirrored to Supabase for cross-device publishing.
import {
  supabaseRequest, getStoredSessionToken, schoolMediaUrl,
  uploadSchoolMedia, deleteSchoolMedia,
} from './supabaseClient.js'
import { emitContentChanged } from './events.js'

const LS_PREFIX = 'dps.'
const DB_NAME = 'dps-media'
const DB_VERSION = 1
const FILE_STORE = 'files'
const FILE_MAP_KEY = 'dps.remote.files'
const TABLES = {
  timetables: { table: 'timetables', key: 'id' },
  subjects: { table: 'subjects', key: 'id' },
  date_sheets: { table: 'date_sheets', key: 'id' },
  gallery_photos: { table: 'gallery_photos', key: 'id' },
  gallery_hidden: { table: 'gallery_hidden', key: 'uid' },
  events: { table: 'events', key: 'id' },
  settings: { table: 'site_settings', key: 'id' },
}
const syncQueues = new Map()

export function loadRecords(key, fallback = []) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}
export function hasKey(key) { return localStorage.getItem(LS_PREFIX + key) !== null }
export function removeKey(key) { localStorage.removeItem(LS_PREFIX + key) }

function rowsFor(key, value) {
  if (key === 'gallery_hidden') return (value || []).map(uid => ({ uid, created_at: new Date().toISOString() }))
  if (key === 'settings') return [{ id: 1, announcement: value?.announcement || { enabled: false, text: '' }, updated_at: value?.updated_at || new Date().toISOString() }]
  return (Array.isArray(value) ? value : []).map(row => {
    const next = { ...row }
    if (key === 'timetables' && !next.effective_date) next.effective_date = null
    if (key === 'date_sheets' && !next.publication_date) next.publication_date = null
    return next
  })
}

function mirrorRecords(key, nextRows, previousRows) {
  const config = TABLES[key]
  if (!config) return
  const previous = syncQueues.get(key) || Promise.resolve()
  const task = previous.catch(() => {}).then(async () => {
    const token = getStoredSessionToken()
    if (nextRows.length) {
      await supabaseRequest(`rest/v1/${config.table}?on_conflict=${config.key}`, {
        method: 'POST', token, prefer: 'resolution=merge-duplicates,return=minimal', body: nextRows,
      })
    }
    const nextIds = new Set(nextRows.map(row => String(row[config.key])))
    for (const row of previousRows || []) {
      const id = row?.[config.key]
      if (id !== undefined && !nextIds.has(String(id))) {
        await supabaseRequest(`rest/v1/${config.table}?${config.key}=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE', token, prefer: 'return=minimal',
        })
      }
    }
  })
  syncQueues.set(key, task)
  task.catch(error => console.error(`[Supabase] ${config.table} sync failed:`, error))
}

export function saveRecords(key, value) {
  const oldValue = loadRecords(key, Array.isArray(value) ? [] : null)
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(value))
  mirrorRecords(key, rowsFor(key, value), rowsFor(key, oldValue))
}

let dbPromise = null
function openDB() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(FILE_STORE)) req.result.createObjectStore(FILE_STORE) }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}
function withStore(mode, run) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, mode)
    const result = run(tx.objectStore(FILE_STORE))
    tx.oncomplete = () => resolve(result?.result !== undefined ? result.result : result)
    tx.onerror = () => reject(tx.error)
  }))
}
const urlCache = new Map()
function readFileMap() {
  try { return JSON.parse(localStorage.getItem(FILE_MAP_KEY) || '{}') } catch { return {} }
}
function writeFileMap(map) { localStorage.setItem(FILE_MAP_KEY, JSON.stringify(map)) }

export async function putFile(fileId, blob) {
  // Use the file id itself as the object path so every browser can resolve it
  // without needing a device-local IndexedDB mapping.
  await uploadSchoolMedia(fileId, blob)
  const map = readFileMap(); map[fileId] = fileId; writeFileMap(map)
  urlCache.delete(fileId)
}
export async function getFile(fileId) {
  if (!fileId) return undefined
  return withStore('readonly', store => new Promise((resolve, reject) => {
    const req = store.get(fileId)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }))
}
export async function deleteFile(fileId) {
  if (!fileId) return
  const path = readFileMap()[fileId] || fileId
  await deleteSchoolMedia(path)
  const map = readFileMap(); delete map[fileId]; writeFileMap(map)
  try { await withStore('readwrite', store => store.delete(fileId)) } catch {}
  const cached = urlCache.get(fileId)
  if (cached?.startsWith('blob:')) URL.revokeObjectURL(cached)
  urlCache.delete(fileId)
}
export async function getFileUrl(fileId) {
  if (!fileId) return null
  if (urlCache.has(fileId)) return urlCache.get(fileId)
  const blob = await getFile(fileId).catch(() => null)
  if (blob) {
    const objectUrl = URL.createObjectURL(blob)
    urlCache.set(fileId, objectUrl)
    return objectUrl
  }
  const path = readFileMap()[fileId] || fileId
  const publicUrl = schoolMediaUrl(path)
  urlCache.set(fileId, publicUrl)
  return publicUrl
}

// Load the shared database into the existing synchronous service cache.
// When a table is empty, preserve any records already in this browser rather
// than silently deleting locally stored school content; an authenticated
// administrator can then migrate that cache on the next save.
export async function bootstrapRemoteData() {
  const token = getStoredSessionToken()
  const isSignedIn = token !== (await import('./supabaseClient.js')).SUPABASE_ANON_KEY
  await Promise.all(Object.entries(TABLES).map(async ([key, config]) => {
    try {
      const rows = await supabaseRequest(`rest/v1/${config.table}?select=*`, { token })
      const cached = loadRecords(key, key === 'settings' ? null : [])
      if (rows.length) {
        if (key === 'gallery_hidden') localStorage.setItem(LS_PREFIX + key, JSON.stringify(rows.map(row => row.uid)))
        else if (key === 'settings') localStorage.setItem(LS_PREFIX + key, JSON.stringify({ announcement: rows[0].announcement, updated_at: rows[0].updated_at }))
        else localStorage.setItem(LS_PREFIX + key, JSON.stringify(rows))
      } else if (isSignedIn && cached && (Array.isArray(cached) ? cached.length : true)) {
        mirrorRecords(key, rowsFor(key, cached), [])
      } else if (!hasKey(key) && key !== 'subjects') {
        if (key === 'settings') localStorage.setItem(LS_PREFIX + key, JSON.stringify({ announcement: { enabled: false, text: '' }, updated_at: null }))
        else localStorage.setItem(LS_PREFIX + key, JSON.stringify([]))
      }
    } catch (error) {
      console.warn(`[Supabase] Could not hydrate ${config.table}:`, error.message)
    }
  }))
  emitContentChanged()
}

export function newId(prefix) {
  const rand = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)
  return `${prefix}_${Date.now().toString(36)}_${rand}`
}
export function nowISO() { return new Date().toISOString() }
