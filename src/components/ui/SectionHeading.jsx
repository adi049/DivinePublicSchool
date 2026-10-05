/**
 * Consistent section heading: eyebrow label + title + optional sub-text.
 * `align="center"` centers the block. `id` labels the heading for aria-labelledby.
 */
export default function SectionHeading({ eyebrow, title, sub, align = 'left', id }) {
  return (
    <div className={`sec-head ${align === 'center' ? 'sec-head--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {sub && <p className="sec-head__sub">{sub}</p>}
    </div>
  )
}
