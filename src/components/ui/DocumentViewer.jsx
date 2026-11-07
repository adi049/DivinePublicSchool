// ============================================================================
// DOCUMENT VIEWER — displays uploaded timetable / date-sheet files
// ============================================================================
// Images: zoom in/out, reset, fullscreen, drag-to-pan, mouse-wheel zoom,
//         download. Touch friendly (large controls, pan with one finger).
// PDFs:   embedded preview with "open in new tab" + download buttons.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  ExternalLink,
  FileText,
  Move,
} from 'lucide-react'

const MIN_SCALE = 0.5
const MAX_SCALE = 5
const STEP = 0.35

async function downloadUrl(url, filename) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(url, '_blank', 'noopener')
  }
}

export default function DocumentViewer({ url, type = 'image', title, downloadName = 'document' }) {
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 })

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  // Reset whenever the document changes
  useEffect(reset, [url])

  // Track native fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2)))
  const zoomOut = () =>
    setScale((s) => {
      const next = Math.max(MIN_SCALE, +(s - STEP).toFixed(2))
      if (next === 1) setOffset({ x: 0, y: 0 })
      return next
    })

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await frameRef.current?.requestFullscreen()
    } catch {
      /* fullscreen not permitted (e.g. iframe sandbox) — viewer still works inline */
    }
  }

  // --- pan (pointer events cover mouse + touch) ---------------------------
  const onPointerDown = (e) => {
    if (scale <= 1) return
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    })
  }
  const stopDrag = () => setDragging(false)

  // --- wheel zoom (attached natively so preventDefault is allowed) --------
  useEffect(() => {
    const el = frameRef.current
    if (!el) return undefined
    const onWheel = (e) => {
      e.preventDefault()
      if (e.deltaY < 0) setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2)))
      else
        setScale((s) => {
          const next = Math.max(MIN_SCALE, +(s - STEP).toFixed(2))
          if (next === 1) setOffset({ x: 0, y: 0 })
          return next
        })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [type])

  if (!url) return null

  /* ------------------------------------------------------------- PDF mode */
  if (type === 'pdf') {
    return (
      <div className="docview">
        <div className="docview__bar" role="toolbar" aria-label="Document actions">
          <span className="docview__title">
            <FileText size={15} aria-hidden="true" /> {title}
          </span>
          <span className="docview__actions">
            <a className="docview__btn" href={url} target="_blank" rel="noreferrer">
              <ExternalLink size={15} aria-hidden="true" /> Open
            </a>
            <button
              type="button"
              className="docview__btn"
              onClick={() => downloadUrl(url, `${downloadName}.pdf`)}
            >
              <Download size={15} aria-hidden="true" /> Download
            </button>
          </span>
        </div>
        <iframe className="docview__pdf" src={url} title={title} />
      </div>
    )
  }

  /* ----------------------------------------------------------- image mode */
  return (
    <div className="docview">
      <div className="docview__bar" role="toolbar" aria-label="Image viewer actions">
        <span className="docview__title">
          <Move size={15} aria-hidden="true" /> {title}
        </span>
        <span className="docview__actions">
          <button type="button" className="docview__btn" onClick={zoomOut} disabled={scale <= MIN_SCALE} aria-label="Zoom out">
            <ZoomOut size={15} aria-hidden="true" />
            <span className="docview__btn-label">Zoom out</span>
          </button>
          <span className="docview__zoom" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button type="button" className="docview__btn" onClick={zoomIn} disabled={scale >= MAX_SCALE} aria-label="Zoom in">
            <ZoomIn size={15} aria-hidden="true" />
            <span className="docview__btn-label">Zoom in</span>
          </button>
          <button type="button" className="docview__btn" onClick={reset} aria-label="Reset zoom">
            <RefreshCw size={15} aria-hidden="true" />
            <span className="docview__btn-label">Reset</span>
          </button>
          <button type="button" className="docview__btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            {isFullscreen ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
            <span className="docview__btn-label">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
          <button
            type="button"
            className="docview__btn"
            onClick={() => downloadUrl(url, downloadName)}
            aria-label="Download image"
          >
            <Download size={15} aria-hidden="true" />
            <span className="docview__btn-label">Download</span>
          </button>
        </span>
      </div>

      <div
        ref={frameRef}
        className={`docview__stage ${scale > 1 ? 'is-zoomed' : ''} ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
      >
        <img
          ref={imgRef}
            src={url}
            alt={title}
            className="docview__img"
            loading="lazy"
            decoding="async"
          draggable={false}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        />
      </div>
      <p className="docview__hint">Use the toolbar to zoom, or drag the image when zoomed in.</p>
    </div>
  )
}
