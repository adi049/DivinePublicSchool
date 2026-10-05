import { motion } from 'framer-motion'

/**
 * Responsive gallery grid with hover caption overlays.
 * `onOpen(index)` is fired when an item is clicked (to open the lightbox).
 */
export default function GalleryGrid({ images, onOpen }) {
  return (
    <div className="gallery-grid">
      {images.map((img, i) => (
        <motion.button
          key={img.src}
          type="button"
          className="g-item"
          onClick={() => onOpen(i)}
          aria-label={`Open photo — ${img.alt}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
          <span className="g-item__cap">
            <span className="g-item__cat">{img.category}</span>
            {img.caption}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
