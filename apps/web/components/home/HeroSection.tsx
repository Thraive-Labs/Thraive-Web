'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useLoading } from '@/contexts/loading-context'
import SeasonAccentWord from './SeasonAccentWord'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

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
        bottom: 16,
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
  const prefersReduced = useReducedMotion()

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
        alignItems: 'flex-start',
        overflow: 'hidden',
      }}
      aria-labelledby="hero-heading"
    >
      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, var(--season-glow), transparent 70%)',
          }}
        />
      )}

      {/* Content — a single row, sized to always fit the first viewport
          instead of stacking text above a visual that can spill past the fold */}
      <div
        className="hero-split"
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '70px 24px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div>
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
              fontSize: 'clamp(38px, 5vw, 60px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.06,
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0 12px',
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
                fontSize: 'clamp(16px, 1.6vw, 18px)',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                maxWidth: 440,
                margin: '0 0 28px',
              }}
            >
              Built for restaurants, pharmacies, retail shops, and garages across
              Sri Lanka. Offline-first, so a power cut is never a crisis.
            </motion.p>
          )}

          {started && (
            <motion.div
              custom={0.8}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
            >
              <Link
                href="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 46,
                  padding: '0 22px',
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
                  height: 46,
                  padding: '0 22px',
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

        {/* Photos — height-capped so the pair always fits within the first
            viewport; never taller than what's actually visible on load */}
        {started && (
          <motion.div
            className="hero-split-image"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', height: 'min(52svh, 460px)', minHeight: 300 }}
          >
            {/* Static frame holds the shadow; the image breathes inside it
                with a slow, near-imperceptible zoom — the one piece of
                ambient motion once the entrance animation settles */}
            <div
              style={{
                height: '100%',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px -20px rgba(6,9,15,0.30), 0 4px 16px rgba(6,9,15,0.10)',
              }}
            >
              <motion.div
                animate={prefersReduced ? undefined : { scale: [1, 1.035, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{ height: '100%' }}
              >
                <EditorialImage
                  src={EDITORIAL_IMAGES.homeHero.src}
                  alt={EDITORIAL_IMAGES.homeHero.alt}
                  priority
                  sizes="(max-width: 900px) 90vw, 560px"
                  style={{ height: '100%', aspectRatio: 'auto', boxShadow: 'none' }}
                />
              </motion.div>
            </div>

            {/* Second, smaller photo overlapping the primary's corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: 'absolute',
                left: '-12%',
                bottom: '-13%',
                width: '48%',
                zIndex: 2,
                padding: 6,
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 24px 56px -18px rgba(6,9,15,0.4)',
              }}
            >
              <EditorialImage
                src={EDITORIAL_IMAGES.homeHeroSecondary.src}
                alt={EDITORIAL_IMAGES.homeHeroSecondary.alt}
                aspectRatio="4 / 5"
                sizes="220px"
                radius="var(--radius-md)"
                style={{ boxShadow: 'none' }}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {started && <ScrollIndicator />}
    </section>
  )
}
