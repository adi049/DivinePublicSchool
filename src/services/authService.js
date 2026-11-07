// ============================================================================
// AUTH SERVICE — TEMPORARY LOCAL AUTH (to be replaced with Supabase Auth)
// ============================================================================
// ⚠️  SECURITY NOTICE — READ BEFORE SHIPPING
// This is a deliberate *placeholder* built on browser storage:
//   • On first use the administrator CHOOSES a 4-digit PIN (nothing is
//     hardcoded in the source code).
//   • The PIN is stored as a salted SHA-256 hash in localStorage and the
//     signed-in state lives in sessionStorage (per tab).
//   • This gate only deters casual access on this device. It is NOT real
//     security: anyone with access to the browser/devtools can bypass it.
// Replace `verifyPin` / `setupPin` / `logout` with Supabase Auth
// (email/password + role claim) before production use. The Admin UI only
// talks to the four functions exported below, so the swap is contained here.
// ============================================================================

// Keys share the same "dps." namespace as the rest of the local data layer.
const PIN_HASH_KEY = 'dps.admin.pinHash'
const PIN_SALT_KEY = 'dps.admin.pinSalt'
const SESSION_KEY = 'dps.admin.session'

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** True after the administrator has created a PIN on this device. */
export function isPinSet() {
  return Boolean(localStorage.getItem(PIN_HASH_KEY))
}

/** Create the admin PIN (first-run) — pin must be exactly 4 digits. */
export async function setupPin(pin) {
  if (!/^\d{4}$/.test(pin)) throw new Error('PIN must be exactly 4 digits.')
  const salt = randomSalt()
  const hash = await sha256(`${salt}:${pin}`)
  localStorage.setItem(PIN_SALT_KEY, salt)
  localStorage.setItem(PIN_HASH_KEY, hash)
  sessionStorage.setItem(SESSION_KEY, '1')
}

/** Verify a PIN. On success, marks this browser tab as authenticated. */
export async function verifyPin(pin) {
  const salt = localStorage.getItem(PIN_SALT_KEY)
  const stored = localStorage.getItem(PIN_HASH_KEY)
  if (!salt || !stored) return false
  const hash = await sha256(`${salt}:${pin}`)
  if (hash === stored) {
    sessionStorage.setItem(SESSION_KEY, '1')
    return true
  }
  return false
}

/** Change the PIN (requires the current PIN). */
export async function changePin(currentPin, newPin) {
  const ok = await verifyPin(currentPin)
  if (!ok) return false
  const salt = randomSalt()
  const hash = await sha256(`${salt}:${newPin}`)
  localStorage.setItem(PIN_SALT_KEY, salt)
  localStorage.setItem(PIN_HASH_KEY, hash)
  return true
}

/** Is this tab currently signed in? */
export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

/** Sign out of this tab. */
export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
