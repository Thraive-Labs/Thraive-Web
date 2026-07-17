'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useLoading } from '@/contexts/loading-context'
import SeasonAccentWord from './SeasonAccentWord'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

// Subtle blueprint grid — the "precise/technical" cue behind the hero,
// faded toward the edges so it reads as texture, not a pattern.
function GridBackdrop() {
  return (
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
        maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
      }}
    />
  )
}

// Floating glass chip that overlaps the hero photo's corner — a small,
// tasteful technical/craft flourish (live-feeling status, not decorative).
function StatusChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'absolute',
        left: -20,
        bottom: -20,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-glass)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: 'var(--glass-border)',
        boxShadow: '0 16px 40px -12px rgba(6,9,15,0.35)',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-success)',
          animation: 'soft-pulse 1.8s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Running offline
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          6 products &middot; synced
        </div>
      </div>
    </motion.div>
  )
}

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
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReduced = useReducedMotion()

  // Subtle mouse-follow parallax on the hero photo — desktop only (no
  // mousemove on touch), skipped entirely under prefers-reduced-motion.
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const springX = useSpring(mvX, { stiffness: 80, damping: 20, mass: 0.6 })
  const springY = useSpring(mvY, { stiffness: 80, damping: 20, mass: 0.6 })
  const imageX = useTransform(springX, [-0.5, 0.5], [-10, 10])
  const imageY = useTransform(springY, [-0.5, 0.5], [-8, 8])

  useEffect(() => {
    if (prefersReduced) return
    const el = sectionRef.current
    if (!el) return
    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      mvX.set((e.clientX - rect.left) / rect.width - 0.5)
      mvY.set((e.clientY - rect.top) / rect.height - 0.5)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [prefersReduced, mvX, mvY])

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
      ref={sectionRef}
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
      <GridBackdrop />

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
        className="hero-split"
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '120px 24px',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 56,
          alignItems: 'center',
          textAlign: 'left',
        }}
      >
        <div>
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
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 6vw, 72px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0 14px',
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
                maxWidth: 480,
                margin: '0 0 36px',
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
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
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

        {/* Editorial photo */}
        {started && (
          <motion.div
            className="hero-split-image"
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', x: imageX, y: imageY }}
          >
            <EditorialImage
              src={EDITORIAL_IMAGES.homeHero.src}
              alt={EDITORIAL_IMAGES.homeHero.alt}
              aspectRatio="4 / 5"
              priority
              sizes="(max-width: 900px) 90vw, 480px"
            />
            <StatusChip />
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      {started && <ScrollIndicator />}
    </section>
  )
}
