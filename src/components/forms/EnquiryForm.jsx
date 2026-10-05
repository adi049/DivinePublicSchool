import { useMemo, useState } from 'react'
import { Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { CLASS_OPTIONS } from '../../data/curriculum.js'
import { SCHOOL } from '../../data/school.js'

/**
 * Enquiry form — used on the Contact page (variant="contact") and the
 * Admissions page (variant="admissions").
 *
 * FRONTEND ONLY: no backend is connected yet. On successful validation the
 * form shows a confirmation message. To connect a backend later, replace the
 * simulated delay in `handleSubmit` with a `fetch()` POST to your endpoint.
 */
export default function EnquiryForm({ variant = 'contact' }) {
  const isAdmission = variant === 'admissions'

  const initialValues = useMemo(
    () => ({
      parentName: '',
      studentName: '',
      phone: '',
      email: '',
      classInterested: '',
      message: '',
    }),
    [],
  )

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fields = [
    {
      name: 'parentName',
      label: isAdmission ? "Parent / Guardian's Name" : 'Student / Parent Name',
      type: 'text',
      placeholder: 'e.g. Rakesh Kumar',
      required: true,
    },
    ...(isAdmission
      ? [
          {
            name: 'studentName',
            label: "Student's Name",
            type: 'text',
            placeholder: "Child's full name",
            required: true,
          },
        ]
      : []),
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      placeholder: '10-digit mobile number',
      required: true,
      validate: (v) =>
        /^[6-9]\d{9}$/.test(v.replace(/\D/g, '').slice(-10))
          ? ''
          : 'Please enter a valid 10-digit mobile number.',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
      required: true,
      validate: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
    },
    {
      name: 'classInterested',
      label: isAdmission ? 'Class Applying For' : 'Class Interested In',
      type: 'select',
      required: true,
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: isAdmission
        ? 'Anything you would like the admissions office to know…'
        : 'How can we help you?',
      required: false,
      full: true,
    },
  ]

  const validateField = (name, value) => {
    const field = fields.find((f) => f.name === name)
    if (!field) return ''
    if (field.required && !value.trim()) return 'This field is required.'
    if (!value.trim()) return ''
    return field.validate ? field.validate(value) : ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) {
      setErrors((err) => ({ ...err, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setErrors((err) => ({ ...err, [name]: validateField(name, value) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    fields.forEach((f) => {
      const msg = validateField(f.name, values[f.name] || '')
      if (msg) nextErrors[f.name] = msg
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // TODO(backend integration): POST `values` to the school's enquiry endpoint here.
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 900)
  }

  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="form-success" role="status">
        <h4>
          <CheckCircle2 size={20} aria-hidden="true" />
          Thank you — your enquiry has been noted.
        </h4>
        <p>
          Our {isAdmission ? 'admissions' : 'school'} office will get in touch with you shortly on
          the phone number or email you provided. For anything urgent, please call us on{' '}
          <strong>{SCHOOL.phones[0].display}</strong>.
        </p>
        <Button variant="outline" onClick={handleReset}>
          Send another enquiry
        </Button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {fields.map((field) => (
          <div key={field.name} className={`field ${field.full ? 'field--full' : ''}`}>
            <label htmlFor={`${variant}-${field.name}`}>
              {field.label} {field.required ? <span className="req">*</span> : null}
            </label>

            {field.type === 'select' ? (
              <select
                id={`${variant}-${field.name}`}
                name={field.name}
                className={`select ${errors[field.name] ? 'is-invalid' : ''}`}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors[field.name])}
              >
                <option value="">Select class…</option>
                {CLASS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={`${variant}-${field.name}`}
                name={field.name}
                className={`textarea ${errors[field.name] ? 'is-invalid' : ''}`}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ) : (
              <input
                id={`${variant}-${field.name}`}
                name={field.name}
                type={field.type}
                inputMode={field.type === 'tel' ? 'numeric' : undefined}
                className={`input ${errors[field.name] ? 'is-invalid' : ''}`}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(errors[field.name])}
              />
            )}

            {errors[field.name] && (
              <p className="field__err" role="alert">
                <AlertCircle size={13} aria-hidden="true" />
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="form-foot">
        <Button type="submit" variant="primary" icon={sending ? undefined : Send} disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={17} className="spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            'Submit Enquiry'
          )}
        </Button>
        <p className="form-note">
          Submitting this form records an enquiry only. For admission confirmation, the school will
          guide you through the remaining steps.
        </p>
      </div>
    </form>
  )
}
