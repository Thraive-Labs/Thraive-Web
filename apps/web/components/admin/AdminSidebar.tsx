'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  roles?: string[]
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      {
        href: '/admin-dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Customers',
    items: [
      {
        href: '/customers',
        label: 'Customers',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: '/licenses',
        label: 'Licenses',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: '/devices',
        label: 'Devices',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="4" y="1" width="8" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="12" r="0.75" fill="currentColor" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Revenue',
    items: [
      {
        href: '/payments',
        label: 'Payments',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        href: '/subscriptions',
        label: 'Subscriptions',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8a6 6 0 1 1 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 8a6 6 0 0 1-12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        href: '/admin-products',
        label: 'Products',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1L15 5v6l-7 4-7-4V5l7-4z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 9V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        href: '/app-versions',
        label: 'App Versions',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 12l2-5 3 3 2-4 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        href: '/staff',
        label: 'Staff',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 6v4M14 8h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
        roles: ['superadmin'],
      },
      {
        href: '/audit-log',
        label: 'Audit Log',
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 4h10M3 8h7M3 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
]

interface Props {
  staffName: string
  staffRole: string
}

export default function AdminSidebar({ staffName, staffRole }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin-login')
  }

  const roleLabel =
    staffRole === 'superadmin'
      ? 'Super Admin'
      : staffRole.charAt(0).toUpperCase() + staffRole.slice(1)

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        height: '100vh',
        background: '#0D0D0F',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M20 4L36 13V27L20 36L4 27V13L20 4Z" stroke="#6366F1" strokeWidth="2" fill="none" />
          <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" fill="#6366F1" opacity="0.4" />
        </svg>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>Thraive Labs</p>
          <p style={{ fontSize: 10, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px' }} aria-label="Admin navigation">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.roles || item.roles.includes(staffRole)
          )
          if (visibleItems.length === 0) return null
          return (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#4B5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '8px 8px 4px',
                }}
              >
                {section.label}
              </p>
              {visibleItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#F9FAFB' : '#6B7280',
                      background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'background 100ms, color 100ms',
                      borderLeft: active ? '2px solid #6366F1' : '2px solid transparent',
                      marginLeft: -2,
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Bottom: user + sign out */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#818CF8',
              flexShrink: 0,
            }}
          >
            {staffName.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {staffName}
            </p>
            <p style={{ fontSize: 11, color: '#4B5563' }}>{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            width: '100%',
            height: 34,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: signingOut ? '#4B5563' : '#9CA3AF',
            fontSize: 13,
            fontWeight: 500,
            cursor: signingOut ? 'not-allowed' : 'pointer',
            transition: 'color 150ms, border-color 150ms',
          }}
          onMouseEnter={(e) => {
            if (!signingOut) {
              (e.currentTarget as HTMLElement).style.color = '#EF4444'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!signingOut) {
              (e.currentTarget as HTMLElement).style.color = '#9CA3AF'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
            }
          }}
        >
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
