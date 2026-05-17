'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

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

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '20px 24px',
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4B5563', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.02em' }}>
        {value}
      </p>
    </div>
  )
}

interface Props {
  totalCustomers: number
  activeLicenses: number
  mrr: number
  newToday: number
  revenueChart: { date: string; amount: number }[]
  recentSignups: { name: string; date: string }[]
  expiringSoon: { product: string; plan: string; expires: string }[]
  productCounts: Record<string, number>
  dateStr: string
}

export default function AdminDashboardClient({
  totalCustomers,
  activeLicenses,
  mrr,
  newToday,
  revenueChart,
  recentSignups,
  expiringSoon,
  productCounts,
  dateStr,
}: Props) {
  const totalLicenses = Object.values(productCounts).reduce((a, b) => a + b, 0)
  const productOrder = ['wildcafe', 'smartpos', 'pharmacy', 'sonara', 'routeflow', 'autoserv']

  return (
    <>
      {/* Top bar */}
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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Dashboard</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard label="Total Customers" value={totalCustomers.toLocaleString()} />
          <StatCard label="Active Licenses" value={activeLicenses.toLocaleString()} />
          <StatCard label="Revenue (30 days)" value={formatLKR(mrr)} />
          <StatCard label="New Today" value={newToday} />
        </div>

        {/* Revenue chart */}
        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '20px 24px',
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 16 }}>Revenue — last 30 days (LKR)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueChart} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#4B5563' }}
                tickFormatter={(v: string) => v.slice(5)} // MM-DD
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#4B5563' }}
                tickFormatter={(v: number) => `${(v / 100).toLocaleString('en-LK', { maximumFractionDigits: 0 })}`}
                width={60}
              />
              <Tooltip
                formatter={(v) => [typeof v === 'number' ? formatLKR(v) : String(v), 'Revenue']}
                labelStyle={{ color: '#9CA3AF', fontSize: 12 }}
                contentStyle={{ background: '#1A1A1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
              />
              <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent signups + Expiring soon */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 14 }}>Recent Signups</p>
            {recentSignups.length === 0 ? (
              <p style={{ fontSize: 13, color: '#4B5563' }}>No signups yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentSignups.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#E5E7EB' }}>{s.name}</span>
                    <span style={{ fontSize: 12, color: '#4B5563', fontFamily: 'var(--font-mono)' }}>{s.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '20px 24px',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 14 }}>Expiring Soon</p>
            {expiringSoon.length === 0 ? (
              <p style={{ fontSize: 13, color: '#4B5563' }}>No licenses expiring in the next 7 days.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expiringSoon.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#E5E7EB' }}>{PRODUCT_NAMES[l.product] ?? l.product} {l.plan}</span>
                    <span style={{ fontSize: 12, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>{l.expires}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product breakdown */}
        <div
          style={{
            background: '#111113',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '20px 24px',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', marginBottom: 16 }}>Product Breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {productOrder.map((product) => {
              const count = productCounts[product] ?? 0
              const pct = totalLicenses > 0 ? Math.round((count / totalLicenses) * 100) : 0
              return (
                <div key={product} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: '#E5E7EB', width: 130, flexShrink: 0 }}>
                    {PRODUCT_NAMES[product]}
                  </span>
                  <span style={{ fontSize: 13, color: '#4B5563', width: 28, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {count}
                  </span>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#6366F1', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#4B5563', width: 30, textAlign: 'right' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
