import { Link } from 'react-router-dom'

export default function PageHero({ title, description, image, crumb }) {
  const imageUrl = image?.startsWith('/') ? `https://adi049.github.io/DivinePublicSchool/${image.slice(1)}` : image
  return (
    <div className="page-hero">
      <div className="page-hero__bg" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />
      <div className="page-hero__veil" aria-hidden="true" />
      <div className="container page-hero__inner">
        <nav className="page-hero__crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{crumb || title}</span></nav>
        <h1>{title}</h1>
        {description && <p className="page-hero__desc">{description}</p>}
      </div>
    </div>
  )
}
