import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function StaffPage() {
  const hdrs = await headers()
  const role = hdrs.get('x-staff-role')

  // Only superadmin can access
  if (role !== 'superadmin') redirect('/admin-dashboard')

  const supabase = await createClient()

  const { data: staff } = await supabase
    .from('staff')
    .select('id, full_name, role, is_active, created_at, last_login')
    .order('created_at', { ascending: false })

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const ROLE_LABELS: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    support: 'Support',
    finance: 'Finance',
  }

  return (
    <>
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Staff</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
          Staff accounts are managed here. Create accounts via Supabase Auth then assign them a role.
        </p>

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
                {['Name', 'Role', 'Status', 'Last Login', 'Joined'].map((h) => (
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
              {staff && staff.length > 0 ? (
                staff.map((s, i) => (
                  <tr key={s.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                    <td style={{ padding: '12px 16px', color: '#E5E7EB', fontWeight: 500 }}>
                      {s.full_name as string}
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
                        {ROLE_LABELS[s.role as string] ?? (s.role as string)}
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
                      {s.last_login ? new Date(s.last_login as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {new Date(s.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                    No staff accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
