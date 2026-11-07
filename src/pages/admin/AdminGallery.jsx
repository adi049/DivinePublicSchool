// ============================================================================
// ADMIN — GALLERY MANAGEMENT
// ============================================================================
// Official site photographs are protected (can be hidden, not deleted).
// Admin-added photographs live in local storage and can be added, hidden
// and deleted. Changes reach the public Gallery instantly.
// ============================================================================

import { useEffect, useState } from 'react'
import { Images, Eye, EyeOff, Trash2, Plus, Lock } from 'lucide-react'
import UploadField from '../../components/admin/UploadField.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import { useToast } from '../../components/admin/Toast.jsx'
import { addPhoto, deletePhoto, setPhotoHidden, photoUrl } from '../../services/galleryService.js'
import { useGalleryPhotos } from '../../services/hooks.js'
import { GALLERY_CATEGORIES } from '../../data/gallery.js'

function PhotoCard({ photo, onToggle, onDelete }) {
  const [url, setUrl] = useState(photo.src || null)
  useEffect(() => {
    let alive = true
    if (!photo.src) photoUrl(photo).then((u) => alive && setUrl(u))
    return () => {
      alive = false
    }
  }, [photo])

  return (
    <figure className={`gphoto ${photo.hidden ? 'is-hidden' : ''}`}>
      <div className="gphoto__img">{url && <img src={url} alt={photo.alt} loading="lazy" />}</div>
      <figcaption className="gphoto__meta">
        <span className="gphoto__cap">{photo.caption}</span>
        <span className="gphoto__tags">
          <span className="tag tag--silver">{photo.category}</span>
          {photo.source === 'official' && (
            <span className="tag tag--green" title="Bundled with the website — cannot be deleted">
              <Lock size={10} aria-hidden="true" /> Official
            </span>
          )}
        </span>
        <span className="gphoto__actions">
          <button
            type="button"
            className="btn btn--outline btn--xs"
            onClick={() => onToggle(photo)}
            aria-label={photo.hidden ? 'Show photo' : 'Hide photo'}
          >
            {photo.hidden ? <Eye size={13} aria-hidden="true" /> : <EyeOff size={13} aria-hidden="true" />}
            {photo.hidden ? 'Show' : 'Hide'}
          </button>
          {photo.source === 'admin' && (
            <button
              type="button"
              className="btn btn--danger btn--xs"
              onClick={() => onDelete(photo)}
              aria-label={`Delete ${photo.caption}`}
            >
              <Trash2 size={13} aria-hidden="true" /> Delete
            </button>
          )}
        </span>
      </figcaption>
    </figure>
  )
}

export default function AdminGallery() {
  const toast = useToast()
  const photos = useGalleryPhotos()
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState(GALLERY_CATEGORIES[0])
  const [saving, setSaving] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)

  const canAdd = Boolean(file && caption.trim())

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!canAdd || saving) return
    setSaving(true)
    try {
      await addPhoto({ file, caption, category })
      toast.success('Photograph added to the gallery.')
      setFile(null)
      setCaption('')
    } catch {
      toast.error('Could not add the photograph. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (photo) => {
    setPhotoHidden(photo.uid, !photo.hidden)
    toast.success(photo.hidden ? 'Photograph visible again.' : 'Photograph hidden from the public gallery.')
  }

  const handleDelete = async () => {
    const photo = confirmDel
    setConfirmDel(null)
    try {
      const ok = await deletePhoto(photo.uid)
      toast.success(ok ? 'Photograph deleted.' : 'Official photographs cannot be deleted.')
    } catch {
      toast.error('Could not delete the photograph.')
    }
  }

  return (
    <div className="stack">
      <section className="acard">
        <h2 className="acard__title">
          <Images size={17} aria-hidden="true" /> Add a photograph
        </h2>
        <p className="acard__sub">
          New photographs appear on the public Gallery page and the home-page preview as soon as they
          are saved.
        </p>
        <form className="aform" onSubmit={handleAdd}>
          <div className="aform__grid">
            <UploadField accept="image/*" file={file} onFile={setFile} label="Choose photograph" />
            <div className="aform__fields">
              <label className="afield">
                <span>Caption</span>
                <input
                  className="input"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Annual Sports Day 2026"
                  required
                />
              </label>
              <label className="afield">
                <span>Category</span>
                <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="aform__actions">
            <button type="submit" className="btn btn--green" disabled={!canAdd || saving}>
              <Plus size={15} aria-hidden="true" />
              {saving ? 'Saving…' : 'Add to gallery'}
            </button>
          </div>
        </form>
      </section>

      <section className="acard">
        <h2 className="acard__title">All photographs ({photos.length})</h2>
        <p className="acard__sub">
          Official school photographs are protected — they can be hidden but not deleted.
        </p>
        <div className="gphoto-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.uid} photo={photo} onToggle={handleToggle} onDelete={setConfirmDel} />
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(confirmDel)}
        title="Delete this photograph?"
        message={`“${confirmDel?.caption}” will be deleted from the gallery and its file removed.`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
