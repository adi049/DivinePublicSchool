import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, getStoredSessionToken } from './supabaseClient.js'
import { bootstrapRemoteData } from './localStore.js'

// Keep public pages and other signed-in admin browsers in sync with the
// shared database. RLS remains the authority for which rows each session sees.
const TABLES = [
  'timetables',
  'subjects',
  'date_sheets',
  'gallery_photos',
  'gallery_hidden',
  'events',
  'site_settings',
]
let activeClient = null

export function startRealtimeSync() {
  stopRealtimeSync()
  const token = getStoredSessionToken()
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 5 } },
  })
  if (token && token !== SUPABASE_ANON_KEY) client.realtime.setAuth(token)

  let refreshQueued = false
  const refresh = () => {
    if (refreshQueued) return
    refreshQueued = true
    // Coalesce bursts (e.g. a batch upload) into one database hydration.
    Promise.resolve().then(async () => {
      try { await bootstrapRemoteData() }
      finally { refreshQueued = false }
    })
  }

  let channel = client.channel('divine-school-public-content')
  for (const table of TABLES) {
    channel = channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table,
    }, refresh)
  }

  activeClient = client
  channel.subscribe((status) => {
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      console.warn('[Supabase Realtime] Subscription status:', status)
    }
  })
  return stopRealtimeSync
}

export function stopRealtimeSync() {
  if (!activeClient) return
  activeClient.removeAllChannels()
  activeClient = null
}
