'use client'

import { useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import { createClient } from '@/lib/supabase/client'

interface ToggleProps {
  on: boolean
  onToggle: () => void
  label: string
}

function Toggle({ on, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      style={{
        width: 36,
        height: 20,
        borderRadius: 'var(--radius-full)',
        background: on ? 'var(--season-btn-bg)' : 'var(--border)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 200ms',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'white',
          transition: 'left 200ms',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

interface SettingRowProps {
  label: string
  value: string
  action?: React.ReactNode
  last?: boolean
}

function SettingRow({ label, value, action, last = false }: SettingRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{value}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

function SettingButton({ children, onClick }: { children: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 12,
        padding: '5px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: hovered ? 'var(--season-accent)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'color 150ms, border-color 150ms',
        borderColor: hovered ? 'var(--season-accent)' : 'var(--border)',
      }}
    >
      {children}
    </button>
  )
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 16,
}

interface Props {
  fullName: string
  email: string
  memberSince: string
  renewalReminders: boolean
  versionAlerts: boolean
  marketingEmails: boolean
}

export default function SettingsClient({ fullName, email, memberSince, renewalReminders: initialRenewal, versionAlerts: initialVersion, marketingEmails: initialMarketing }: Props) {
  const [renewalReminders, setRenewalReminders] = useState(initialRenewal)
  const [versionAlerts, setVersionAlerts] = useState(initialVersion)
  const [marketingEmails, setMarketingEmails] = useState(initialMarketing)

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  async function saveNotifPref(field: string, value: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('notification_prefs').upsert({ user_id: user.id, [field]: value })
  }

  function handleToggle(field: string, setter: (v: boolean) => void, current: boolean) {
    const next = !current
    setter(next)
    void saveNotifPref(field, next)
  }

  function handleChangePassword() {
    const supabase = createClient()
    void supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    }).then(() => {
      alert(`A password reset link has been sent to ${email}.`)
    })
  }

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Settings</h1>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Profile */}
        <p style={SECTION_LABEL}>Profile</p>
        <GlassCard style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          <SettingRow
            label="Full name"
            value={fullName}
            action={<SettingButton>Edit</SettingButton>}
          />
          <SettingRow
            label="Email"
            value={email}
            action={<SettingButton>Change email</SettingButton>}
            last
          />
        </GlassCard>

        {/* Security */}
        <p style={SECTION_LABEL}>Security</p>
        <GlassCard style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          <SettingRow
            label="Password"
            value={'•'.repeat(11)}
            action={<SettingButton onClick={handleChangePassword}>Change password</SettingButton>}
          />
          <SettingRow
            label="Two-factor authentication"
            value="Not enabled"
            action={<SettingButton>Enable 2FA</SettingButton>}
            last
          />
        </GlassCard>

        {/* Account info */}
        <p style={SECTION_LABEL}>Account</p>
        <GlassCard style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          <SettingRow label="Member since" value={memberSince} last />
        </GlassCard>

        {/* Notifications */}
        <p style={SECTION_LABEL}>Notifications</p>
        <GlassCard style={{ padding: 0, overflow: 'hidden', marginBottom: 32 }}>
          {[
            {
              key: 'renewal_reminders',
              label: 'Renewal reminders',
              desc: 'Email before your subscription renews',
              value: renewalReminders,
              setter: setRenewalReminders,
            },
            {
              key: 'version_alerts',
              label: 'Version alerts',
              desc: 'Notify me when a new version is available for my products',
              value: versionAlerts,
              setter: setVersionAlerts,
            },
            {
              key: 'marketing_emails',
              label: 'Marketing emails',
              desc: 'Product news, tips, and announcements from Thraive Labs',
              value: marketingEmails,
              setter: setMarketingEmails,
            },
          ].map((item, i, arr) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
              <Toggle
                on={item.value}
                onToggle={() => handleToggle(item.key, item.setter, item.value)}
                label={`Toggle ${item.label}`}
              />
            </div>
          ))}
        </GlassCard>

        {/* Danger zone */}
        <p style={SECTION_LABEL}>Danger Zone</p>
        <GlassCard style={{ padding: 20, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            Delete account
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
            Permanently delete your account and all associated data. This action cannot be undone.
            Your license keys will be deactivated and you will lose access to all purchased software.
          </p>
          <button
            type="button"
            style={{
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'transparent',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            Delete account
          </button>
        </GlassCard>
      </div>
    </>
  )
}
