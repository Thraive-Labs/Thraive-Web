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

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwFocused, setPwFocused] = useState(false)
  const [cfFocused, setCfFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
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
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
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
            Set new password
          </h1>

          {done ? (
            <p
              style={{
                textAlign: 'center',
                fontSize: 15,
                color: 'var(--season-accent)',
                fontWeight: 500,
                padding: '20px 0',
              }}
            >
              Password updated. Redirecting to dashboard...
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
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

              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  style={{ ...INPUT_BASE, borderColor: pwFocused ? 'var(--season-accent)' : 'var(--border)' }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor="confirm"
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                  }}
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={() => setCfFocused(true)}
                  onBlur={() => setCfFocused(false)}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                  style={{ ...INPUT_BASE, borderColor: cfFocused ? 'var(--season-accent)' : 'var(--border)' }}
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
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
