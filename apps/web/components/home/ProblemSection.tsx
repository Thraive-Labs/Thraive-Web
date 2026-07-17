'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const ROWS = [
  { label: 'Table 4 — 2 orders', value: 'LKR 3,400' },
  { label: 'Table 7 — kitchen', value: 'LKR 1,850' },
  { label: 'Delivery — Ranjith', value: 'LKR 2,100' },
  { label: 'Table 12 — bar tab', value: 'LKR 1,000' },
]

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'spin 0.9s linear infinite' }} aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="26 21" />
    </svg>
  )
}

// A real, working UI demo — not a stock photo — that plays through a power
// cut once when scrolled into view: the connection drops, the list freezes,
// then it resyncs. This is the section's "show, don't tell" moment.
function PowerCutDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setSynced(true), prefersReduced ? 0 : 1500)
    return () => clearTimeout(t)
  }, [inView, prefersReduced])

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        boxShadow: '0 28px 64px -24px rgba(6,9,15,0.28)',
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
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-error)', opacity: 0.55 }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.4 }} />
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-success)', opacity: 0.55 }} />
        <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>WildCafe POS</span>
        <div style={{ flex: 1 }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={synced ? 'on' : 'off'}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
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
            <span style={{ fontSize: 11, fontWeight: 700, color: synced ? 'var(--color-success)' : 'var(--color-error)', fontFamily: 'var(--font-mono)' }}>
              {synced ? 'Synced' : 'Offline'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>Open orders</span>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            LKR 8,350
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              animate={{ opacity: synced ? 1 : 0.4 }}
              transition={{ duration: 0.4, delay: synced ? i * 0.06 : 0 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: synced ? 'var(--color-success)' : 'var(--text-muted)' }}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {!synced && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'color-mix(in srgb, var(--bg-card) 70%, transparent)',
                backdropFilter: 'blur(1.5px)',
              }}
            >
              <Spinner />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                Connection lost &mdash; still taking orders
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      style={{
        padding: '96px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SectionLabel>The problem</SectionLabel>
            <h2
              id="problem-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              Business software wasn&rsquo;t built for where you are.
            </h2>

            <blockquote
              style={{
                fontSize: 17,
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                color: 'var(--season-accent)',
                borderLeft: '3px solid var(--season-ambient)',
                paddingLeft: 20,
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              &ldquo;The power went out and we lost three hours of sales data.&rdquo;
            </blockquote>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                fontSize: 16,
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}
            >
              <p>
                Businesses in Sri Lanka face challenges that international software simply
                ignores — unreliable electricity, intermittent internet, and markets that
                work in Sinhala, Tamil, and English all at once.
              </p>
              <p>
                Most businesses still run on paper books because the software they tried
                couldn&rsquo;t handle a power cut, didn&rsquo;t understand LKR, or cost
                more than it saved.
              </p>
            </div>
          </motion.div>

          {/* Right: a real, working demo — not a photo. Plays through a
              power cut once when scrolled into view. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <PowerCutDemo />
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
              A real power cut, mid-shift. Orders keep processing locally — nothing lost
              when the connection drops, nothing to redo when it comes back.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
