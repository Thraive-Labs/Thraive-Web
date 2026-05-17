'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [staffName, setStaffName] = useState('')
  const [staffRole, setStaffRole] = useState('')
  const [ready, setReady] = useState(false)

  // Force dark mode for admin portal
  useEffect(() => {
    const html = document.documentElement
    const prev = html.getAttribute('data-mode')
    html.setAttribute('data-mode', 'dark')
    return () => {
      if (prev) html.setAttribute('data-mode', prev)
      else html.removeAttribute('data-mode')
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/admin-login')
        return
      }
      const { data: staff } = await supabase
        .from('staff')
        .select('full_name, role, is_active')
        .eq('id', user.id)
        .single()

      if (!staff || !staff.is_active) {
        await supabase.auth.signOut()
        router.push('/admin-login?error=access_denied')
        return
      }

      setStaffName((staff.full_name as string) || user.email || 'Staff')
      setStaffRole(staff.role as string)
      setReady(true)
    })
  }, [router])

  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.3)',
            borderTopColor: '#6366F1',
            animation: 'spin 0.7s linear infinite',
          }}
          aria-label="Loading"
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0A0A0B',
        color: '#F9FAFB',
      }}
    >
      <AdminSidebar staffName={staffName} staffRole={staffRole} />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
