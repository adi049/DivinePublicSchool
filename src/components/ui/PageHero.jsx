import { Link } from 'react-router-dom'

/**
 * Inner-page banner with background image, title, description and breadcrumb.
 */
export default function PageHero({ title, description, image, crumb }) {
  return (
    <div className="page-hero">
      <div className="page-hero__bg" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
      <div className="page-hero__veil" aria-hidden="true" />
      <div className="container page-hero__inner">
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{crumb || title}</span>
        </nav>
        <h1>{title}</h1>
        {description && <p className="page-hero__desc">{description}</p>}
      </div>
    </div>
  )
}
