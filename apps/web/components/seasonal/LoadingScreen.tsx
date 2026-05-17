'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Season, TimeOfDay } from '@/lib/seasonal'
// import AuraLayer from './AuraLayer'
import ParticleCanvas from './ParticleCanvas'

interface LoadingScreenProps {
  onComplete: () => void
  season: Season
  timeOfDay: TimeOfDay
  month: number
  blend: number
  secondary: Season | null
  darkMode?: boolean
}

type LoadState = 'animating' | 'ready' | 'exiting'

const THRAIVE_LETTERS = ['T', 'h', 'r', 'a', 'i', 'v', 'e']
const LABS_LETTERS = ['L', 'a', 'b', 's']
const MIN_DISPLAY_MS = 2500
const MAX_DISPLAY_MS = 8000

// The [◈] logomark as SVG
function LogoMark({ glowing }: { glowing: boolean }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{
        filter: glowing
          ? 'drop-shadow(0 0 12px var(--color-brand-bright)) drop-shadow(0 0 24px var(--color-brand-dim))'
          : 'none',
        transition: 'filter 400ms ease',
      }}
    >
      {/* Outer diamond */}
      <path
        d="M24 4 L44 24 L24 44 L4 24 Z"
        stroke="var(--color-brand-bright)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Inner diamond */}
      <path
        d="M24 12 L36 24 L24 36 L12 24 Z"
        stroke="var(--color-brand)"
        strokeWidth="1"
        fill="rgba(124,58,237,0.12)"
      />
      {/* Center dot */}
      <circle cx="24" cy="24" r="3" fill="var(--color-brand-bright)" />
      {/* Corner accents */}
      <circle cx="24" cy="4" r="1.5" fill="var(--color-brand)" />
      <circle cx="44" cy="24" r="1.5" fill="var(--color-brand)" />
      <circle cx="24" cy="44" r="1.5" fill="var(--color-brand)" />
      <circle cx="4" cy="24" r="1.5" fill="var(--color-brand)" />
    </svg>
  )
}

export default function LoadingScreen({
  onComplete,
  season,
  timeOfDay,
  month,
  blend,
  secondary,
}: LoadingScreenProps) {
  const [loadState, setLoadState] = useState<LoadState>('animating')
  const [logoGlowing, setLogoGlowing] = useState(false)
  const prefersReduced = useReducedMotion()

  const [startTime] = useState<number>(() => Date.now())
  const pageReadyRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  // Track page readiness
  useEffect(() => {
    const markReady = () => { pageReadyRef.current = true }
    if (document.readyState === 'complete') {
      markReady()
    } else {
      window.addEventListener('load', markReady, { once: true })
      return () => { window.removeEventListener('load', markReady) }
    }
  }, [])

  const beginExit = useCallback(() => {
    setLoadState('exiting')
    setTimeout(() => {
      onCompleteRef.current()
    }, 500)
  }, [])

  // Glow pulse at 2000ms
  useEffect(() => {
    const t = setTimeout(() => setLogoGlowing(true), 2000)
    return () => { clearTimeout(t) }
  }, [])

  // Minimum display timer + readiness check
  useEffect(() => {
    const checkReady = () => {
      const elapsed = Date.now() - startTime
      const waited = elapsed >= MIN_DISPLAY_MS
      if (waited && pageReadyRef.current) {
        beginExit()
      }
    }

    const minTimer = setTimeout(() => {
      checkReady()
    }, MIN_DISPLAY_MS)

    const maxTimer = setTimeout(() => {
      beginExit()
    }, MAX_DISPLAY_MS)

    // Poll for page ready
    const poll = setInterval(checkReady, 100)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
      clearInterval(poll)
    }
  }, [beginExit, startTime])

  const isExiting = loadState === 'exiting'

  if (prefersReduced) {
    // Simple fade for reduced motion
    return (
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            key="loading-reduced"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              background: 'var(--bg)',
              gap: '16px',
            }}
          >
            <LogoMark glowing={false} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
              }}>
                Thraive
              </span>
              <span style={{
                fontSize: '18px',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}>
                Labs
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'var(--bg)',
            gap: '24px',
          }}
        >
          {/* Layer 1: Particles */}
          <ParticleCanvas
            season={season}
            timeOfDay={timeOfDay}
            month={month}
            blend={blend}
            secondary={secondary}
          />

          {/* Layer 2: Aura — temporarily disabled */}
          {/* <AuraLayer
            season={season}
            mode="loading"
            intensityTarget={auraIntensity}
          /> */}

          {/* Layer 3: Logo */}
          <div
            style={{
              position: 'relative',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Logo mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <LogoMark glowing={logoGlowing} />
            </motion.div>

            {/* Wordmark */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {/* "Thraive" — letters stagger from left */}
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                {THRAIVE_LETTERS.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + i * 0.03,
                      ease: 'easeOut',
                    }}
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      display: 'inline-block',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* "Labs" — letters stagger from right */}
              <div style={{ display: 'flex', overflow: 'hidden' }}>
                {LABS_LETTERS.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.9 + i * 0.03,
                      ease: 'easeOut',
                    }}
                    style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      display: 'inline-block',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              style={{
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Thraive to the next level
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
