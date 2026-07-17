'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LogoMark from '@/components/ui/LogoMark'
import { useTheme } from '@/contexts/theme-context'
import { PRODUCTS } from '@/lib/products'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M9.51 6.77 14.8 1h-1.25L8.95 5.96 5.5 1H1l5.55 7.9L1 15h1.25l4.87-5.24L11.5 15H16L9.51 6.77Zm-1.72 1.86-.56-.8L2.7 1.9h1.93l3.6 5.1.56.8 4.68 6.63h-1.93l-3.75-5.3Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M3.6 5.4H1V15h2.6V5.4ZM2.3 4.2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15 9.3c0-2.6-1.4-3.8-3.2-3.8-1.5 0-2.1.8-2.5 1.4V5.4H6.7c0 .7 0 9.6 0 9.6h2.6v-5.4c0-.3 0-.6.1-.8.2-.6.7-1.2 1.6-1.2 1.1 0 1.6.9 1.6 2.2V15H15V9.3Z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: LinkedInIcon },
  { name: 'X', icon: XIcon },
]

const CURRENT_YEAR = new Date().getFullYear()

const SEASON_NAMES: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
}

export default function Footer() {
  const { mode, toggle } = useTheme()
  const [season, setSeason] = useState<string>('')

  useEffect(() => {
    function readSeason() {
      // Absent when Seasonal FX is off — the easter egg simply doesn't show,
      // rather than falling back to a season that isn't actually active.
      setSeason(document.documentElement.getAttribute('data-season') ?? '')
    }
    const t = setTimeout(readSeason, 0)
    window.addEventListener('season-dev-override', readSeason)
    window.addEventListener('seasonal-fx-change', readSeason)
    return () => {
      clearTimeout(t)
      window.removeEventListener('season-dev-override', readSeason)
      window.removeEventListener('seasonal-fx-change', readSeason)
    }
  }, [])

  const seasonLabel = season ? `${SEASON_NAMES[season] ?? 'Winter'} ${CURRENT_YEAR}` : ''

  const colHeading = (label: string) => (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        color: 'var(--text-muted)',
        marginBottom: 16,
      }}
    >
      {label}
    </p>
  )

  const footerLink = (href: string, label: string) => (
    <li key={href}>
      <a
        href={href}
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          lineHeight: 2,
          transition: 'color 150ms',
          display: 'block',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
      >
        {label}
      </a>
    </li>
  )

  return (
    <footer
      style={{
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '64px 24px 0',
        }}
      >
        {/* Top section — 4 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 40,
            paddingBottom: 48,
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Col 1: Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
              <LogoMark size={24} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                Thraive Labs
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 220, marginBottom: 20 }}>
              Building offline-first, privacy-first business software for Sri Lanka and beyond.
            </p>
            {/* Social links — hrefs are placeholders until real accounts exist */}
            <div style={{ display: 'flex', gap: 8 }}>
              {SOCIAL_LINKS.map(({ name, icon: Icon }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={`Thraive Labs on ${name}`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'border-color 150ms, color 150ms',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--season-ambient)'
                    el.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = 'var(--border)'
                    el.style.color = 'var(--text-muted)'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            {colHeading('Products')}
            <ul style={{ listStyle: 'none' }}>
              {PRODUCTS.map((p) => footerLink(`/products/${p.slug}`, p.name))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            {colHeading('Company')}
            <ul style={{ listStyle: 'none' }}>
              {footerLink('/about', 'About')}
              {footerLink('/blog', 'Blog')}
              {footerLink('/contact', 'Contact')}
            </ul>
          </div>

          {/* Col 4: Legal + Support */}
          <div>
            {colHeading('Legal & Support')}
            <ul style={{ listStyle: 'none' }}>
              {footerLink('/legal/privacy', 'Privacy Policy')}
              {footerLink('/legal/terms', 'Terms of Service')}
              {footerLink('/contact', 'Support')}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            padding: '20px 0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            &copy; {CURRENT_YEAR} Thraive Labs. All rights reserved.
          </p>

          {/* Season indicator — subtle easter egg */}
          <p
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              opacity: 0.6,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
            }}
            aria-hidden="true"
          >
            {seasonLabel}
          </p>

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--season-ambient)'
              el.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = 'var(--border)'
              el.style.color = 'var(--text-muted)'
            }}
          >
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
            <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
