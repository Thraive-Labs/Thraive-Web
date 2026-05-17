import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: profile }, { data: notifPrefs }] = await Promise.all([
    supabase.from('user_profiles').select('full_name, created_at').eq('id', user.id).single(),
    supabase.from('notification_prefs').select('*').eq('user_id', user.id).single(),
  ])

  const memberSince = new Date(profile?.created_at ?? user.created_at).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <SettingsClient
      fullName={profile?.full_name ?? ''}
      email={user.email ?? ''}
      memberSince={memberSince}
      renewalReminders={notifPrefs?.renewal_reminders ?? true}
      versionAlerts={notifPrefs?.version_alerts ?? true}
      marketingEmails={notifPrefs?.marketing_emails ?? false}
    />
  )
}
