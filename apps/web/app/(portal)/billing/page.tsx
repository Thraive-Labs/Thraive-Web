import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GlassCard from '@/components/ui/GlassCard'
import ManageBillingButton from './ManageBillingButton'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

const PRODUCT_ACCENTS: Record<string, string> = {
  wildcafe: '#F97316',
  smartpos: '#10B981',
  pharmacy: '#06B6D4',
  routeflow: '#3B82F6',
  autoserv: '#8B5CF6',
  sonara: '#7C3AED',
}

function formatLKR(cents: number) {
  return `LKR ${(cents / 100).toLocaleString('en-LK')}`
}

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: licenses }, { data: payments }] = await Promise.all([
    supabase
      .from('licenses')
      .select('id, product, plan, billing_type, status, created_at, expires_at, stripe_sub_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('payment_history')
      .select('*')
      .eq('user_id', user.id)
      .order('paid_at', { ascending: false }),
  ])

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Billing</h1>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      {/* Content */}
      <div style={{ padding: 32 }}>
        {/* Manage billing button */}
        <div style={{ marginBottom: 32 }}>
          <ManageBillingButton />
        </div>

        {/* Current plans */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 16,
          }}
        >
          Current Plans
        </p>

        {licenses && licenses.length > 0 ? (
          licenses.map((lic) => {
            const accent = PRODUCT_ACCENTS[lic.product as string] ?? 'var(--season-accent)'
            const productName = PRODUCT_NAMES[lic.product as string] ?? (lic.product as string)
            const purchasedStr = new Date(lic.created_at as string).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const renewsStr = lic.expires_at
              ? new Date(lic.expires_at as string).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
              : null

            return (
              <GlassCard
                key={lic.id as string}
                style={{ padding: 20, marginBottom: 12, position: 'relative', overflow: 'hidden' }}
              >
                <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginTop: 6,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {productName}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                      {lic.plan as string} plan &mdash;{' '}
                      {lic.billing_type === 'one_time' ? 'One-time license' : 'Monthly subscription'}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Purchased: {purchasedStr}
                      {lic.billing_type === 'subscription' && renewsStr ? ` — Renews: ${renewsStr}` : ''}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      opacity: 0.5,
                      display: 'inline-block',
                    }}
                  >
                    {lic.billing_type === 'one_time' ? 'Upgrade' : 'Manage via billing portal'}
                  </span>
                </div>
              </GlassCard>
            )
          })
        ) : (
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>No licenses found.</p>
        )}

        {/* Payment history */}
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: 16,
            marginTop: 48,
          }}
        >
          Payment History
        </p>

        <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
          {payments && payments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr>
                    {['Date', 'Product', 'Amount', 'Status', 'Invoice'].map((h) => (
                      <th
                        key={h}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          padding: '10px 16px',
                          borderBottom: '1px solid var(--border)',
                          textAlign: 'left',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((row, i) => {
                    const paidDate = row.paid_at
                      ? new Date(row.paid_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'
                    const licProduct = licenses?.find((l) => l.id === row.license_id)
                    const productLabel = licProduct
                      ? `${PRODUCT_NAMES[licProduct.product as string] ?? licProduct.product} ${licProduct.plan}`
                      : '—'

                    return (
                      <tr key={row.id as string} style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-subtle)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{paidDate}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{productLabel}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {formatLKR(row.amount_cents as number)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-full)',
                              background:
                                row.status === 'paid'
                                  ? 'rgba(22,163,74,0.1)'
                                  : row.status === 'refunded'
                                  ? 'rgba(234,179,8,0.1)'
                                  : 'rgba(239,68,68,0.1)',
                              color:
                                row.status === 'paid'
                                  ? '#16A34A'
                                  : row.status === 'refunded'
                                  ? '#CA8A04'
                                  : '#EF4444',
                            }}
                          >
                            {row.status === 'paid' ? 'Paid' : row.status === 'refunded' ? 'Refunded' : 'Failed'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {row.status === 'paid' ? (
                            <a
                              href="#"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12,
                                color: 'var(--season-accent)',
                                textDecoration: 'none',
                              }}
                              aria-label={`Download invoice for ${productLabel} on ${paidDate}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                                <path d="M7 2v7M4 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                              Download
                            </a>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ padding: '20px 20px', fontSize: 14, color: 'var(--text-muted)' }}>
              No payment history yet.
            </p>
          )}
        </GlassCard>
      </div>
    </>
  )
}
