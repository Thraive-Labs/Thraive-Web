'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import LogoMark from '@/components/ui/LogoMark'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 400, width: '100%', padding: '0 24px' }}>
        <GlassCard style={{ padding: 32 }}>
          {/* Back link */}
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              marginBottom: 20,
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 2.5L4 7l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to sign in
          </Link>

          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none',
              marginBottom: 4,
            }}
          >
            <LogoMark size={28} />
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Thraive Labs
            </span>
          </Link>

          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              textAlign: 'center',
              color: 'var(--text-primary)',
              marginBottom: 8,
              marginTop: 20,
            }}
          >
            Reset your password
          </h1>
          <p
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Enter your email address and we&#39;ll send you a link to reset your password.
          </p>

          {submitted ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: 'var(--season-accent)',
                fontWeight: 500,
                padding: '16px 0',
              }}
            >
              Check your email for a reset link.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  role="alert"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: 13,
                    color: '#EF4444',
                    marginBottom: 16,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${focused ? 'var(--season-accent)' : 'var(--border)'}`,
                    background: 'var(--bg)',
                    color: 'var(--text-primary)',
                    padding: '0 14px',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    transition: 'border-color 150ms',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 44,
                  background: 'var(--season-btn-bg)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'background 150ms',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-bg)'
                }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
