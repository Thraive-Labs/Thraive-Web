import { createClient } from '@/lib/supabase/server'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

const PRODUCT_ORDER = ['wildcafe', 'smartpos', 'pharmacy', 'routeflow', 'autoserv', 'sonara']

export default async function AppVersionsPage() {
  const supabase = await createClient()

  const { data: versions } = await supabase
    .from('app_versions')
    .select('id, product, platform, version, min_version, download_url, file_size, changelog, is_current, released_at')
    .order('released_at', { ascending: false })

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Group by product
  const grouped: Record<string, typeof versions> = {}
  if (versions) {
    for (const v of versions) {
      const p = v.product as string
      if (!grouped[p]) grouped[p] = []
      grouped[p]!.push(v)
    }
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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>App Versions</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
          Current versions are served to the downloads page and in-app updater.
        </p>

        {PRODUCT_ORDER.map((product) => {
          const pvs = grouped[product] ?? []
          if (pvs.length === 0) return null
          return (
            <div key={product} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {PRODUCT_NAMES[product] ?? product}
              </p>
              <div
                style={{
                  background: '#111113',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Platform', 'Version', 'Min Version', 'File Size', 'Released', 'Current'].map((h) => (
                        <th
                          key={h}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#4B5563',
                            padding: '8px 14px',
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
                    {pvs.map((v, i) => (
                      <tr key={v.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '8px 14px', color: '#9CA3AF' }}>
                          {(v.platform as string).charAt(0).toUpperCase() + (v.platform as string).slice(1)}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#E5E7EB', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          v{v.version as string}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>
                          {(v.min_version as string) ?? '—'}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#6B7280' }}>
                          {(v.file_size as string) ?? '—'}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {v.released_at ? new Date(v.released_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          {v.is_current ? (
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 20 }}>
                              Current
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: '#374151' }}>—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
