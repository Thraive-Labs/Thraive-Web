'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const accessDenied = searchParams.get('error') === 'access_denied'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(accessDenied ? 'Access denied. This account is not authorized.' : null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setLoading(false)
      if (authError.message.toLowerCase().includes('invalid')) {
        setError('Invalid email or password.')
      } else {
        setError('Sign in failed. Please try again.')
      }
      return
    }

    // Middleware will verify staff access and redirect accordingly
    router.push('/admin-dashboard')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#F9FAFB',
    fontSize: 15,
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#111113',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '40px 36px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 4L36 13V27L20 36L4 27V13L20 4Z" stroke="#6366F1" strokeWidth="2" fill="none" />
            <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" fill="#6366F1" opacity="0.4" />
          </svg>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.01em' }}>
              Thraive Labs
            </p>
            <p style={{ fontSize: 11, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Admin Portal
            </p>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F9FAFB', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Sign in
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
          Staff accounts only. Contact your administrator if you need access.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              fontSize: 13,
              color: '#FCA5A5',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 6 }}
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@thraive.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 6 }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 44,
              marginTop: 4,
              borderRadius: 8,
              background: loading ? '#4B5563' : '#6366F1',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 150ms',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <a
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13,
            color: '#4B5563',
            textDecoration: 'none',
          }}
        >
          &larr; Back to homepage
        </a>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}
