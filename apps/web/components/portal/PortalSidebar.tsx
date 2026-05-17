'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoMark from '@/components/ui/LogoMark'
import { createClient } from '@/lib/supabase/client'

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="9" width="4" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 5l3 3-3 3M6 8h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: <GridIcon /> },
  { label: 'Downloads', href: '/downloads', icon: <DownloadIcon /> },
  { label: 'Billing', href: '/billing', icon: <CardIcon /> },
  { label: 'Settings', href: '/settings', icon: <SettingsIcon /> },
]

interface NavItemProps {
  label: string
  href: string
  icon: React.ReactNode
  isActive: boolean
}

function NavItem({ label, href, icon, isActive }: NavItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: isActive ? '9px 12px 9px 10px' : '9px 12px',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 500,
        marginBottom: 2,
        transition: 'background 150ms, color 150ms',
        background: isActive || hovered ? 'var(--season-glow-soft)' : 'transparent',
        color: isActive ? 'var(--season-accent)' : hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        borderLeft: isActive ? '2px solid var(--season-accent)' : '2px solid transparent',
      }}
    >
      {icon}
      {label}
    </Link>
  )
}

interface PortalSidebarProps {
  displayName?: string
}

export default function PortalSidebar({ displayName }: PortalSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [signOutHovered, setSignOutHovered] = useState(false)
  const [backHovered, setBackHovered] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--bg-subtle)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top section */}
      <div style={{ padding: 20, borderBottom: '1px solid var(--border)' }}>
        {/* Logo row */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            marginBottom: 20,
          }}
        >
          <LogoMark size={22} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Thraive Labs
          </span>
        </Link>

        {/* User info */}
        <div>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            {displayName ?? ' '}
          </p>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--season-accent)',
              background: 'var(--season-glow-soft)',
              border: '1px solid var(--season-card-border)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            Customer
          </span>
        </div>
      </div>

      {/* Nav section */}
      <nav
        aria-label="Portal navigation"
        style={{
          flex: 1,
          padding: '8px 12px',
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          />
        ))}

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--border)',
            margin: '8px 0',
          }}
        />

        {/* Back to site */}
        <Link
          href="/"
          onMouseEnter={() => setBackHovered(true)}
          onMouseLeave={() => setBackHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 2,
            transition: 'background 150ms, color 150ms',
            background: backHovered ? 'var(--season-glow-soft)' : 'transparent',
            color: backHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
            borderLeft: '2px solid transparent',
          }}
        >
          <ArrowLeftIcon />
          Back to site
        </Link>
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          onMouseEnter={() => setSignOutHovered(true)}
          onMouseLeave={() => setSignOutHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: signOutHovered ? 'rgba(239,68,68,0.06)' : 'transparent',
            color: signingOut ? 'var(--text-muted)' : signOutHovered ? '#EF4444' : 'var(--text-muted)',
            fontSize: 14,
            fontWeight: 500,
            cursor: signingOut ? 'wait' : 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'background 150ms, color 150ms',
          }}
        >
          <SignOutIcon />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}
