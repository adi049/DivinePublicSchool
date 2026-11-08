import { useMemo, useState } from 'react'
import { Send, AlertCircle, CheckCircle2, Loader2, MessageCircle, ExternalLink } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { CLASS_OPTIONS } from '../../data/curriculum.js'
import { SCHOOL } from '../../data/school.js'
import { supabaseRequest } from '../../services/supabaseClient.js'

/**
 * Enquiry form — used on the Contact page (variant="contact") and the
 * Admissions page (variant="admissions").
 *
 * Enquiries are inserted into Supabase. Public users can submit only new
 * enquiries; administrators can review and update them through RLS-protected access.
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
  const [sendError, setSendError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    fields.forEach((f) => {
      const msg = validateField(f.name, values[f.name] || '')
      if (msg) nextErrors[f.name] = msg
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSending(true)
    setSendError('')
    setWhatsappUrl('')
    // Reserve a tab during the submit gesture so popup blockers do not block WhatsApp.
    const whatsappTab = window.open('about:blank', '_blank')
    try {
      const savedEnquiry = await supabaseRequest('rest/v1/enquiries?select=id,created_at', {
        method: 'POST',
        body: {
          parent_name: values.parentName.trim(),
          student_name: values.studentName.trim() || null,
          phone: values.phone.replace(/\D/g, '').slice(-10),
          email: values.email.trim(),
          class_interested: values.classInterested,
          message: values.message.trim(),
          enquiry_type: isAdmission ? 'admissions' : 'contact',
          status: 'new',
        },
        prefer: 'return=representation',
      })
      const whatsappMessage = [
        'Hello Divine Public School, I have submitted an enquiry through the website.',
        `Enquiry type: ${isAdmission ? 'Admission' : 'General'}`,
        `Parent / Guardian: ${values.parentName.trim()}`,
        ...(values.studentName.trim() ? [`Student: ${values.studentName.trim()}`] : []),
        `Phone: ${values.phone.replace(/\D/g, '').slice(-10)}`,
        `Email: ${values.email.trim()}`,
        `Class interested in: ${values.classInterested}`,
        ...(values.message.trim() ? [`Message: ${values.message.trim()}`] : []),
        `Enquiry reference: ${savedEnquiry?.[0]?.id || 'Saved in school website admin panel'}`,
      ].join('\n')
      const nextWhatsappUrl = `${SCHOOL.whatsapp.url}?text=${encodeURIComponent(whatsappMessage)}`
      setWhatsappUrl(nextWhatsappUrl)
      setSubmitted(true)
      if (whatsappTab) whatsappTab.location.href = nextWhatsappUrl
      else setSendError('Your enquiry is saved. Use the WhatsApp button below to send the details to the school.')
    } catch (err) {
      if (whatsappTab) whatsappTab.close()
      setSendError(err.message || 'Your enquiry could not be saved. Please call the school office.')
    } finally {
      setSending(false)
    }
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
          Your details have been saved in the school admin panel. WhatsApp should open with your enquiry
          pre-filled; please tap Send in WhatsApp so the school office receives your message.
        </p>
        {sendError && <p className="field__err" role="status">{sendError}</p>}
        {whatsappUrl && (
          <p style={{ marginTop: '1rem' }}>
            <a className="btn btn--green" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={17} aria-hidden="true" /> Send enquiry on WhatsApp <ExternalLink size={14} aria-hidden="true" />
            </a>
          </p>
        )}
        <p style={{ marginTop: '1rem' }}>For anything urgent, please call <strong>{SCHOOL.phones[0].display}</strong>.</p>
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

      {sendError && <p className="field__err" role="alert">{sendError}</p>}
      <div className="form-foot">
        <Button type="submit" variant="primary" icon={sending ? undefined : Send} disabled={sending}>
          {sending ? (
            <>
              <Loader2 size={17} className="spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            'Save & Continue to WhatsApp'
          )}
        </Button>
        <p className="form-note">
          Your enquiry is saved securely first. WhatsApp then opens with the same details ready to send.
        </p>
      </div>
    </form>
  )
}
