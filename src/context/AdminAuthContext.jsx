import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as auth from '../services/authService.js'
import { bootstrapRemoteData } from '../services/localStore.js'
import { startRealtimeSync } from '../services/realtimeService.js'

const AdminAuthContext = createContext(null)
export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    auth.getCurrentAdmin().then(async current => {
      await bootstrapRemoteData()
      if (active) { setUser(current); setLoading(false) }
    }).catch(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])
  useEffect(() => startRealtimeSync(), [user])
  const login = useCallback(async (email, password) => {
    const current = await auth.loginWithPassword(email, password)
    await bootstrapRemoteData()
    setUser(current)
    return current
  }, [])
  const logout = useCallback(async () => {
    await auth.logout()
    await bootstrapRemoteData()
    setUser(null)
  }, [])
  const value = useMemo(() => ({ user, loading, authenticated: Boolean(user), login, logout }), [user, loading, login, logout])
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider')
  return ctx
}
