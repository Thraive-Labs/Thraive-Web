import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const PAGE_SIZE = 20

interface SearchParams {
  page?: string
  q?: string
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('user_profiles')
    .select('id, full_name, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) {
    query = query.ilike('full_name', `%${q}%`)
  }

  const { data: profiles, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Customers</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12 }}>
          <form method="GET" style={{ display: 'flex', gap: 10 }}>
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name..."
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#111113',
                color: '#F9FAFB',
                fontSize: 14,
                width: 220,
              }}
            />
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
              Search
            </button>
          </form>
          <p style={{ fontSize: 13, color: '#4B5563' }}>{count ?? 0} total customers</p>
        </div>

        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>
                {['Name', 'Joined', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#4B5563',
                      padding: '10px 20px',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      textAlign: 'left',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles && profiles.length > 0 ? (
                profiles.map((p, i) => (
                  <tr key={p.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                    <td style={{ padding: '12px 20px', color: '#E5E7EB', fontWeight: 500 }}>
                      {(p.full_name as string) || 'Unknown'}
                    </td>
                    <td style={{ padding: '12px 20px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                      {new Date(p.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <Link
                        href={`/customers/${p.id as string}`}
                        style={{
                          fontSize: 12,
                          color: '#818CF8',
                          textDecoration: 'none',
                          fontWeight: 500,
                          padding: '4px 10px',
                          border: '1px solid rgba(99,102,241,0.3)',
                          borderRadius: 6,
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ padding: '24px 20px', color: '#4B5563', textAlign: 'center' }}>
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {page > 1 && (
              <Link
                href={`/customers?page=${page - 1}${q ? `&q=${q}` : ''}`}
                style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}
              >
                Prev
              </Link>
            )}
            <span style={{ fontSize: 13, color: '#6B7280', padding: '6px 14px' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/customers?page=${page + 1}${q ? `&q=${q}` : ''}`}
                style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}
