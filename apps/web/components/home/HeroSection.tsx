'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: 'var(--text-muted)',
        cursor: 'default',
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
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Background radial gradient */}
      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, var(--season-glow), transparent 70%)',
            zIndex: 0,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          textAlign: 'center',
          padding: '120px 24px',
          maxWidth: 720,
          width: '100%',
        }}
      >
        {/* Badge */}
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
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--season-accent)', fontWeight: 600 }}>
              &#10022;
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
              6 products &middot; Built in Sri Lanka
            </span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={containerVariants}
          initial="hidden"
          animate={started ? 'visible' : 'hidden'}
          style={{
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 28,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 16px',
          }}
        >
          {HEADLINE_WORDS.map((w, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{
                display: 'inline-block',
                color: w.accent ? undefined : 'var(--text-primary)',
              }}
            >
              {w.accent
                ? <SeasonAccentWord>{w.text}</SeasonAccentWord>
                : w.text}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtext */}
        {started && (
          <motion.p
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              maxWidth: 540,
              margin: '0 auto 36px',
            }}
          >
            We build software for the businesses that keep Sri Lanka running &mdash; restaurants,
            pharmacies, shops, and more. Offline-first. Built for this market.
          </motion.p>
        )}

        {/* CTA buttons */}
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

      {/* Scroll indicator */}
      {started && <ScrollIndicator />}
    </section>
  )
}
