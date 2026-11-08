import { SUPABASE_URL, SUPABASE_ANON_KEY, getStoredSessionToken } from './supabaseClient.js'
import { bootstrapRemoteData } from './localStore.js'
import { getCurrentAdmin } from './authService.js'

// Native Phoenix Realtime WebSocket client: avoids adding a runtime dependency
// and keeps the existing npm lockfile deterministic.
const TABLES = [
  'timetables',
  'subjects',
  'date_sheets',
  'gallery_photos',
  'gallery_hidden',
  'events',
  'site_settings',
]

let activeSocket = null
let heartbeatTimer = null
let reconnectTimer = null
let tokenRefreshTimer = null
let stopped = true
let retryDelay = 1000
let messageRef = 0

function websocketUrl() {
  const url = new URL(SUPABASE_URL)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  url.pathname = url.pathname.replace(/\/$/, '') + '/realtime/v1/websocket'
  url.searchParams.set('apikey', SUPABASE_ANON_KEY)
  url.searchParams.set('vsn', '1.0.0')
  return url.toString()
}

function send(socket, event, payload, topic = 'realtime:public:divine-school-content', joinRef = '1') {
  if (socket?.readyState !== WebSocket.OPEN) return
  messageRef += 1
  socket.send(JSON.stringify({
    topic,
    event,
    payload,
    ref: String(messageRef),
    join_ref: joinRef,
  }))
}

function scheduleRefresh() {
  // Batch a burst of row changes into one shared-data refresh.
  if (scheduleRefresh.pending) return
  scheduleRefresh.pending = true
  window.setTimeout(async () => {
    try { await bootstrapRemoteData() }
    catch (error) { console.warn('[Supabase Realtime] Refresh failed:', error) }
    finally { scheduleRefresh.pending = false }
  }, 120)
}
scheduleRefresh.pending = false

function stopTimers() {
  if (heartbeatTimer) window.clearInterval(heartbeatTimer)
  if (reconnectTimer) window.clearTimeout(reconnectTimer)
  if (tokenRefreshTimer) window.clearInterval(tokenRefreshTimer)
  heartbeatTimer = null
  reconnectTimer = null
  tokenRefreshTimer = null
}

function connect() {
  if (stopped) return
  const socket = new WebSocket(websocketUrl())
  activeSocket = socket
  let joined = false
  const joinRef = String(++messageRef)

  socket.onopen = () => {
    retryDelay = 1000
    const token = getStoredSessionToken()
    const isAdminSession = token !== SUPABASE_ANON_KEY
    const subscribedTables = isAdminSession ? TABLES : TABLES.filter(table => table !== 'gallery_hidden')
    send(socket, 'phx_join', {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: '' },
        postgres_changes: subscribedTables.map(table => ({
          event: '*',
          schema: 'public',
          table,
        })),
        private: false,
      },
      access_token: token,
    }, 'realtime:public:divine-school-content', joinRef)

    heartbeatTimer = window.setInterval(() => {
      send(socket, 'heartbeat', {}, 'phoenix', null)
    }, 25000)
  }

  socket.onmessage = (event) => {
    let message
    try { message = JSON.parse(event.data) } catch { return }

    if (message.event === 'phx_reply') {
      if (message.payload?.status === 'ok') joined = true
      else {
        console.warn('[Supabase Realtime] Join/reply failed:', message.payload)
        socket.close()
      }
      return
    }
    if (message.event === 'postgres_changes') {
      scheduleRefresh()
      return
    }
    if (message.event === 'phx_error' || message.event === 'phx_close') {
      console.warn('[Supabase Realtime] Channel closed:', message.payload)
      socket.close()
    }
  }

  socket.onerror = () => {
    // onclose handles the retry; avoid logging token-bearing URLs.
  }

  socket.onclose = () => {
    if (activeSocket === socket) activeSocket = null
    if (heartbeatTimer) window.clearInterval(heartbeatTimer)
    heartbeatTimer = null
    if (!stopped && !reconnectTimer) {
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null
        connect()
      }, retryDelay)
      retryDelay = Math.min(retryDelay * 2, 30000)
    }
    if (joined) scheduleRefresh()
  }
}

export function startRealtimeSync() {
  stopRealtimeSync()
  stopped = false
  connect()
  // Supabase access tokens expire. Refresh the stored admin session periodically
  // and reconnect the WebSocket whenever the bearer token changes.
  tokenRefreshTimer = window.setInterval(async () => {
    const before = getStoredSessionToken()
    try { await getCurrentAdmin() } catch {}
    const after = getStoredSessionToken()
    if (!stopped && after !== before) {
      if (activeSocket) activeSocket.close()
      else connect()
    }
  }, 5 * 60 * 1000)
  return stopRealtimeSync
}

export function stopRealtimeSync() {
  stopped = true
  stopTimers()
  const socket = activeSocket
  activeSocket = null
  if (socket && socket.readyState < WebSocket.CLOSING) socket.close()
}
