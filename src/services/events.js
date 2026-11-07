// ============================================================================
// EVENTS — tiny pub/sub so public pages refresh when admin content changes
// ============================================================================
// A single 'content-changed' topic is enough for this scale. When Supabase
// Realtime is connected later, its callbacks can simply emit() here.

const listeners = new Set()

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitContentChanged() {
  listeners.forEach((fn) => {
    try {
      fn()
    } catch {
      /* a broken listener must not break the store */
    }
  })
}
