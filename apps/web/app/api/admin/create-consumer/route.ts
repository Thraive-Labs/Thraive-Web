import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface CreateConsumerBody {
  email: string
  password: string
  full_name: string
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

  const { email, password, full_name } = await req.json() as CreateConsumerBody

  if (!email || !password || !full_name) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  })

  if (createError) return NextResponse.json({ error: createError.message }, { status: 400 })

  // Upsert profile in case the trigger didn't fire
  await admin.from('user_profiles').upsert({
    id: newUser.user.id,
    full_name,
  })

  await admin.from('audit_log').insert({
    staff_id: user.id,
    action: 'create_consumer',
    target_type: 'user',
    target_id: newUser.user.id,
    details: { email, full_name },
  })

  return NextResponse.json({ success: true, id: newUser.user.id })
}
