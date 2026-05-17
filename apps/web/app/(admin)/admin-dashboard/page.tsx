import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const [
    { count: totalCustomers },
    { count: activeLicenses },
    { data: paymentsData },
    { data: recentSignups },
    { data: expiringSoon },
    { data: licensesByProduct },
    { count: newToday },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('licenses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase
      .from('payment_history')
      .select('amount_cents, paid_at')
      .eq('status', 'paid')
      .gte('paid_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('user_profiles')
      .select('full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('licenses')
      .select('user_id, product, plan, expires_at')
      .eq('status', 'active')
      .not('expires_at', 'is', null)
      .lte('expires_at', sevenDaysFromNow.toISOString())
      .order('expires_at', { ascending: true })
      .limit(5),
    supabase
      .from('licenses')
      .select('product')
      .eq('status', 'active'),
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
  ])

  const mrr = paymentsData
    ? paymentsData.reduce((sum, p) => sum + (p.amount_cents as number), 0)
    : 0

  // Build daily revenue for chart
  const dailyMap: Record<string, number> = {}
  if (paymentsData) {
    for (const p of paymentsData) {
      if (!p.paid_at) continue
      const day = new Date(p.paid_at as string).toLocaleDateString('en-CA') // YYYY-MM-DD
      dailyMap[day] = (dailyMap[day] ?? 0) + (p.amount_cents as number)
    }
  }
  const revenueChart = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const key = d.toLocaleDateString('en-CA')
    return { date: key, amount: dailyMap[key] ?? 0 }
  })

  // Product breakdown
  const productCounts: Record<string, number> = {}
  if (licensesByProduct) {
    for (const l of licensesByProduct) {
      const p = l.product as string
      productCounts[p] = (productCounts[p] ?? 0) + 1
    }
  }

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <AdminDashboardClient
      totalCustomers={totalCustomers ?? 0}
      activeLicenses={activeLicenses ?? 0}
      mrr={mrr}
      newToday={newToday ?? 0}
      revenueChart={revenueChart}
      recentSignups={(recentSignups ?? []).map((s) => ({
        name: (s.full_name as string) || 'Unknown',
        date: new Date(s.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      }))}
      expiringSoon={(expiringSoon ?? []).map((l) => ({
        product: l.product as string,
        plan: l.plan as string,
        expires: new Date(l.expires_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      }))}
      productCounts={productCounts}
      dateStr={dateStr}
    />
  )
}
