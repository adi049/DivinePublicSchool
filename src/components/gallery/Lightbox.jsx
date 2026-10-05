import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Image lightbox with keyboard navigation (Esc / ← / →),
 * previous/next buttons and a caption bar.
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0
  const current = open ? images[index] : null

  const prev = useCallback(() => {
    onNavigate((index - 1 + images.length) % images.length)
  }, [index, images.length, onNavigate])

  const next = useCallback(() => {
    onNavigate((index + 1) % images.length)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, prev, next])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer — ${current.alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="lb__backdrop" onClick={onClose} />

          <button className="lb__btn lb__btn--close" onClick={onClose} aria-label="Close image viewer">
            <X size={20} />
          </button>
          <button className="lb__btn lb__btn--prev" onClick={prev} aria-label="Previous image">
            <ChevronLeft size={22} />
          </button>
          <button className="lb__btn lb__btn--next" onClick={next} aria-label="Next image">
            <ChevronRight size={22} />
          </button>

          <motion.figure
            className="lb__figure"
            key={current.src}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <img className="lb__img" src={current.src} alt={current.alt} />
            <figcaption className="lb__cap">{current.caption}</figcaption>
            <div className="lb__count">
              {index + 1} of {images.length} · {current.category}
            </div>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
