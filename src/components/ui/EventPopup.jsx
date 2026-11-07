// ============================================================================
// EVENT POPUP — homepage announcement posters published from the Admin panel
// ============================================================================
// Behaviour (as specified by the school):
//   • shows only published + active + in-date events, in admin order
//   • one poster at a time — closing the first reveals the second, and so on
//   • "1 of 3" indicator plus Previous / Next controls when there is a queue
//   • closes on the X button, the Esc key or a click on the dark backdrop
//   • dismissals are remembered for the browsing session (sessionStorage), so
//     a refresh does not restart the same sequence
//   • no active events → nothing renders and the homepage behaves normally
//
// The visitor is never trapped: the close button is always on screen (it sits
// outside the scrollable body on mobile) and Esc always works.
// ============================================================================

import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from 'lucide-react'
import { usePopupEvents } from '../../services/hooks.js'
import { dismissEvents } from '../../services/eventService.js'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Queue state machine. Kept as a pure reducer so queue / index / open can
 * never drift apart — persisting a dismissal is a side effect handled by the
 * caller, never inside here.
 */
const INITIAL = { queue: [], index: 0, open: false }

function popupReducer(state, action) {
  switch (action.type) {
    // New posters arrive (first load, or published while the page is open).
    case 'adopt': {
      const queue = [...state.queue, ...action.events]
      if (state.open) return { ...state, queue }
      return { queue, index: state.queue.length, open: true }
    }
    // Visitor dismissed the current poster: advance, or finish after the last.
    case 'advance':
      return state.index + 1 < state.queue.length
        ? { ...state, index: state.index + 1 }
        : { ...state, open: false }
    case 'prev':
      return { ...state, index: Math.max(0, state.index - 1) }
    case 'next':
      return { ...state, index: Math.min(state.queue.length - 1, state.index + 1) }
    case 'close':
      return { ...state, open: false }
    default:
      return state
  }
}

