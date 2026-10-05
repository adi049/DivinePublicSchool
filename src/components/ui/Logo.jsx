import { ASSETS } from '../../data/assets.js'

export default function Logo({ size = 46 }) {
  return (
    <img
      src={ASSETS.schoolLogo}
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
