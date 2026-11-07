import { useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import PageHero from '../components/ui/PageHero.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import GalleryGrid from '../components/gallery/GalleryGrid.jsx'
import Lightbox from '../components/gallery/Lightbox.jsx'
import { GALLERY_CATEGORIES } from '../data/gallery.js'
import { useResolvedPhotos } from '../services/hooks.js'

export default function Gallery() {
  useSEO({ page: 'gallery' })

  const [category, setCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Official photographs + photographs added from the admin dashboard
  const photos = useResolvedPhotos()

  const filtered = useMemo(
    () =>
      category === 'All'
        ? photos
        : photos.filter((img) => img.category === category),
    [category, photos],
  )

  const selectCategory = (cat) => {
    setCategory(cat)
    setLightboxIndex(null)
  }

  return (
    <>
      <PageHero
        title="School Gallery"
        description="Moments from our campus — classrooms, events, sports, cultural programmes and everyday school life."
        image="/images/gallery/janmashtami-classroom.jpg"
        crumb="Gallery"
      />

      <section className="section" aria-label="Photo gallery">
        <div className="container">
          <Reveal>
            {/* Category filters */}
            <div className="filter-row" role="group" aria-label="Filter photographs by category">
              {['All', ...GALLERY_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-btn ${category === cat ? 'is-active' : ''}`}
                  onClick={() => selectCategory(cat)}
                  aria-pressed={category === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="gallery-count" aria-live="polite">
              {filtered.length > 0
                ? `Showing ${filtered.length} photograph${filtered.length === 1 ? '' : 's'}${
                    category === 'All' ? '' : ` in ${category}`
                  }`
                : ''}
            </p>
          </Reveal>

          {filtered.length > 0 ? (
            <GalleryGrid images={filtered} onOpen={(i) => setLightboxIndex(i)} />
          ) : (
            <div className="gallery-empty">
              <ImageOff
                size={28}
                aria-hidden="true"
                style={{ margin: '0 auto 0.6rem', color: 'var(--muted)' }}
              />
              Photographs for <strong>{category}</strong> will be added by the school soon. Please
              explore the other categories.
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
