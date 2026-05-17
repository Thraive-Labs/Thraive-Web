import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface ToggleStaffBody {
  staffId: string
  isActive: boolean
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

  const { staffId, isActive } = await req.json() as ToggleStaffBody

  if (staffId === user.id) {
    return NextResponse.json({ error: 'Cannot deactivate your own account' }, { status: 400 })
  }

  const { data: targetStaff } = await admin
    .from('staff')
    .select('role')
    .eq('id', staffId)
    .single()

  if (!targetStaff) return NextResponse.json({ error: 'Staff member not found' }, { status: 404 })

  if (callerStaff.role === 'admin' && targetStaff.role === 'superadmin') {
    return NextResponse.json({ error: 'Admins cannot manage superadmin accounts' }, { status: 403 })
  }

  const { error } = await admin
    .from('staff')
    .update({ is_active: isActive })
    .eq('id', staffId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from('audit_log').insert({
    staff_id: user.id,
    action: isActive ? 'activate_staff' : 'deactivate_staff',
    target_type: 'staff',
    target_id: staffId,
    details: {},
  })

  return NextResponse.json({ success: true })
}
