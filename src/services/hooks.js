// ============================================================================
// REACT HOOKS for the service layer
// ============================================================================
// These subscribe to the tiny event bus, so any admin change re-renders the
// public components automatically (replace with Supabase subscriptions later).
// ============================================================================

import { useEffect, useReducer, useState, useCallback } from 'react'
import { subscribe } from './events.js'
import * as timetableService from './timetableService.js'
import * as subjectService from './subjectService.js'
import * as datesheetService from './datesheetService.js'
import * as galleryService from './galleryService.js'
import * as settingsService from './settingsService.js'
import * as eventService from './eventService.js'
import { getFileUrl } from './localStore.js'

/** Re-render trigger whenever any service emits a content change. */
function useContentTick() {
  const [tick, bump] = useReducer((t) => t + 1, 0)
  useEffect(() => subscribe(bump), [])
  return tick
}

/** Public export — re-renders the calling component on any content change. */
export function useContentReady() {
  useContentTick()
}

/** Resolve an async getter with loading state. */
export function useAsync(factory, deps) {
  const [state, setState] = useState({ loading: true, value: null, error: null })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoFactory = useCallback(factory, deps)
  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))
    memoFactory()
      .then((value) => !cancelled && setState({ loading: false, value, error: null }))
      .catch((error) => !cancelled && setState({ loading: false, value: null, error }))
    return () => {
      cancelled = true
    }
  }, [memoFactory])
  return state
}

// ------------------------------------------------------------ timetables
export function useTimetables() {
  useContentTick()
  return timetableService.listTimetables()
}

export function useTimetableRecord(classId, stream) {
  useContentTick()
  return timetableService.getTimetable(classId, stream)
}

/** Published timetable for the public website. */
export function usePublishedTimetable(classId, stream) {
  useContentTick()
  return timetableService.getPublishedTimetable(classId, stream)
}

// ------------------------------------------------------------ subjects
export function useSubjects(classId, stream) {
  useContentTick()
  return subjectService.listSubjects(classId, stream)
}

// ------------------------------------------------------------ date sheets
export function useDateSheets() {
  useContentTick()
  return datesheetService.listDateSheets()
}

export function useDateSheetRecord(classId, stream) {
  useContentTick()
  return datesheetService.getDateSheet(classId, stream)
}

/** Published date sheet for the public website. */
export function usePublishedDateSheet(classId, stream) {
  useContentTick()
  return datesheetService.getPublishedDateSheet(classId, stream)
}

// ------------------------------------------------------------ gallery
export function useGalleryPhotos() {
  useContentTick()
  return galleryService.listAllPhotos()
}

export function usePublicPhotos() {
  useContentTick()
  return galleryService.listPublicPhotos()
}

/**
 * Public gallery photos with display-ready URLs — official photos keep their
 * bundled path, admin-added photos resolve from the local blob store.
 * Returns [{ src, caption, alt, category }] (empty while resolving).
 */
export function useResolvedPhotos() {
  useContentTick()
  const [photos, setPhotos] = useState([])
  useEffect(() => {
    let alive = true
    const list = galleryService.listPublicPhotos()
    Promise.all(list.map((p) => galleryService.photoUrl(p))).then((urls) => {
      if (!alive) return
      setPhotos(
        list
          .map((p, i) => ({ src: urls[i], caption: p.caption, alt: p.alt, category: p.category }))
          .filter((p) => p.src),
      )
    })
    return () => {
      alive = false
    }
    // photos recompute whenever content changes (tick above re-renders;
    // listPublicPhotos re-reads storage each render, so a stable string dep works)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(galleryService.listPublicPhotos().map((p) => p.uid + (p.hidden ? 1 : 0)))])
  return photos
}

// ------------------------------------------------------------ events
/** All events, in admin-defined display order (admin screens). */
export function useEvents() {
  useContentTick()
  return eventService.listEvents()
}

/** Published + active + in-date events (public website). */
export function useLiveEvents() {
  useContentTick()
  return eventService.listLiveEvents()
}

/**
 * Popup queue for the homepage: live events not yet dismissed this session,
 * each resolved to a displayable poster URL. Returns [] while resolving.
 */
export function usePopupEvents() {
  useContentTick()
  const [queue, setQueue] = useState([])
  const pending = eventService.listPendingPopupEvents()
  const signature = pending.map((e) => `${e.id}:${e.updated_at}`).join('|')

  useEffect(() => {
    let alive = true
    const list = eventService.listPendingPopupEvents()
    Promise.all(list.map((ev) => eventService.eventImageUrl(ev))).then((urls) => {
      if (!alive) return
      setQueue(list.map((ev, i) => ({ ...ev, imageUrl: urls[i] })))
    })
    return () => {
      alive = false
    }
  }, [signature])

  return queue
}

// ------------------------------------------------------------ settings
export function useSettings() {
  useContentTick()
  return settingsService.getSettings()
}

// ------------------------------------------------------------ blobs
/** Resolve a stored file id to an object URL (null while loading / missing). */
export function useFileUrl(fileId) {
  const { value } = useAsync(() => getFileUrl(fileId), [fileId])
  return value
}

/** Resolve a gallery photo (official path or stored blob) to a URL. */
export function usePhotoUrl(photo) {
  const { value } = useAsync(() => galleryService.photoUrl(photo), [photo?.uid])
  return value
}
