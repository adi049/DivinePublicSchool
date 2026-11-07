import { supabaseRequest, SUPABASE_ANON_KEY } from './supabaseClient.js'

const SESSION_KEY = 'dps.supabase.auth.session'
function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}
function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}
async function refreshIfNeeded(session) {
  if (!session?.refresh_token) return null
  if (session.expires_at && session.expires_at * 1000 > Date.now() + 60000) return session
  const next = await supabaseRequest('auth/v1/token?grant_type=refresh_token', {
    method: 'POST', body: { refresh_token: session.refresh_token }, token: SUPABASE_ANON_KEY,
  })
  const normalized = { ...next, expires_at: next.expires_at || Math.floor(Date.now() / 1000) + (next.expires_in || 3600) }
  saveSession(normalized)
  return normalized
}
async function verifyAdmin(session) {
  const user = await supabaseRequest('auth/v1/user', { token: session.access_token })
  const query = 'rest/v1/school_admins?select=user_id,email&user_id=eq.' + encodeURIComponent(user.id) + '&limit=1'
  const rows = await supabaseRequest(query, { token: session.access_token })
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('This account is not authorised as a school administrator.')
  return user
}
export async function loginWithPassword(email, password) {
  const session = await supabaseRequest('auth/v1/token?grant_type=password', {
    method: 'POST', body: { email: email.trim().toLowerCase(), password }, token: SUPABASE_ANON_KEY,
  })
  const normalized = { ...session, expires_at: session.expires_at || Math.floor(Date.now() / 1000) + (session.expires_in || 3600) }
  try {
    const user = await verifyAdmin(normalized)
    saveSession(normalized)
    return user
  } catch (error) {
    try { await supabaseRequest('auth/v1/logout', { method: 'POST', token: normalized.access_token }) } catch {}
    throw error
  }
}
export async function getCurrentAdmin() {
  let session = readSession()
  if (!session) return null
  try {
    session = await refreshIfNeeded(session)
    if (!session) { saveSession(null); return null }
    return await verifyAdmin(session)
  } catch {
    saveSession(null)
    return null
  }
}
export async function logout() {
  const session = readSession()
  saveSession(null)
  if (session?.access_token) {
    try { await supabaseRequest('auth/v1/logout', { method: 'POST', token: session.access_token }) } catch {}
  }
}
