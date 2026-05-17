import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface CreateStaffBody {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'superadmin'
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

  const { email, password, full_name, role } = await req.json() as CreateStaffBody

  if (!email || !password || !full_name || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  // Admins can only create admin accounts, not superadmin
  if (callerStaff.role === 'admin' && role === 'superadmin') {
    return NextResponse.json({ error: 'Admins cannot create superadmin accounts' }, { status: 403 })
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (createError) return NextResponse.json({ error: createError.message }, { status: 400 })

  const { error: staffError } = await admin.from('staff').insert({
    id: newUser.user.id,
    full_name,
    role,
    is_active: true,
  })

  if (staffError) {
    await admin.auth.admin.deleteUser(newUser.user.id)
    return NextResponse.json({ error: staffError.message }, { status: 500 })
  }

  await admin.from('audit_log').insert({
    staff_id: user.id,
    action: 'create_staff',
    target_type: 'staff',
    target_id: newUser.user.id,
    details: { email, full_name, role },
  })

  return NextResponse.json({ success: true, id: newUser.user.id })
}
