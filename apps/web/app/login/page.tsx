'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import LogoMark from '@/components/ui/LogoMark'
import { createClient } from '@/lib/supabase/client'

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  background: 'var(--bg)',
  color: 'var(--text-primary)',
  padding: '0 14px',
  fontSize: 14,
  boxSizing: 'border-box',
  transition: 'border-color 150ms',
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect email or password.',
  email_not_confirmed: 'Please verify your email before signing in.',
  over_email_send_rate_limit: 'Too many attempts. Please try again in a few minutes.',
  auth_callback: 'Authentication failed. Please try again.',
}

function parseAuthError(message: string): string {
  if (message.toLowerCase().includes('invalid login')) return ERROR_MESSAGES.invalid_credentials
  if (message.toLowerCase().includes('email not confirmed')) return ERROR_MESSAGES.email_not_confirmed
  if (message.toLowerCase().includes('rate limit')) return ERROR_MESSAGES.over_email_send_rate_limit
  return message
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setLoading(false)
      setError(parseAuthError(authError.message))
      return
    }

    // Check if user is staff — redirect to admin portal if so
    const { data: staffRow } = await supabase
      .from('staff')
      .select('role')
      .eq('id', authData.user.id)
      .eq('is_active', true)
      .single()

    router.push(staffRow ? '/admin-dashboard' : '/dashboard')
    router.refresh()
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
              marginBottom: 28,
              marginTop: 20,
            }}
          >
            Sign in to your account
          </h1>

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
                marginBottom: 20,
              }}
            >
              {error}
              {error === ERROR_MESSAGES.email_not_confirmed && (
                <Link
                  href="/verify-email"
                  style={{ color: '#EF4444', textDecoration: 'underline', marginLeft: 6 }}
                >
                  Resend verification
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
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
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  ...INPUT_BASE,
                  borderColor: emailFocused ? 'var(--season-accent)' : 'var(--border)',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: 12,
                    color: 'var(--season-accent)',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                autoComplete="current-password"
                style={{
                  ...INPUT_BASE,
                  borderColor: passwordFocused ? 'var(--season-accent)' : 'var(--border)',
                }}
              />
            </div>

            {/* Submit */}
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '24px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Don&#39;t have an account?{' '}
            <Link
              href="/register"
              style={{ color: 'var(--season-accent)', textDecoration: 'none', fontWeight: 500 }}
            >
              Create account
            </Link>
          </p>

          <p style={{ textAlign: 'center' }}>
            <Link
              href="/"
              style={{
                fontSize: 13,
                color: 'var(--season-accent)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Get a product
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
