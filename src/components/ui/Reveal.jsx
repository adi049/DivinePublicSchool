import { motion } from 'framer-motion'

/**
 * Subtle fade-up reveal when a section scrolls into view.
 * Used across pages for consistent, understated animation.
 */
export default function Reveal({ children, delay = 0, y = 22, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
