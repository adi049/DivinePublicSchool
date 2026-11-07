// ============================================================================
// ADMIN AUTH CONTEXT — thin React wrapper around the temporary auth service
// ============================================================================
// Components never touch localStorage/sessionStorage directly; when Supabase
// Auth replaces the temporary PIN layer, only authService.js changes.
// ============================================================================

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as auth from '../services/authService.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  // Re-render trigger; auth state itself lives in the (swap-able) service.
  const [, setVersion] = useState(0)
  const refresh = useCallback(() => setVersion((v) => v + 1), [])

  const value = useMemo(
    () => ({
      pinSet: auth.isPinSet(),
      authenticated: auth.isAuthenticated(),
      setupPin: async (pin) => {
        await auth.setupPin(pin)
        refresh()
      },
      verifyPin: async (pin) => {
        const ok = await auth.verifyPin(pin)
        if (ok) refresh()
        return ok
      },
      changePin: auth.changePin,
      logout: () => {
        auth.logout()
        refresh()
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refresh, auth.isPinSet(), auth.isAuthenticated()],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
