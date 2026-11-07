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
