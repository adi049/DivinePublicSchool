import { SUPABASE_URL, SUPABASE_ANON_KEY, getStoredSessionToken } from './supabaseClient.js'
import { bootstrapRemoteData } from './localStore.js'

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
  heartbeatTimer = null
  reconnectTimer = null
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
    send(socket, 'phx_join', {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: '' },
        postgres_changes: TABLES.map(table => ({
          event: '*',
          schema: 'public',
          table,
        })),
        private: false,
      },
      access_token: token,
    }, 'realtime:public:divine-school-content', joinRef)

    heartbeatTimer = window.setInterval(() => {
      send(socket, 'heartbeat', {}, 'phoenix', joinRef)
    }, 25000)
  }

  socket.onmessage = (event) => {
    let message
    try { message = JSON.parse(event.data) } catch { return }

    if (message.event === 'phx_reply' && message.payload?.status === 'ok') {
      joined = true
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
  return stopRealtimeSync
}

export function stopRealtimeSync() {
  stopped = true
  stopTimers()
  const socket = activeSocket
  activeSocket = null
  if (socket && socket.readyState < WebSocket.CLOSING) socket.close()
}
