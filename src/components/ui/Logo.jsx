export default function Logo({ size = 46 }) {
  const src = `${import.meta.env.BASE_URL}images/school-logo.png`
  return <img src={src} alt="Divine Public School logo" className="brand__logo" style={{ height: size, width: 'auto' }} width={size} height={size} loading="eager" decoding="async" />
}
