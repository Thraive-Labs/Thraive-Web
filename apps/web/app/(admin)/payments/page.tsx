import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 25

function formatLKR(cents: number) {
  return `LKR ${(cents / 100).toLocaleString('en-LK')}`
}

interface SearchParams {
  page?: string
  status?: string
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam, status } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  let query = supabase
    .from('payment_history')
    .select('id, user_id, license_id, amount_cents, status, stripe_payment_id, paid_at', { count: 'exact' })
    .order('paid_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all') query = query.eq('status', status)

  const [{ data: payments, count }, { data: monthPayments }] = await Promise.all([
    query,
    supabase
      .from('payment_history')
      .select('amount_cents, status')
      .gte('paid_at', startOfMonth),
  ])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const monthTotal = monthPayments?.filter((p) => p.status === 'paid').reduce((s, p) => s + (p.amount_cents as number), 0) ?? 0
  const monthCount = monthPayments?.filter((p) => p.status === 'paid').length ?? 0
  const monthRefunds = monthPayments?.filter((p) => p.status === 'refunded').length ?? 0

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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Payments</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Summary bar */}
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
          <span>This month: <strong style={{ color: '#E5E7EB' }}>{formatLKR(monthTotal)}</strong></span>
          <span>{monthCount} payments</span>
          <span>{monthRefunds} refunds</span>
        </div>

        {/* Filter */}
        <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <select
            name="status"
            defaultValue={status ?? 'all'}
            style={{
              height: 36,
              padding: '0 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#111113',
              color: '#D1D5DB',
              fontSize: 13,
            }}
          >
            <option value="all">Status: All</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <button
            type="submit"
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 8,
              background: '#6366F1',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Filter
          </button>
        </form>

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
                  {['Date', 'Amount', 'Status', 'Stripe Payment ID'].map((h) => (
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
                {payments && payments.length > 0 ? (
                  payments.map((row, i) => {
                    const statusColor =
                      row.status === 'paid' ? '#10B981' : row.status === 'refunded' ? '#F59E0B' : '#EF4444'
                    return (
                      <tr key={row.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '10px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {row.paid_at ? new Date(row.paid_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#E5E7EB', fontWeight: 500 }}>
                          {formatLKR(row.amount_cents as number)}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: `${statusColor}18`, padding: '2px 8px', borderRadius: 20 }}>
                            {row.status === 'paid' ? 'Paid' : row.status === 'refunded' ? 'Refunded' : 'Failed'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', color: '#4B5563', fontSize: 11 }}>
                          {(row.stripe_payment_id as string) || '—'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {page > 1 && (
              <a href={`/payments?page=${page - 1}${status ? `&status=${status}` : ''}`} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Prev
              </a>
            )}
            <span style={{ fontSize: 13, color: '#6B7280', padding: '6px 14px' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a href={`/payments?page=${page + 1}${status ? `&status=${status}` : ''}`} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}
