'use client'

import { useEffect, useState } from 'react'
import { useLoading } from '@/contexts/loading-context'
import PortalSidebar from '@/components/portal/PortalSidebar'
import { createClient } from '@/lib/supabase/client'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { setLoaded } = useLoading()
  const [displayName, setDisplayName] = useState<string>('')

  useEffect(() => {
    setLoaded()

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const name =
        profile?.full_name?.split(' ')[0] ??
        user.email?.split('@')[0] ??
        'User'

      setDisplayName(name)
    })
  }, [setLoaded])

  return (
    <div style={{ display: 'flex', minHeight: '100svh' }}>
      <PortalSidebar displayName={displayName} />
      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
