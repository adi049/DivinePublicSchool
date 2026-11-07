import { Inbox } from 'lucide-react'

/** Statistic card for the dashboard overview. */
export function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  return (
    <article className={`stat stat--${accent}`}>
      <span className="stat__icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </article>
  )
}

/** Empty state used when a class/stream has no content yet. */
export function EmptyState({ icon: Icon = Inbox, title, text, children }) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}
