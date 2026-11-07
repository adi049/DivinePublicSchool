import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((type, message) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, type, message }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800)
  }, [])

  const value = {
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.type}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              {t.type === 'success' ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : (
                <AlertTriangle size={16} aria-hidden="true" />
              )}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
