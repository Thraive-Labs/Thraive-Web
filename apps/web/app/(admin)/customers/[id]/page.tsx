import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CustomerActionsClient from './CustomerActionsClient'

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

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: profile },
    { data: licenses },
    { data: payments },
    { data: notes },
  ] = await Promise.all([
    supabase.from('user_profiles').select('full_name, created_at').eq('id', id).single(),
    supabase.from('licenses').select('*').eq('user_id', id).order('created_at', { ascending: false }),
    supabase.from('payment_history').select('*').eq('user_id', id).order('paid_at', { ascending: false }),
    supabase.from('customer_notes').select('id, note, created_at').eq('customer_id', id).order('created_at', { ascending: false }),
  ])

  if (!profile) notFound()

  const joinedStr = new Date(profile.created_at as string).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
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
          gap: 12,
          flexShrink: 0,
        }}
      >
        <Link href="/customers" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
          Customers
        </Link>
        <span style={{ color: '#374151', fontSize: 13 }}>/</span>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB' }}>
          {(profile.full_name as string) || 'Unknown'}
        </h1>
      </div>

      <div style={{ padding: 32, maxWidth: 900 }}>
        {/* Profile */}
        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 24,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: '#F9FAFB', marginBottom: 4 }}>
            {(profile.full_name as string) || 'Unknown'}
          </p>
          <p style={{ fontSize: 13, color: '#4B5563' }}>Joined {joinedStr}</p>
        </div>

        {/* Licenses */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 12 }}>
          Licenses ({licenses?.length ?? 0})
        </p>
        <div style={{ marginBottom: 24 }}>
          {licenses && licenses.length > 0 ? (
            licenses.map((lic) => {
              const productName = PRODUCT_NAMES[lic.product as string] ?? (lic.product as string)
              const expiresStr = lic.expires_at
                ? new Date(lic.expires_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Never (lifetime)'
              const statusColor =
                lic.status === 'active' ? '#10B981' : lic.status === 'cancelled' ? '#EF4444' : '#F59E0B'
              return (
                <div
                  key={lic.id as string}
                  style={{
                    background: '#111113',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '14px 18px',
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#E5E7EB', marginBottom: 2 }}>
                      {productName} — {lic.plan as string}
                    </p>
                    <p style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>
                      {lic.license_key as string}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: statusColor,
                        background: `${statusColor}18`,
                        padding: '3px 8px',
                        borderRadius: 20,
                        display: 'inline-block',
                        marginBottom: 4,
                      }}
                    >
                      {(lic.status as string).charAt(0).toUpperCase() + (lic.status as string).slice(1)}
                    </span>
                    <p style={{ fontSize: 12, color: '#4B5563' }}>Expires: {expiresStr}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ fontSize: 13, color: '#4B5563' }}>No licenses.</p>
          )}
        </div>

        {/* Payment history */}
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 12 }}>
          Payment History ({payments?.length ?? 0})
        </p>
        {payments && payments.length > 0 ? (
          <div
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 24,
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Date', 'Amount', 'Status'].map((h) => (
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
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((row, i) => (
                  <tr key={row.id as string} style={{ background: i % 2 === 0 ? '#111113' : '#0F0F11' }}>
                    <td style={{ padding: '10px 16px', color: '#6B7280', fontFamily: 'var(--font-mono)' }}>
                      {row.paid_at ? new Date(row.paid_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '10px 16px', color: '#E5E7EB', fontWeight: 500 }}>
                      {formatLKR(row.amount_cents as number)}
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: row.status === 'paid' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: row.status === 'paid' ? '#10B981' : '#EF4444',
                        }}
                      >
                        {row.status === 'paid' ? 'Paid' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#4B5563', marginBottom: 24 }}>No payments.</p>
        )}

        {/* Actions + Notes (client component) */}
        <CustomerActionsClient
          customerId={id}
          existingNotes={(notes ?? []).map((n) => ({
            id: n.id as string,
            note: n.note as string,
            date: new Date(n.created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          }))}
        />
      </div>
    </>
  )
}
