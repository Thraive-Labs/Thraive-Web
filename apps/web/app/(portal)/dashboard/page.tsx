import { redirect } from 'next/navigation'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import { createClient } from '@/lib/supabase/server'
import LicenseCard from './LicenseCard'

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

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: licenses }, { data: profile }] = await Promise.all([
    supabase.from('licenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('user_profiles').select('full_name, created_at').eq('id', user.id).single(),
  ])

  const activeLicenses = licenses?.filter((l) => l.status === 'active') ?? []
  const firstName = profile?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'there'

  const memberSince = new Date(profile?.created_at ?? user.created_at).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

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
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Dashboard</h1>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      {/* Content */}
      <div style={{ padding: 32, maxWidth: 900 }}>
        <p
          style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          Welcome back, {firstName}.
        </p>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
          {activeLicenses.length === 0
            ? 'You have no active licenses yet.'
            : `You have ${activeLicenses.length} active license${activeLicenses.length === 1 ? '' : 's'}.`}
        </p>

        {/* Licenses section */}
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
          Your Licenses
        </p>

        {licenses && licenses.length > 0 ? (
          licenses.map((license) => (
            <LicenseCard
              key={license.id}
              license={{
                id: license.id,
                productName: PRODUCT_NAMES[license.product as string] ?? (license.product as string),
                plan: license.plan as string,
                billing_type: license.billing_type as 'one_time' | 'subscription',
                license_key: license.license_key as string,
                status: license.status as 'active' | 'expired' | 'cancelled',
                expires_at: license.expires_at as string | null,
                created_at: license.created_at as string,
                accent: PRODUCT_ACCENTS[license.product as string] ?? 'var(--season-accent)',
              }}
            />
          ))
        ) : (
          <GlassCard style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>
              You don&#39;t have any products yet.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                background: 'var(--season-btn-bg)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Browse products
            </Link>
          </GlassCard>
        )}

        {/* Add another product */}
        {licenses && licenses.length > 0 && (
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              marginTop: 8,
              transition: 'border-color 150ms, color 150ms',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add another product
          </Link>
        )}

        {/* Account summary */}
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
          Account Summary
        </p>

        <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
          {[
            {
              label: 'Email',
              value: user.email ?? '',
              action: (
                <Link href="/settings" style={{ fontSize: 12, color: 'var(--season-accent)', textDecoration: 'none' }}>
                  Change
                </Link>
              ),
            },
            { label: 'Member since', value: memberSince, action: null },
            { label: 'Total products', value: String(licenses?.length ?? 0), action: null },
          ].map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{row.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {row.value}
                </span>
                {row.action}
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  )
}
