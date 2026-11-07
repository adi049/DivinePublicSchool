import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

/**
 * Confirmation dialog used before destructive admin actions.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="confirm"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="confirm__backdrop" onClick={onCancel} />
          <motion.div
            className="confirm__card"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="confirm__icon">
              <AlertTriangle size={22} aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{message}</p>
            <div className="confirm__actions">
              <button type="button" className="btn btn--outline" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" className="btn btn--danger" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