/** dd Mon yyyy — only used when an event carries dates. */
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EventPopup() {
  // Reactive source: live (published + active + in-date) events this visitor
  // has not already dismissed this session.
  const live = usePopupEvents()

  // The displayed queue is a FROZEN snapshot, deliberately decoupled from
  // `live`. Dismissals are written to sessionStorage immediately, which
  // shrinks `live` straight away — without this snapshot the sequence would
  // collapse mid-view ("1 of 3" turning into "1 of 2") and the indices would
  // slide. Events are only ever ADDED to the snapshot, never removed.
  const [{ queue, index, open }, dispatch] = useReducer(popupReducer, INITIAL)
  const queuedIds = useRef(new Set()) // every id ever placed in the snapshot

  const [ready, setReady] = useState(false) // small delay so the page paints first
  const closeRef = useRef(null)
  const dialogRef = useRef(null)

  // Let the homepage render before the poster appears.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 550)
    return () => window.clearTimeout(t)
  }, [])

  // Adopt any live event not yet queued in this mount. This covers the first
  // load and an event published while the homepage is already open, without
  // ever re-adding something the visitor has dismissed.
  useEffect(() => {
    if (!ready) return
    const fresh = live.filter((ev) => !queuedIds.current.has(ev.id))
    if (fresh.length === 0) return
    fresh.forEach((ev) => queuedIds.current.add(ev.id))
    dispatch({ type: 'adopt', events: fresh })
  }, [ready, live])

  const current = queue[index]

  /**
   * Persist a dismissal the MOMENT the visitor leaves a poster, so a refresh
   * midway through the sequence never replays it. sessionStorage writes are
   * synchronous, and dismissEvents() de-duplicates, so this is idempotent.
   */
  const persistDismissal = useCallback((id) => {
    if (id) dismissEvents([id])
  }, [])

  const closeAll = useCallback(() => {
    persistDismissal(current?.id)
    dispatch({ type: 'close' })
  }, [current, persistDismissal])

  /** X / Esc / backdrop / primary button → next poster, or finish. */
  const dismissCurrent = useCallback(() => {
    persistDismissal(current?.id)
    dispatch({ type: 'advance' })
  }, [current, persistDismissal])

  // Arrow navigation also records the poster being left behind, so every
  // route out of a poster is remembered consistently.
  const goPrev = useCallback(() => {
    persistDismissal(current?.id)
    dispatch({ type: 'prev' })
  }, [current, persistDismissal])

  const goNext = useCallback(() => {
    persistDismissal(current?.id)
    dispatch({ type: 'next' })
  }, [current, persistDismissal])

  // Esc to close + body scroll lock while open
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dismissCurrent()
      } else if (e.key === 'ArrowRight') {
        goNext()
      } else if (e.key === 'ArrowLeft') {
        goPrev()
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dismissCurrent, goNext, goPrev])

  // Move focus to the close button so keyboard users can always get out.
  useEffect(() => {
    if (open) window.setTimeout(() => closeRef.current?.focus(), 80)
  }, [open, index])

  if (!open || !current) return null

  const total = queue.length
  const hasLink = Boolean(current.button_url && current.button_text)
  const external = /^https?:\/\//i.test(current.button_url || '')
  const dateLine = [formatDate(current.start_date), formatDate(current.expiry_date)]
    .filter(Boolean)
    .join(' – ')

  return (
    <AnimatePresence>
      <motion.div
        className="epop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="epop-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
      >
        <div className="epop__backdrop" onClick={dismissCurrent} aria-hidden="true" />

        <motion.div
          className="epop__shell"
          ref={dialogRef}
          initial={{ opacity: 0, y: 26, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          {/* Close button — fixed to the shell so it never scrolls away */}
          <button
            type="button"
            ref={closeRef}
            className="epop__close"
            onClick={dismissCurrent}
            aria-label={
              index + 1 < total ? 'Close this announcement and show the next' : 'Close announcement'
            }
          >
            <X size={20} aria-hidden="true" />
          </button>

          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              className="epop__card"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.26, ease: EASE }}
            >
              {current.imageUrl && (
                <div className="epop__media">
                  <img
                    src={current.imageUrl}
                      alt={current.title ? `${current.title} — event poster` : 'Event poster'}
                      loading="eager"
                      decoding="async"
                  />
                </div>
              )}

              <div className={`epop__body ${current.imageUrl ? '' : 'epop__body--solo'}`}>
                <span className="epop__tag">
                  <CalendarDays size={13} aria-hidden="true" />
                  School Announcement
                </span>
                <h2 id="epop-title" className="epop__title">
                  {current.title}
                </h2>
                {current.description && <p className="epop__text">{current.description}</p>}
                {dateLine && <p className="epop__dates">{dateLine}</p>}

                <div className="epop__actions">
                  {hasLink &&
                    (external ? (
                      <a
                        className="btn btn--primary"
                        href={current.button_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {current.button_text}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    ) : (
                      <a className="btn btn--primary" href={current.button_url} onClick={closeAll}>
                        {current.button_text}
                        <ArrowRight size={15} aria-hidden="true" />
                      </a>
                    ))}
                  <button type="button" className="btn btn--outline" onClick={dismissCurrent}>
                    {index + 1 < total ? 'Next announcement' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Sequence controls — only when more than one poster is queued */}
          {total > 1 && (
            <div className="epop__nav">
              <button
                type="button"
                className="epop__arrow"
                onClick={goPrev}
                disabled={index === 0}
                aria-label="Previous announcement"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>

              <span className="epop__count" aria-live="polite">
                {index + 1} of {total}
              </span>

              <span className="epop__dots" aria-hidden="true">
                {queue.map((ev, i) => (
                  <span key={ev.id} className={`epop__dot ${i === index ? 'is-on' : ''}`} />
                ))}
              </span>

              <button
                type="button"
                className="epop__arrow"
                onClick={goNext}
                disabled={index === total - 1}
                aria-label="Next announcement"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
