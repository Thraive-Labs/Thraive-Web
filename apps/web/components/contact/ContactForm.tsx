'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const SUBJECTS = [
  { value: '', label: 'Select a subject...' },
  { value: 'sales', label: 'Sales enquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>
      {message}
    </p>
  )
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.email.trim()) {
      next.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address.'
    }
    if (!form.subject) next.subject = 'Please select a subject.'
    if (!form.message.trim()) {
      next.message = 'Message is required.'
    } else if (form.message.trim().length < 20) {
      next.message = 'Message must be at least 20 characters.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setServerError((data as { error?: string }).error ?? 'Failed to send message. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    height: 44,
    padding: '0 14px',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${hasError ? '#EF4444' : 'var(--border)'}`,
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    fontSize: 15,
    transition: 'border-color 150ms',
    boxSizing: 'border-box',
  })

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        style={{
          padding: '48px 40px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#10B98118',
            border: '1px solid #10B98130',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
          aria-hidden="true"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M5 11l4 4 8-8"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 10,
            letterSpacing: '-0.01em',
          }}
        >
          Message sent.
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          We&rsquo;ll get back to you within one business day. Keep an eye on {form.email}.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{
        padding: '40px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Name + Email row */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        className="grid-cols-1 sm:grid-cols-2"
      >
        <div>
          <label
            htmlFor="contact-name"
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Your name"
            style={inputStyle(!!errors.name)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
          />
          {errors.name && <FieldError id="error-name" message={errors.name} />}
        </div>
        <div>
          <label
            htmlFor="contact-email"
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.com"
            style={inputStyle(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && <FieldError id="error-email" message={errors.email} />}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="contact-subject"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}
        >
          Subject
        </label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          style={{
            ...inputStyle(!!errors.subject),
            appearance: 'none',
            cursor: 'pointer',
          }}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'error-subject' : undefined}
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value} disabled={s.value === ''}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.subject && <FieldError id="error-subject" message={errors.subject} />}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}
        >
          Message
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell us what you need..."
          rows={5}
          style={{
            ...inputStyle(!!errors.message),
            height: 'auto',
            padding: '12px 14px',
            resize: 'vertical',
            lineHeight: 1.6,
          }}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'error-message' : undefined}
        />
        {errors.message && <FieldError id="error-message" message={errors.message} />}
      </div>

      {/* Server error */}
      {serverError && (
        <p role="alert" style={{ fontSize: 13, color: '#EF4444', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-brand)',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 150ms, transform 150ms',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            const el = e.currentTarget as HTMLButtonElement
            el.style.opacity = '0.88'
            el.style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.opacity = loading ? '0.7' : '1'
          el.style.transform = ''
        }}
      >
        {loading ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ animation: 'spin 0.8s linear infinite' }}
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="20 18" />
            </svg>
            Sending...
          </>
        ) : (
          'Send message'
        )}
      </button>
    </motion.form>
  )
}
