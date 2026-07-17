'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLoading } from '@/contexts/loading-context'
import SeasonAccentWord from './SeasonAccentWord'

const HEADLINE_WORDS = [
  { text: 'Your', accent: false },
  { text: 'business,', accent: false },
  { text: 'built', accent: false },
  { text: 'to', accent: false },
  { text: 'thraive.', accent: true },
]

const STAT_ROW = [
  { label: 'Today', value: 'LKR 84,200' },
  { label: 'Orders', value: '112' },
  { label: 'Uptime', value: '100%' },
]

const TABLE_ROWS = [
  { label: 'WildCafe — Kandy', width: '82%' },
  { label: 'Pharmacy — Colombo', width: '64%' },
  { label: 'SmartPOS — Galle', width: '73%' },
  { label: 'RouteFlow — Jaffna', width: '55%' },
]

// The hero's dominant visual — a generalized dashboard preview, not tied to
// any one product. Real UI craft standing in for a lifestyle photo.
function DashboardMockup() {
  const [synced, setSynced] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setSynced((s) => !s), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        boxShadow: '0 40px 100px -30px rgba(6,9,15,0.35), 0 1px 0 rgba(255,255,255,0.4) inset',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 7,
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-error)', opacity: 0.5 }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.4 }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-success)', opacity: 0.5 }} />
        <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Thraive Dashboard</span>
        <div style={{ flex: 1 }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={synced ? 'on' : 'off'}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: synced ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: synced ? 'var(--color-success)' : 'var(--color-error)',
                animation: synced ? 'soft-pulse 1.8s ease-in-out infinite' : 'none',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: synced ? 'var(--color-success)' : 'var(--color-error)' }}>
              {synced ? 'Synced' : 'Syncing'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr' }}>
        {/* Sidebar */}
        <div
          style={{
            borderRight: '1px solid var(--border)',
            background: 'var(--bg-subtle)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {['Overview', 'Orders', 'Inventory', 'Reports', 'Devices'].map((item, i) => (
            <div
              key={item}
              style={{
                height: 30,
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 12,
                fontSize: 12,
                fontWeight: i === 0 ? 700 : 500,
                color: i === 0 ? 'white' : 'var(--text-secondary)',
                background: i === 0 ? 'var(--season-btn-bg)' : 'transparent',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {STAT_ROW.map((s) => (
              <div key={s.label} style={{ borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-subtle)', padding: '12px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, padding: '0 2px' }}>
            {[38, 52, 44, 68, 58, 80, 62, 90, 70, 96].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: '3px 3px 0 0',
                  background: i === 9 ? 'var(--season-btn-bg)' : 'var(--border)',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TABLE_ROWS.map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', width: 150, flexShrink: 0 }}>{row.label}</span>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: row.width, borderRadius: 3, background: 'var(--season-ambient)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 80) setVisible(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: 'var(--text-muted)',
        cursor: 'default',
        zIndex: 5,
      }}
      aria-hidden="true"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function HeroSection() {
  const { isLoaded } = useLoading()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      const t = setTimeout(() => setStarted(true), 100)
      return () => clearTimeout(t)
    }
  }, [isLoaded])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (delay: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
    }),
  }

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '140px 24px 80px',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Faint grid + soft glow — restrained technical texture, not a photo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 25%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 25%, black 30%, transparent 100%)',
        }}
      />
      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'radial-gradient(ellipse 60% 45% at 50% 10%, var(--season-glow), transparent 70%)',
          }}
        />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: 700, marginBottom: 56 }}>
        {started && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--season-card-border)',
              background: 'var(--season-glow-soft)',
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--season-accent)', fontWeight: 600 }}>&#10022;</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              6 products &middot; Built in Sri Lanka
            </span>
          </motion.div>
        )}

        <motion.h1
          id="hero-heading"
          variants={containerVariants}
          initial="hidden"
          animate={started ? 'visible' : 'hidden'}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 14px',
          }}
        >
          {HEADLINE_WORDS.map((w, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{ display: 'inline-block', color: w.accent ? undefined : 'var(--text-primary)' }}
            >
              {w.accent ? <SeasonAccentWord>{w.text}</SeasonAccentWord> : w.text}
            </motion.span>
          ))}
        </motion.h1>

        {started && (
          <motion.p
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: 480,
              margin: '0 auto 32px',
            }}
          >
            Offline-first business software for restaurants, pharmacies, and shops
            across Sri Lanka. Built for this market.
          </motion.p>
        )}

        {started && (
          <motion.div
            custom={0.8}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 48,
                padding: '0 24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--season-btn-bg)',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 150ms, transform 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--season-btn-hover)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'var(--season-btn-bg)'
                el.style.transform = ''
              }}
            >
              Explore products
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 48,
                padding: '0 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'var(--season-ambient)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              Learn more
            </a>
          </motion.div>
        )}
      </div>

      {/* Dominant visual — the product itself, not a lifestyle photo */}
      {started && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: 920 }}
        >
          <DashboardMockup />
        </motion.div>
      )}

      {started && <ScrollIndicator />}
    </section>
  )
}
