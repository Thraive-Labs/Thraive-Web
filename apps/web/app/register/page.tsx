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

interface FieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  showToggle?: boolean
  showingPassword?: boolean
  onToggleShow?: () => void
}

function Field({ id, label, type = 'text', value, onChange, placeholder, autoComplete, showToggle, showingPassword, onToggleShow }: FieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={showToggle ? (showingPassword ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          style={{
            ...INPUT_BASE,
            borderColor: focused ? 'var(--season-accent)' : 'var(--border)',
            paddingRight: showToggle ? 44 : 14,
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={showingPassword ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: 44,
              width: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            {showingPassword ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('user_profiles').upsert({
        id: data.user.id,
        full_name: name,
      })
    }

    router.push('/verify-email')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
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
            Create your account
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
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Field id="name" label="Full name" type="text" value={name} onChange={setName} placeholder="Udeesha Kularathne" autoComplete="name" />
            <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
            <Field id="password" label="Password" value={password} onChange={setPassword} placeholder="At least 8 characters" autoComplete="new-password" showToggle showingPassword={showPassword} onToggleShow={() => setShowPassword((v) => !v)} />
            <Field id="confirm" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat password" autoComplete="new-password" showToggle showingPassword={showConfirm} onToggleShow={() => setShowConfirm((v) => !v)} />

            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              By creating an account you agree to our{' '}
              <Link href="/legal/terms" style={{ color: 'var(--season-accent)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" style={{ color: 'var(--season-accent)', textDecoration: 'underline', textUnderlineOffset: 2 }}>
                Privacy Policy
              </Link>
              .
            </p>

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
                marginBottom: 16,
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-hover)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-bg)'
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--season-accent)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  )
}
