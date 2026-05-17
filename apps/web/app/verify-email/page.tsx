'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import LogoMark from '@/components/ui/LogoMark'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleResend() {
    setResending(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
    }
    setResending(false)
    setResent(true)
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
        <GlassCard style={{ padding: 32, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none',
              marginBottom: 24,
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

          {/* Envelope icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--season-glow-soft)',
              border: '1px solid var(--season-card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--season-accent)" strokeWidth="1.5" />
              <path d="M2 7l10 7 10-7" stroke="var(--season-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            We sent a verification link to your email address. Click the link to activate your account.
          </p>

          {resent ? (
            <p style={{ fontSize: 14, color: 'var(--season-accent)', fontWeight: 500, marginBottom: 20 }}>
              Verification email resent.
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                width: '100%',
                height: 40,
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-secondary)',
                cursor: resending ? 'wait' : 'pointer',
                marginBottom: 16,
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                if (!resending) {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--season-accent)'
                  el.style.color = 'var(--season-accent)'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}

          <Link
            href="/login"
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            Back to sign in
          </Link>
        </GlassCard>
      </div>
    </div>
  )
}
