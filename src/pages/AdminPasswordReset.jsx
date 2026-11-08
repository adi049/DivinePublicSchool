import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, KeyRound, Loader, ShieldCheck } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Logo from '../components/ui/Logo.jsx'
import { updateRecoveredPassword } from '../services/authService.js'

export default function AdminPasswordReset() {
  useSEO({ title: 'Reset Admin Password | Divine Public School', description: 'Set a new school administrator password.', noindex: true })
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const accessToken = sessionStorage.getItem('dps.auth.recovery-token')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('The passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await updateRecoveredPassword(accessToken, password)
      sessionStorage.removeItem('dps.auth.recovery-token')
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Could not update the password. Request a fresh reset link.')
    } finally {
      setBusy(false)
    }
  }

  if (!accessToken && !success) return <Navigate to="/admin" replace />
  return (
    <div className="access">
      <div className="access__card">
        <div className="access__head">
          <Logo size={46} />
          <span className="access__brand"><strong>Divine Public School</strong><span>Administration Access</span></span>
        </div>
        <div className="access__shield"><KeyRound size={22} /></div>
        <h1 className="access__title">{success ? 'Password updated' : 'Create a new password'}</h1>
        {success ? (
          <>
            <p className="access__sub">Your administrator password has been changed. You can now sign in using your new password.</p>
            <Link className="btn btn--primary" to="/admin">Return to Admin Sign In</Link>
          </>
        ) : (
          <>
            <p className="access__sub">Choose a strong password for the school's administrator account.</p>
            <form className="form" onSubmit={submit}>
              <div className="field" style={{ textAlign: 'left' }}>
                <label htmlFor="new-admin-password">New password</label>
                <input id="new-admin-password" className="input" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
              </div>
              <div className="field" style={{ textAlign: 'left' }}>
                <label htmlFor="confirm-admin-password">Confirm new password</label>
                <input id="confirm-admin-password" className="input" type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter the password again" />
              </div>
              {error && <p className="access__error" role="alert">{error}</p>}
              <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: '100%', marginTop: '1rem' }}>
                {busy ? <><Loader size={16} className="spin" /> Updating…</> : 'Update Password'}
              </button>
            </form>
          </>
        )}
        <p className="access__note"><ShieldCheck size={15} /> Password recovery is handled securely by Supabase Auth.</p>
        <Link className="access__back" to="/admin"><ArrowLeft size={16} /> Back to admin sign in</Link>
      </div>
    </div>
  )
}
