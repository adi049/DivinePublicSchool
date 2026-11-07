// ============================================================================
// UPLOAD FIELD — styled file input with client-side validation + progress
// ============================================================================
// Reading + storing are local and fast; the progress bar reflects the actual
// FileReader progress so admins get honest feedback on larger files.
// ============================================================================

import { useRef, useState } from 'react'
import { UploadCloud, FileCheck2 } from 'lucide-react'

const MAX_MB = 8

export default function UploadField({ accept, file, onFile, hint = 'JPG / PNG image', label = 'Upload file' }) {
  const inputRef = useRef(null)
  const [progress, setProgress] = useState(null) // null | 0..100
  const [error, setError] = useState('')

  const validate = (f) => {
    if (f.size > MAX_MB * 1024 * 1024) return `File is larger than ${MAX_MB} MB. Please choose a smaller file.`
    if (accept.includes('image') && accept.includes('pdf')) {
      if (!/^image\//.test(f.type) && f.type !== 'application/pdf') return 'Please choose an image or a PDF file.'
    } else if (accept.includes('image') && !/^image\//.test(f.type)) {
      return 'Please choose an image file (JPG/PNG).'
    }
    return ''
  }

  const read = (f) => {
    const problem = validate(f)
    if (problem) {
      setError(problem)
      onFile(null)
      return
    }
    setError('')
    setProgress(0)
    const reader = new FileReader()
    reader.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 90))
    }
    reader.onload = () => {
      setProgress(100)
      window.setTimeout(() => setProgress(null), 600)
    }
    reader.onerror = () => {
      setError('Could not read the file. Please try again.')
      setProgress(null)
    }
    reader.readAsArrayBuffer(f) // progress feedback; the File itself is stored
    onFile(f)
  }

  return (
    <div className="upload">
      <button
        type="button"
        className={`upload__drop ${error ? 'is-invalid' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        {file ? <FileCheck2 size={20} aria-hidden="true" /> : <UploadCloud size={20} aria-hidden="true" />}
        <span className="upload__main">{file ? file.name : label}</span>
        <span className="upload__sub">
          {file ? `${(file.size / 1024).toFixed(0)} KB — click to choose a different file` : `${hint}, up to ${MAX_MB} MB`}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="visually-hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = '' // allow re-selecting the same file
          if (f) read(f)
        }}
      />
      {progress !== null && (
        <div className="upload__progress" aria-hidden={progress === 100}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && (
        <p className="upload__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
