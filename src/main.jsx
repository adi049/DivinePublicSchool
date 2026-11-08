import React from 'react'
import ReactDOM from 'react-dom/client'
// HashRouter is required for GitHub Pages: deep links and refreshes never hit
// the server, so no 404s on the static host (e.g. .../DivinePublicSchool/#/admin).
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'

// Locally bundled fonts (work without any external network requests)
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/lora/500.css'
import '@fontsource/lora/600.css'
import '@fontsource/lora/700.css'
import '@fontsource/lora/600-italic.css'

// Supabase Auth sends recovery credentials in the URL fragment. Capture the
// short-lived token before HashRouter interprets the fragment as an app route.
if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
  const recoveryParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const recoveryToken = recoveryParams.get('access_token')
  if (recoveryToken) {
    sessionStorage.setItem('dps.auth.recovery-token', recoveryToken)
    window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/admin/reset-password')
  }
}

// Global styles
import './styles/base.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
