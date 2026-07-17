'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import LogoMark from '@/components/ui/LogoMark'
import { useTheme } from '@/contexts/theme-context'
import { PRODUCTS } from '@/lib/products'
import { createClient } from '@/lib/supabase/client'
import {
  WildCafeIcon, PharmacyIcon, SmartPOSIcon,
  RouteFlowIcon, AutoServIcon, SonaraIcon,
} from '@/components/ui/ProductIcons'

function getProductIcon(slug: string, size: number): React.ReactNode {
  const map: Record<string, React.ReactNode> = {
    wildcafe:  <WildCafeIcon  size={size} />,
    pharmacy:  <PharmacyIcon  size={size} />,
    smartpos:  <SmartPOSIcon  size={size} />,
    routeflow: <RouteFlowIcon size={size} />,
    autoserv:  <AutoServIcon  size={size} />,
    sonara:    <SonaraIcon    size={size} />,
  }
  return map[slug] ?? null
}

function ProductsDropdown({ onClose }: { onClose: () => void }) {

  return (
    <motion.div
      id="products-dropdown"
      initial={{ opacity: 0, scaleY: 0.95, y: -8 }}
      animate={{ opacity: 1, scaleY: 1, y: 0 }}
      exit={{ opacity: 0, scaleY: 0.95, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        transformOrigin: 'top center',
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 480,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 16px 48px rgba(22,19,15,0.18)',
        padding: '12px',
        zIndex: 200,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {PRODUCTS.map((p) => (
          <a
            key={p.slug}
            href={`/products/${p.slug}`}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `${p.accent}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: p.accent,
              }}
            >
              {getProductIcon(p.slug, 18)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                {p.tagline}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div
        style={{
          marginTop: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--border)',
          padding: '8px 12px 4px',
        }}
      >
        <Link
          href="/products"
          onClick={onClose}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--season-accent)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View all products
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <>
          <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export default function Navbar() {
  const { mode, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userInitial, setUserInitial] = useState<string | null>(null)
  const [isStaff, setIsStaff] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setProductsOpen(false); setMobileOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Auth state
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const name = user.user_metadata?.full_name as string | undefined
      setUserInitial((name ?? user.email ?? 'U')[0].toUpperCase())
      const res = await fetch('/api/auth/check-role')
      const { role } = await res.json() as { role: string | null }
      setIsStaff(!!role)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUserInitial(null); setIsStaff(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 64,
          background: 'var(--bg-glass)',
          backdropFilter: 'var(--glass-blur)',
          borderBottom: scrolled ? '1px solid var(--border)' : 'var(--glass-border)',
          transition: 'border-color 200ms ease',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="Thraive Labs home"
          >
            <LogoMark size={28} />
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              Thraive Labs
            </span>
          </Link>

          {/* Desktop nav — center */}
          <div
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}
            className="hidden md:flex"
          >
            {/* Products dropdown trigger */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProductsOpen((o) => !o)}
                onMouseEnter={() => setProductsOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: 'none',
                  color: productsOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 150ms, background 150ms',
                }}
                onMouseLeave={() => {
                  if (!dropdownRef.current?.querySelector(':hover')) {
                    setTimeout(() => setProductsOpen((o) => {
                      if (!dropdownRef.current?.matches(':hover')) return false
                      return o
                    }), 200)
                  }
                }}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                aria-controls="products-dropdown"
              >
                Products
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    transition: 'transform 150ms',
                    transform: productsOpen ? 'rotate(180deg)' : 'none',
                  }}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <ProductsDropdown onClose={() => setProductsOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            {[
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 150ms, background 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--text-primary)'
                  el.style.background = 'var(--bg-subtle)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--text-secondary)'
                  el.style.background = ''
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--bg-subtle)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = ''
                el.style.color = 'var(--text-secondary)'
              }}
            >
              {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Sign in / Profile — hidden on small mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden sm:flex">
              {userInitial ? (
                <Link
                  href={isStaff ? '/admin-dashboard' : '/dashboard'}
                  title={isStaff ? 'Go to admin portal' : 'Go to dashboard'}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--season-btn-bg)',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'background 150ms, transform 150ms',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'var(--season-btn-hover)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'var(--season-btn-bg)'
                    el.style.transform = ''
                  }}
                >
                  {userInitial}
                </Link>
              ) : (
                <>
                  <a
                    href="/login"
                    style={{
                      padding: '6px 12px',
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      transition: 'color 150ms, background 150ms',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = 'var(--text-primary)'
                      el.style.background = 'var(--bg-subtle)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.color = 'var(--text-secondary)'
                      el.style.background = ''
                    }}
                  >
                    Sign in
                  </a>
                  <Link
                    href="/products"
                    style={{
                      padding: '6px 14px',
                      height: 36,
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--season-btn-bg)',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'background 150ms, transform 150ms',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'var(--season-btn-hover)'
                      el.style.transform = 'translateY(-1px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = 'var(--season-btn-bg)'
                      el.style.transform = ''
                    }}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex md:hidden"
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile side panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(22, 19, 15, 0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                zIndex: 150,
              }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              role="dialog"
              aria-label="Navigation menu"
              aria-modal="true"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 'min(320px, calc(100vw - 40px))',
                zIndex: 151,
                background: 'var(--bg-card)',
                borderLeft: '1px solid var(--season-card-border)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Seasonal glow behind header */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 200,
                  background: 'radial-gradient(ellipse 120% 100% at 50% 0%, var(--season-glow), transparent)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              {/* Top accent line */}
              <div
                aria-hidden="true"
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, var(--season-ambient), transparent)',
                  flexShrink: 0,
                }}
              />

              {/* Panel header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  position: 'relative',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                  aria-label="Thraive Labs home"
                >
                  <LogoMark size={26} />
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                    Thraive Labs
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Scrollable nav content */}
              <nav
                aria-label="Mobile navigation"
                style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}
              >
                {/* Nav links */}
                <div style={{ padding: '4px 10px 16px' }}>
                  {[
                    { label: 'Products', href: '/products' },
                    { label: 'About', href: '/about' },
                    { label: 'Blog', href: '/blog' },
                    { label: 'Contact', href: '/contact' },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: 15,
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'background 150ms, color 150ms',
                        marginBottom: 2,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = 'var(--season-glow-soft)'
                        el.style.color = 'var(--season-accent)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement
                        el.style.background = ''
                        el.style.color = 'var(--text-primary)'
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border)', margin: '0 18px 16px' }} />

                {/* Products mini-grid */}
                <div style={{ padding: '0 18px 20px' }}>
                  <p style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 10,
                  }}>
                    Products
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {PRODUCTS.map((p) => (
                      <a
                        key={p.slug}
                        href={`/products/${p.slug}`}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '9px 10px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg)',
                          textDecoration: 'none',
                          transition: 'border-color 150ms, background 150ms',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.borderColor = 'var(--season-card-border)'
                          el.style.background = 'var(--season-glow-soft)'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.borderColor = 'var(--border)'
                          el.style.background = 'var(--bg)'
                        }}
                      >
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          background: `${p.accent}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: p.accent,
                          flexShrink: 0,
                        }}>
                          {getProductIcon(p.slug, 14)}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {p.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </nav>

              {/* Panel footer */}
              <div
                style={{
                  padding: '14px 18px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'border-color 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--season-ambient)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                >
                  Sign in
                </a>
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    background: 'var(--season-btn-bg)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-hover)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-bg)' }}
                >
                  Get started
                </Link>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <button
                    onClick={toggle}
                    aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '5px 10px',
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
