'use client'

import { useState } from 'react'

interface Props {
  customerId: string
  customerName: string
  isBlocked: boolean
}

export function BlockToggle({ customerId, customerName, isBlocked: initialBlocked }: Props) {
  const [isBlocked, setIsBlocked] = useState(initialBlocked)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/admin/toggle-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, isBlocked: !isBlocked }),
    })
    if (res.ok) setIsBlocked((v) => !v)
    setLoading(false)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={`${isBlocked ? 'Unblock' : 'Block'} ${customerName}`}
      style={{
        fontSize: 12,
        padding: '4px 10px',
        borderRadius: 6,
        border: '1px solid',
        background: 'transparent',
        borderColor: isBlocked ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
        color: isBlocked ? '#10B981' : '#EF4444',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        marginLeft: 8,
      }}
    >
      {isBlocked ? 'Unblock' : 'Block'}
    </button>
  )
}

interface CreateConsumerModalProps {
  onClose: () => void
}

function CreateConsumerModal({ onClose }: CreateConsumerModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/create-consumer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    })
    const json = await res.json() as { error?: string }
    if (!res.ok) {
      setError(json.error ?? 'An error occurred')
      setLoading(false)
      return
    }

    onClose()
    window.location.reload()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 38,
    padding: '0 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0A0A0B',
    color: '#F9FAFB',
    fontSize: 14,
    boxSizing: 'border-box',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create consumer account"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#111113',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: 28,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB', marginBottom: 20 }}>
          Create consumer account
        </h2>

        {error && (
          <div
            role="alert"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: '#EF4444',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="consumer-name" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
              Full name
            </label>
            <input id="consumer-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label htmlFor="consumer-email" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
              Email
            </label>
            <input id="consumer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="off" style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="consumer-password" style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginBottom: 6 }}>
              Temporary password
            </label>
            <input id="consumer-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', borderRadius: 8, border: 'none', background: loading ? '#374151' : '#6366F1', color: 'white', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CreateConsumerButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && <CreateConsumerModal onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          height: 36,
          padding: '0 16px',
          borderRadius: 8,
          background: '#6366F1',
          color: 'white',
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        + Create consumer
      </button>
    </>
  )
}
