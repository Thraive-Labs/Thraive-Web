import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 25

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

function maskKey(key: string) {
  const parts = key.split('-')
  return parts.map((p, i) => (i === 0 ? p : '****')).join('-')
}

interface SearchParams {
  page?: string
  status?: string
  product?: string
  billing?: string
}

export default async function LicensesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam, status, product, billing } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('licenses')
    .select('id, license_key, product, plan, billing_type, status, created_at, expires_at, user_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all') query = query.eq('status', status)
  if (product && product !== 'all') query = query.eq('product', product)
  if (billing && billing !== 'all') query = query.eq('billing_type', billing)

  const { data: licenses, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  function buildUrl(params: Record<string, string>) {
    const p = new URLSearchParams({ page: '1', ...(status ? { status } : {}), ...(product ? { product } : {}), ...(billing ? { billing } : {}), ...params })
    return `/licenses?${p.toString()}`
  }

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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Licenses</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Filters */}
        <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { name: 'status', options: ['all', 'active', 'expired', 'cancelled'], label: 'Status', current: status },
            { name: 'product', options: ['all', ...Object.keys(PRODUCT_NAMES)], label: 'Product', current: product },
            { name: 'billing', options: ['all', 'one_time', 'subscription'], label: 'Type', current: billing },
          ].map((f) => (
            <select
              key={f.name}
              name={f.name}
              defaultValue={f.current ?? 'all'}
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
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o === 'all' ? `${f.label}: All` : o === 'one_time' ? 'One-time' : o === 'subscription' ? 'Subscription' : PRODUCT_NAMES[o] ?? o}
                </option>
              ))}
            </select>
          ))}
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
          <span style={{ fontSize: 13, color: '#4B5563', marginLeft: 'auto' }}>{count ?? 0} results</span>
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
                  {['License Key', 'Product', 'Plan', 'Type', 'Status', 'Created', 'Expires'].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#4B5563',
                        padding: '10px 14px',
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
                {licenses && licenses.length > 0 ? (
                  licenses.map((lic, i) => {
                    const statusColor =
                      lic.status === 'active' ? '#10B981' : lic.status === 'cancelled' ? '#EF4444' : '#F59E0B'
                    return (
                      <tr key={lic.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#9CA3AF', fontSize: 12 }}>
                          {maskKey(lic.license_key as string)}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#E5E7EB' }}>
                          {PRODUCT_NAMES[lic.product as string] ?? (lic.product as string)}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{lic.plan as string}</td>
                        <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>
                          {lic.billing_type === 'one_time' ? 'One-time' : 'Sub'}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: statusColor, background: `${statusColor}18`, padding: '2px 8px', borderRadius: 20 }}>
                            {(lic.status as string).charAt(0).toUpperCase() + (lic.status as string).slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {new Date(lic.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                          {lic.expires_at ? new Date(lic.expires_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                      No licenses found.
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
              <a href={buildUrl({ page: String(page - 1) })} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Prev
              </a>
            )}
            <span style={{ fontSize: 13, color: '#6B7280', padding: '6px 14px' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a href={buildUrl({ page: String(page + 1) })} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}
