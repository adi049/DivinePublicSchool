/**
 * Official Divine Public School logo.
 * Source: /public/images/school-logo.png (provided by the school).
 * Rendered with width:auto so the aspect ratio is never distorted.
 */
export default function Logo({ size = 46 }) {
  return (
    <img
      src="/images/school-logo.png"
      alt="Divine Public School logo"
      className="brand__logo"
      style={{ height: size, width: 'auto' }}
      width={size}
      height={size}
      loading="eager"
      decoding="async"
    />
  )
}
