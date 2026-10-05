import { Link } from 'react-router-dom'

/**
 * Unified button component.
 * - `to`   → renders a React Router <Link> (internal navigation)
 * - `href` → renders an <a> (external links, tel:, https://wa.me)
 * - else   → renders a <button>
 *
 * Variants: primary | green | outline | light | ghost-light
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size,
  block = false,
  icon: Icon,
  iconLeft: IconLeft,
  children,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {IconLeft && <IconLeft size={17} strokeWidth={2.2} aria-hidden="true" />}
      <span>{children}</span>
      {Icon && <Icon size={17} strokeWidth={2.2} aria-hidden="true" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  )
}
