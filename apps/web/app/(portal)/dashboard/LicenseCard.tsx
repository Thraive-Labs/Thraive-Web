'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'

export interface LicenseCardData {
  id: string
  productName: string
  plan: string
  billing_type: 'one_time' | 'subscription'
  license_key: string
  status: 'active' | 'expired' | 'cancelled'
  expires_at: string | null
  created_at: string
  accent: string
}

function maskKey(key: string): string {
  const parts = key.split('-')
  return parts.map((p, i) => (i < parts.length - 1 ? p.replace(/./g, '*') : p)).join('-')
}

function StatusBadge({ status, expiresAt }: { status: string; expiresAt: string | null }) {
  const now = new Date()
  const expiry = expiresAt ? new Date(expiresAt) : null
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  if (status === 'active' && expiry && expiry.getTime() - now.getTime() < sevenDays && expiry > now) {
    return (
      <span style={{ fontSize: 12, color: '#D97706', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span aria-hidden="true">&#x25CF;</span>
        Expiring soon
      </span>
    )
  }

  const config = {
    active: { color: '#16A34A', label: 'Active' },
    expired: { color: '#EF4444', label: 'Expired' },
    cancelled: { color: 'var(--text-muted)', label: 'Cancelled' },
  }[status] ?? { color: 'var(--text-muted)', label: status }

  return (
    <span style={{ fontSize: 12, color: config.color, display: 'flex', alignItems: 'center', gap: 4 }}>
      <span aria-hidden="true">&#x25CF;</span>
      {config.label}
    </span>
  )
}

export default function LicenseCard({ license }: { license: LicenseCardData }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    void navigator.clipboard.writeText(license.license_key).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const expiryLabel = () => {
    if (license.billing_type === 'one_time') return 'Expires: Never (one-time license)'
    if (!license.expires_at) return ''
    const d = new Date(license.expires_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
    return license.status === 'expired' ? `Expired: ${d}` : `Renews: ${d}`
  }

  return (
    <GlassCard style={{ padding: 24, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
      {/* Top accent bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: license.accent,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 8 }}>
        {/* Product icon circle */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `${license.accent}20`,
            color: license.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Info */}
        <div style={{ flex: 1, paddingLeft: 16 }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {license.productName}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{license.plan} plan</span>
            <StatusBadge status={license.status} expiresAt={license.expires_at} />
          </div>

          {/* License key */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
              }}
            >
              {revealed ? license.license_key : maskKey(license.license_key)}
            </code>
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'border-color 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--season-accent)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              {revealed ? 'Hide' : 'Reveal'}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: copied ? '#16A34A' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Expiry */}
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
            {expiryLabel()}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              href="/downloads"
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                color: license.status !== 'active' ? 'var(--text-muted)' : 'var(--text-secondary)',
                textDecoration: 'none',
                pointerEvents: license.status !== 'active' ? 'none' : undefined,
                opacity: license.status !== 'active' ? 0.5 : 1,
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                if (license.status === 'active') {
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
              Download latest
            </Link>
            <Link
              href="/billing"
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--season-accent)'
                el.style.color = 'var(--season-accent)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
