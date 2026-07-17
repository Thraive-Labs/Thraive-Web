'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useLoading } from '@/contexts/loading-context'
import SeasonAccentWord from './SeasonAccentWord'
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
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        color: 'rgba(255,255,255,0.7)',
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
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: '#05070C',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Full-bleed photo, slow Ken Burns zoom */}
      <motion.div
        aria-hidden="true"
        initial={{ scale: 1 }}
        animate={{ scale: prefersReduced ? 1 : 1.08 }}
        transition={{ duration: 24, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <Image
          src={EDITORIAL_IMAGES.homeHero.src}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </motion.div>

      {/* Technical grid texture over the photo */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)',
        }}
      />

      {/* Scrim — dark at the bottom for text legibility, tinted overall */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background:
            'linear-gradient(to top, rgba(5,7,12,0.92) 0%, rgba(5,7,12,0.55) 38%, rgba(5,7,12,0.25) 65%, rgba(5,7,12,0.15) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '160px 24px 120px',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          {/* Badge */}
          {started && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(255,255,255,0.22)',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-success)',
                  animation: 'soft-pulse 1.8s ease-in-out infinite',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
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
              fontSize: 'clamp(48px, 7.5vw, 96px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.02,
              marginBottom: 28,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0 16px',
            }}
          >
            {HEADLINE_WORDS.map((w, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                style={{
                  display: 'inline-block',
                  color: w.accent ? undefined : '#FFFFFF',
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
                color: 'rgba(255,255,255,0.72)',
                maxWidth: 520,
                margin: '0 0 40px',
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
                  height: 50,
                  padding: '0 26px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFFFF',
                  color: '#05070C',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'transform 150ms, opacity 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(-1px)'
                  el.style.opacity = '0.92'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = ''
                  el.style.opacity = '1'
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
                  height: 50,
                  padding: '0 26px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'transparent',
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'border-color 150ms, background 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(255,255,255,0.7)'
                  el.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(255,255,255,0.35)'
                  el.style.background = 'transparent'
                }}
              >
                Learn more
              </a>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      {started && <ScrollIndicator />}
    </section>
  )
}
