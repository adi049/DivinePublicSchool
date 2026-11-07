// Public browser client. This key is publishable; database access is protected by RLS.
export const SUPABASE_URL = 'https://dazrkmpnqrfrofilbeca.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhenJrbXBucXJmcm9maWxiZWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMjU4NzEsImV4cCI6MjEwOTYwMTg3MX0._zzGVKOiYvFAya1VESeoEzNU_3rHKLeZwulDaFc_KNw'

export async function supabaseRequest(path, options = {}) {
  const method = options.method || 'GET'
  const token = options.token || SUPABASE_ANON_KEY
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  }
  if (options.prefer) headers.Prefer = options.prefer
  const response = await fetch(SUPABASE_URL + '/' + path.replace(/^\//, ''), {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const raw = await response.text()
  let data = null
  try { data = raw ? JSON.parse(raw) : null } catch { data = raw }
  if (!response.ok) {
    const message = data?.msg || data?.message || data?.error_description || data?.error || 'Supabase request failed (' + response.status + ')'
    throw new Error(message)
  }
  return data
}


// Public school-media Storage helpers. Upload/delete are protected by the
// storage.objects policies that restrict writes to school_admins.
export function getStoredSessionToken() {
  try {
    const session = JSON.parse(localStorage.getItem('dps.supabase.auth.session') || 'null')
    return session?.access_token || SUPABASE_ANON_KEY
  } catch { return SUPABASE_ANON_KEY }
}

export function schoolMediaUrl(path) {
  if (!path) return null
  return `${SUPABASE_URL}/storage/v1/object/public/school-media/${path.split('/').map(encodeURIComponent).join('/')}`
}

export async function uploadSchoolMedia(path, file) {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/school-media/${path.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${getStoredSessionToken()}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body: file,
  })
  if (!response.ok) {
    let message = `Storage upload failed (${response.status})`
    try { const data = await response.json(); message = data.message || data.error || message } catch {}
    throw new Error(message)
  }
  return schoolMediaUrl(path)
}

export async function deleteSchoolMedia(path) {
  if (!path) return
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/school-media`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${getStoredSessionToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefixes: [path] }),
  })
  if (!response.ok && response.status !== 404) {
    let message = `Storage delete failed (${response.status})`
    try { const data = await response.json(); message = data.message || data.error || message } catch {}
    throw new Error(message)
  }
}
