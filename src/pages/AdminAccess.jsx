import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Info, Loader } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Logo from '../components/ui/Logo.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { requestPasswordReset } from '../services/authService.js'

export default function AdminAccess() {
  useSEO({ title: 'Admin Access | Divine Public School', description: 'Restricted school administration login.', noindex: true })
  const { authenticated, loading, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resetBusy, setResetBusy] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  if (loading) return <div className="access"><div className="access__card">Checking secure admin session…</div></div>
  if (authenticated) return <Navigate to="/admin/dashboard" replace />
  const sendReset = async () => {
    setError('')
    setResetMessage('')
    if (!email.trim()) { setError('Enter your administrator email address first.'); return }
    setResetBusy(true)
    try {
      const redirectTo = window.location.origin + window.location.pathname
      await requestPasswordReset(email, redirectTo)
      setResetMessage('If this email belongs to an administrator account, Supabase will send a password reset link. Check your inbox and spam folder.')
    } catch (err) {
      setError(err.message || 'Could not send a password reset email. Please try again.')
    } finally { setResetBusy(false) }
  }
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try { await login(email, password) }
    catch (err) { setError(err.message || 'Unable to sign in. Check your credentials and try again.') }
    finally { setBusy(false) }
  }
  return (
    <div className="access">
      <div className="access__card">
        <div className="access__head">
          <Logo size={46} />
          <span className="access__brand"><strong>Divine Public School</strong><span>Administration Access</span></span>
        </div>
        <div className="access__shield"><ShieldCheck size={22} /></div>
        <h1 className="access__title">Admin Sign In</h1>
        <p className="access__sub">Sign in with the email address and password assigned to your school admin account.</p>
        <form className="form" onSubmit={submit}>
          <div className="field" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-email">Email address</label>
            <input id="admin-email" className="input" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" />
          </div>
          <div className="field" style={{ textAlign: 'left' }}>
            <label htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input id="admin-password" className="input" style={{ paddingRight: '3rem' }} type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
              <button type="button" className="access__toggle" style={{ position: 'absolute', right: '.25rem', top: '.25rem' }} onClick={() => setVisible(v => !v)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          {error && <p className="access__error" role="alert">{error}</p>}
          {resetMessage && <p className="form-note" role="status">{resetMessage}</p>}
          <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: '100%', marginTop: '1rem' }}>
            {busy ? <><Loader size={16} className="spin"/> Signing in…</> : 'Sign In Securely'}
          </button>
          <button type="button" className="access__back" onClick={sendReset} disabled={resetBusy} style={{ margin: '1rem auto 0', border: 0, background: 'transparent', cursor: 'pointer' }}>
            {resetBusy ? 'Sending reset link…' : 'Forgot password? Send reset link'}
          </button>
        </form>
        <p className="access__note"><Info size={15}/> Access is restricted to accounts registered in the Supabase school_admins table. PIN login has been removed.</p>
        <Link className="access__back" to="/"><ArrowLeft size={16}/> Back to website</Link>
      </div>
    </div>
  )
}
