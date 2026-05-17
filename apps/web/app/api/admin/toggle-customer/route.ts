import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface ToggleCustomerBody {
  customerId: string
  isBlocked: boolean
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: callerStaff } = await admin
    .from('staff')
    .select('role')
    .eq('id', user.id)
    .eq('is_active', true)
    .single()

  if (!callerStaff) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { customerId, isBlocked } = await req.json() as ToggleCustomerBody

  if (!customerId) return NextResponse.json({ error: 'customerId is required' }, { status: 400 })

  const { error } = await admin
    .from('user_profiles')
    .update({ is_blocked: isBlocked })
    .eq('id', customerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('audit_log').insert({
    staff_id: user.id,
    action: isBlocked ? 'block_customer' : 'unblock_customer',
    target_type: 'user',
    target_id: customerId,
    details: {},
  })

  return NextResponse.json({ success: true })
}
