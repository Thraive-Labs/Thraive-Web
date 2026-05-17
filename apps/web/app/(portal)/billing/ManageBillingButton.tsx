'use client'

import { useState } from 'react'

export default function ManageBillingButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/billing-portal', { method: 'POST' })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Failed to open billing portal.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          height: 40,
          padding: '0 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--season-btn-bg)',
          color: 'white',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'opacity 150ms',
        }}
      >
        {loading ? 'Opening...' : 'Manage billing'}
      </button>
      {error && (
        <p style={{ fontSize: 13, color: '#EF4444', marginTop: 8 }}>{error}</p>
      )}
    </div>
  )
}
