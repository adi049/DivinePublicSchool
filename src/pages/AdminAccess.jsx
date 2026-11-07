// ============================================================================
// ADMIN ACCESS — temporary PIN gate (frontend demo, NOT real security)
// ============================================================================
// • First visit on a device → administrator creates a 4-digit PIN.
// • Afterwards → verify PIN to open the dashboard.
// • The PIN hash lives in this browser only; see services/authService.js.
//   Supabase Auth will replace this screen's verify/setup calls later.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Info, Loader } from 'lucide-react'
import useSEO from '../hooks/useSEO.js'
import Logo from '../components/ui/Logo.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const PIN_LENGTH = 4

function PinFields({ value, onChange, visible, onComplete, autoFocus = true, inputRef }) {
  const inputs = useRef([])

  useEffect(() => {
    if (autoFocus) inputs.current[0]?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (value.every((d) => d !== '')) onComplete?.(value.join(''))
  }, [value, onComplete])

  const focusAt = (i) => inputs.current[i]?.focus()

  const setDigit = (i, digit) => {
    const next = [...value]
    next[i] = digit
    onChange(next)
  }

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) return
    // support typing/pasting multiple digits
    const digits = raw.slice(0, PIN_LENGTH - i).split('')
    const next = [...value]
    digits.forEach((d, k) => {
      next[i + k] = d
    })
    onChange(next)
    focusAt(Math.min(i + digits.length, PIN_LENGTH - 1))
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (value[i]) {
        setDigit(i, '')
      } else if (i > 0) {
        setDigit(i - 1, '')
        focusAt(i - 1)
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      focusAt(i - 1)
    } else if (e.key === 'ArrowRight' && i < PIN_LENGTH - 1) {
      e.preventDefault()
      focusAt(i + 1)
    }
  }

  return (
    <div className="pin" role="group" aria-label="4-digit PIN" ref={inputRef}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          className="pin__field"
          type={visible ? 'text' : 'password'}
          inputMode="numeric"
          autoComplete="off"
          maxLength={1}
          value={digit}
          aria-label={`Digit ${i + 1} of ${PIN_LENGTH}`}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
}

const EMPTY = Array(PIN_LENGTH).fill('')

export default function AdminAccess() {
  useSEO({
    title: 'Admin Access | Divine Public School',
    description: 'Restricted area — school administration.',
    noindex: true,
  })
  const navigate = useNavigate()
  const { pinSet, authenticated, setupPin, verifyPin } = useAdminAuth()

  // mode: 'verify' | 'create' | 'confirm'
  const [mode, setMode] = useState(pinSet ? 'verify' : 'create')
  const [digits, setDigits] = useState([...EMPTY])
  const [firstPin, setFirstPin] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [resetKey, setResetKey] = useState(0) // remount PIN fields to refocus digit 1
  const liveRef = useRef(null)

  useEffect(() => {
    setMode(pinSet ? 'verify' : 'create')
  }, [pinSet])

  if (authenticated) return <Navigate to="/admin/dashboard" replace />

  const announceError = (msg) => {
    setError(msg)
    liveRef.current?.classList.remove('pin-shake')
    // restart the shake animation
    void liveRef.current?.offsetWidth
    liveRef.current?.classList.add('pin-shake')
  }

  const resetDigits = () => {
    setDigits([...EMPTY])
    setResetKey((k) => k + 1)
  }

  const handleComplete = async (pin) => {
    if (busy) return
    setBusy(true)
    try {
      if (mode === 'verify') {
        const ok = await verifyPin(pin)
        if (ok) {
          navigate('/admin/dashboard', { replace: true })
        } else {
          announceError('Incorrect PIN. Please try again.')
          resetDigits()
        }
      } else if (mode === 'create') {
        setFirstPin(pin)
        setError('')
        setMode('confirm')
        resetDigits()
      } else {
        // confirm
        if (pin !== firstPin) {
          announceError('The PINs do not match. Please create your PIN again.')
          setMode('create')
          setFirstPin('')
          resetDigits()
          return
        }
        await setupPin(pin)
        navigate('/admin/dashboard', { replace: true })
      }
    } catch (err) {
      announceError(err.message || 'Something went wrong. Please try again.')
      resetDigits()
    } finally {
      setBusy(false)
    }
  }

  const heading =
    mode === 'verify' ? 'Enter Admin PIN' : mode === 'create' ? 'Create your Admin PIN' : 'Confirm your PIN'
  const subtext =
    mode === 'verify'
      ? 'Enter the 4-digit PIN to open the dashboard.'
      : mode === 'create'
        ? 'No admin PIN exists on this device yet. Choose a 4-digit PIN.'
        : 'Enter the same 4-digit PIN once more to confirm.'

  return (
    <div className="access">
      <motion.div
        className="access__card"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="access__head">
          <Logo size={46} />
          <span className="access__brand">
            <strong>Divine Public School</strong>
            <span>Administration Access</span>
          </span>
        </div>

        <div className="access__shield" aria-hidden="true">
          {mode === 'verify' ? <ShieldCheck size={22} /> : <KeyRound size={22} />}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
          >
            <h1 className="access__title">{heading}</h1>
            <p className="access__sub">{subtext}</p>

            <div ref={liveRef}>
              <PinFields key={resetKey} value={digits} onChange={(d) => { setDigits(d); setError('') }} visible={visible} onComplete={handleComplete} />
              {busy && (
                <p className="access__busy">
                  <Loader size={14} className="spin" aria-hidden="true" /> Verifying…
                </p>
              )}
              {error && (
                <p className="access__error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="access__row">
              <button
                type="button"
                className="access__toggle"
                onClick={() => setVisible((v) => !v)}
                aria-pressed={visible}
              >
                {visible ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                {visible ? 'Hide PIN' : 'Show PIN'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="access__note">
          <Info size={13} aria-hidden="true" />
          This temporary device-local sign-in is for the website preview. Secure Supabase
          authentication will replace it before launch.
        </p>

        <Link to="/" className="access__back">
          <ArrowLeft size={15} aria-hidden="true" /> Back to website
        </Link>
      </motion.div>
    </div>
  )
}
