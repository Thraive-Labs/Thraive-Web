'use client'

import { useState } from 'react'

interface StaffMember {
  id: string
  full_name: string
  role: string
  is_active: boolean
}

interface Props {
  staff: StaffMember[]
  callerRole: string
  callerId: string
}

function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: '#1F2937',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '12px 18px',
        fontSize: 13,
        color: '#E5E7EB',
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  )
}

interface ModalProps {
  mode: 'staff' | 'consumer'
  callerRole: string
  onClose: () => void
  onCreated: () => void
}

function CreateModal({ mode, callerRole, onClose, onCreated }: ModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'superadmin'>('admin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const endpoint = mode === 'staff' ? '/api/admin/create-staff' : '/api/admin/create-consumer'
    const body = mode === 'staff'
      ? { email, password, full_name: fullName, role }
      : { email, password, full_name: fullName }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json = await res.json() as { error?: string }
    if (!res.ok) {
      setError(json.error ?? 'An error occurred')
      setLoading(false)
      return
    }

    onCreated()
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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#9CA3AF',
    marginBottom: 6,
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'staff' ? 'Create staff account' : 'Create consumer account'}
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
          maxWidth: 420,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB', marginBottom: 20 }}>
          {mode === 'staff' ? 'Create staff account' : 'Create consumer account'}
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
            <label htmlFor="create-name" style={labelStyle}>Full name</label>
            <input
              id="create-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label htmlFor="create-email" style={labelStyle}>Email</label>
            <input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: mode === 'staff' ? 14 : 20 }}>
            <label htmlFor="create-password" style={labelStyle}>Temporary password</label>
            <input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          {mode === 'staff' && (
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="create-role" style={labelStyle}>Role</label>
              <select
                id="create-role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'superadmin')}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="admin">Admin</option>
                {callerRole === 'superadmin' && <option value="superadmin">Super Admin</option>}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#9CA3AF',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 36,
                padding: '0 16px',
                borderRadius: 8,
                border: 'none',
                background: loading ? '#374151' : '#6366F1',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function StaffActionsClient({ staff: initialStaff, callerRole, callerId }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [toast, setToast] = useState<string | null>(null)
  const [modal, setModal] = useState<'staff' | 'consumer' | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function toggleActive(memberId: string, currentlyActive: boolean) {
    setTogglingId(memberId)
    const res = await fetch('/api/admin/toggle-staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId: memberId, isActive: !currentlyActive }),
    })
    const json = await res.json() as { error?: string }
    if (!res.ok) {
      showToast(json.error ?? 'Failed to update')
    } else {
      setStaff((prev) =>
        prev.map((s) => s.id === memberId ? { ...s, is_active: !currentlyActive } : s)
      )
      showToast(!currentlyActive ? 'Account activated.' : 'Account deactivated.')
    }
    setTogglingId(null)
  }

  function handleCreated() {
    setModal(null)
    showToast('Account created successfully.')
    // Refresh the page to get the updated list
    window.location.reload()
  }

  const ROLE_LABELS: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
  }

  return (
    <>
      {toast && <Toast message={toast} />}

      {modal && (
        <CreateModal
          mode={modal}
          callerRole={callerRole}
          onClose={() => setModal(null)}
          onCreated={handleCreated}
        />
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setModal('staff')}
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
          + Create staff account
        </button>
        <button
          type="button"
          onClick={() => setModal('consumer')}
          style={{
            height: 36,
            padding: '0 16px',
            borderRadius: 8,
            background: 'transparent',
            color: '#9CA3AF',
            fontSize: 13,
            fontWeight: 500,
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
        >
          + Create consumer account
        </button>
      </div>

      {/* Staff table */}
      <div
        style={{
          background: '#111113',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Name', 'Role', 'Status', 'Last Login', 'Joined', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#4B5563',
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    textAlign: 'left',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.length > 0 ? (
              staff.map((s, i) => {
                const isSelf = s.id === callerId
                const canToggle =
                  !isSelf &&
                  !(callerRole === 'admin' && s.role === 'superadmin')

                return (
                  <tr key={s.id} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                    <td style={{ padding: '12px 16px', color: '#E5E7EB', fontWeight: 500 }}>
                      {s.full_name}
                      {isSelf && (
                        <span style={{ fontSize: 10, color: '#4B5563', marginLeft: 8 }}>(you)</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: s.role === 'superadmin' ? '#818CF8' : '#9CA3AF',
                          background: s.role === 'superadmin' ? 'rgba(99,102,241,0.15)' : 'rgba(107,114,128,0.1)',
                          padding: '2px 8px',
                          borderRadius: 20,
                        }}
                      >
                        {ROLE_LABELS[s.role] ?? s.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: s.is_active ? '#10B981' : '#EF4444',
                          background: s.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          padding: '2px 8px',
                          borderRadius: 20,
                        }}
                      >
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {'—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {'—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {canToggle && (
                        <button
                          type="button"
                          onClick={() => void toggleActive(s.id, s.is_active)}
                          disabled={togglingId === s.id}
                          style={{
                            fontSize: 12,
                            padding: '4px 12px',
                            borderRadius: 6,
                            border: '1px solid',
                            background: 'transparent',
                            borderColor: s.is_active ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)',
                            color: s.is_active ? '#EF4444' : '#10B981',
                            cursor: togglingId === s.id ? 'not-allowed' : 'pointer',
                            opacity: togglingId === s.id ? 0.5 : 1,
                          }}
                        >
                          {s.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                  No staff accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
