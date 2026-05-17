import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StaffActionsClient from './StaffActionsClient'

export default async function StaffPage() {
  const hdrs = await headers()
  const role = hdrs.get('x-staff-role')

  // Admins and superadmins can access staff management
  if (role !== 'superadmin' && role !== 'admin') redirect('/admin-dashboard')

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin-login')

  const { data: staff } = await supabase
    .from('staff')
    .select('id, full_name, role, is_active, created_at, last_login')
    .order('created_at', { ascending: false })

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

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
        <StaffActionsClient
          staff={(staff ?? []).map((s) => ({
            id: s.id as string,
            full_name: s.full_name as string,
            role: s.role as string,
            is_active: s.is_active as boolean,
          }))}
          callerRole={role ?? 'admin'}
          callerId={user.id}
        />
      </div>
    </>
  )
}
