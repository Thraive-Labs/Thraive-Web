import { createClient } from '@/lib/supabase/server'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

export default async function DevicesPage() {
  const supabase = await createClient()

  const { data: devices, count } = await supabase
    .from('license_devices')
    .select('id, device_id, platform, activated_at, is_active, license_id, licenses(product)', { count: 'exact' })
    .order('activated_at', { ascending: false })
    .limit(100)

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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Devices</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 20 }}>{count ?? 0} registered devices</p>

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
                  {['Device ID', 'Product', 'Platform', 'Activated', 'Status'].map((h) => (
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
                {devices && devices.length > 0 ? (
                  devices.map((d, i) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const lic = d.licenses as any
                    const productName = lic?.product ? (PRODUCT_NAMES[lic.product as string] ?? lic.product) : '—'
                    return (
                      <tr key={d.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                        <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)', color: '#9CA3AF', fontSize: 12 }}>
                          {(d.device_id as string).slice(0, 12)}...
                        </td>
                        <td style={{ padding: '10px 16px', color: '#E5E7EB' }}>{productName}</td>
                        <td style={{ padding: '10px 16px', color: '#9CA3AF' }}>{(d.platform as string) || '—'}</td>
                        <td style={{ padding: '10px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                          {d.activated_at ? new Date(d.activated_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: d.is_active ? '#10B981' : '#6B7280',
                              background: d.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                              padding: '2px 8px',
                              borderRadius: 20,
                            }}
                          >
                            {d.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', color: '#4B5563', textAlign: 'center' }}>
                      No devices registered yet.
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
