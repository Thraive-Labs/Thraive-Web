import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ role: null })

  const admin = createAdminClient()
  const { data: staffRow } = await admin
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .eq('is_active', true)
    .single()

  return NextResponse.json({ role: staffRow?.role ?? null })
}
