import { createClient } from '@/lib/supabase/server'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

function formatLKR(cents: number) {
  return `LKR ${(cents / 100).toLocaleString('en-LK')}`
}

export default async function SubscriptionsPage() {
  const supabase = await createClient()

  const { data: subscriptions } = await supabase
    .from('licenses')
    .select('id, product, plan, status, expires_at, stripe_sub_id, payment_history(amount_cents)', { count: 'exact' })
    .eq('billing_type', 'subscription')
    .order('created_at', { ascending: false })

  // Rough MRR: sum latest payment per active sub
  let mrr = 0
  let atRisk = 0

  if (subscriptions) {
    for (const sub of subscriptions) {
      if (sub.status === 'active') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payments = sub.payment_history as any[]
        const latest = payments?.[0]?.amount_cents
        if (latest) mrr += latest as number
      }
      if (sub.status === 'past_due') atRisk++
    }
  }

  const activeCount = subscriptions?.filter((s) => s.status === 'active').length ?? 0

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Subscriptions</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Summary */}
        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '12px 20px',
            marginBottom: 20,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            fontSize: 13,
            color: '#9CA3AF',
          }}
        >
          <span>Active: <strong style={{ color: '#E5E7EB' }}>{activeCount}</strong></span>
          <span>MRR (est.): <strong style={{ color: '#E5E7EB' }}>{formatLKR(mrr)}</strong></span>
          <span>At risk: <strong style={{ color: atRisk > 0 ? '#EF4444' : '#E5E7EB' }}>{atRisk}</strong></span>
        </div>

        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Product', 'Plan', 'Status', 'Next Billing', 'Stripe Sub'].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#4B5563',
                        padding: '10px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions && subscriptions.length > 0 ? (
                  subscriptions.map((sub, i) => {
                    const statusColor =
                      sub.status === 'active' ? '#10B981' : sub.status === 'cancelled' ? '#EF4444' : '#F59E0B'
                    return (
                      <tr key={sub.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '10px 16px', color: '#E5E7EB' }}>
                          {PRODUCT_NAMES[sub.product as string] ?? (sub.product as string)}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#9CA3AF' }}>{sub.plan as string}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: `${statusColor}18`, padding: '2px 8px', borderRadius: 20 }}>
                            {(sub.status as string).charAt(0).toUpperCase() + (sub.status as string).slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {sub.expires_at ? new Date(sub.expires_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', color: '#4B5563', fontSize: 11 }}>
                          {(sub.stripe_sub_id as string) || '—'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                      No subscriptions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
