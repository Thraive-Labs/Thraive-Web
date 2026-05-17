import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: staff } = await admin
    .from('staff')
    .select('full_name, role, is_active')
    .eq('id', user.id)
    .single()

  if (!staff || !staff.is_active) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({
    full_name: staff.full_name as string,
    role: staff.role as string,
  })
}
