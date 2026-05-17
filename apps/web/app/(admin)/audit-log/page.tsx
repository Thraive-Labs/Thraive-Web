import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 50

interface SearchParams {
  page?: string
  action?: string
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { page: pageParam, action } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('audit_log')
    .select('id, action, target_type, target_id, details, created_at, staff(full_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (action && action !== 'all') query = query.eq('action', action)

  const { data: logs, count } = await query
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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Audit Log</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 20 }}>
          Read-only log of all admin actions. {count ?? 0} entries.
        </p>

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
                  {['Timestamp', 'Staff', 'Action', 'Target', 'Details'].map((h) => (
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
                {logs && logs.length > 0 ? (
                  logs.map((log, i) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const staffMember = log.staff as any
                    return (
                      <tr key={log.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '10px 14px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {new Date(log.created_at as string).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>
                          {staffMember?.full_name ?? '—'}
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#818CF8', fontSize: 12 }}>
                          {log.action as string}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#6B7280', fontSize: 12 }}>
                          {log.target_type ? `${log.target_type as string}: ${(log.target_id as string) ?? ''}` : '—'}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#4B5563', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.details ? JSON.stringify(log.details) : '—'}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                      No audit log entries yet.
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
              <a href={`/audit-log?page=${page - 1}`} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Prev
              </a>
            )}
            <span style={{ fontSize: 13, color: '#6B7280', padding: '6px 14px' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <a href={`/audit-log?page=${page + 1}`} style={{ fontSize: 13, color: '#818CF8', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8 }}>
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </>
  )
}
