'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Season } from '@/lib/seasonal'
import { useSeasonalFx } from '@/contexts/seasonal-fx-context'

const SEASON_ACCENT: Record<Season, string> = {
  winter: '#0EA5E9',
  spring: '#EC4899',
  summer: '#F59E0B',
  autumn: '#EA580C',
}

// Three-wave infection spots so coverage only completes at blend ≈ 0.75 (end of month).
// Wave 1 (delay 0.02–0.08): first patches appear in the first week
// Wave 2 (delay 0.20–0.38): mid-month spread — infection clearly progressing
// Wave 3 (delay 0.50–0.65): late bloom — fills the last gaps, word fully covered by blend 0.75
const SPOTS = [
  // Wave 1 — early appearance
  { x:  8, y: 42, delay: 0.02, r: 60, xs: 1.20, ys: 0.80 },
  { x: 46, y: 26, delay: 0.03, r: 55, xs: 1.00, ys: 0.90 },
  { x: 79, y: 66, delay: 0.05, r: 58, xs: 0.90, ys: 1.10 },
  { x: 24, y: 74, delay: 0.08, r: 52, xs: 1.10, ys: 0.95 },
  // Wave 2 — mid-month spread
  { x: 63, y: 34, delay: 0.20, r: 62, xs: 1.00, ys: 1.00 },
  { x: 15, y: 56, delay: 0.25, r: 56, xs: 0.85, ys: 1.15 },
  { x: 89, y: 30, delay: 0.30, r: 60, xs: 1.15, ys: 0.90 },
  { x: 51, y: 76, delay: 0.38, r: 54, xs: 1.00, ys: 1.05 },
  // Wave 3 — late bloom, completes coverage at blend 0.75
  { x: 35, y: 50, delay: 0.50, r: 65, xs: 0.95, ys: 1.10 },
  { x: 72, y: 82, delay: 0.55, r: 58, xs: 1.10, ys: 0.85 },
  { x: 20, y: 22, delay: 0.60, r: 62, xs: 0.90, ys: 1.00 },
  { x: 93, y: 52, delay: 0.65, r: 56, xs: 1.00, ys: 1.20 },
]

// Season cycle order — used to detect outgoing vs incoming transitions
const SEASON_ORDER: Season[] = ['winter', 'spring', 'summer', 'autumn']

// Only show infection when secondary is the NEXT season (outgoing month like Feb, May, Aug, Nov).
// Incoming months (Mar, Jun, Sep, Dec) already have the new season as primary — no infection needed.
function isOutgoing(primary: Season, secondary: Season): boolean {
  const pi = SEASON_ORDER.indexOf(primary)
  return SEASON_ORDER[(pi + 1) % 4] === secondary
}

function buildMask(blend: number): string {
  const gradients: string[] = []

  for (const spot of SPOTS) {
    if (blend <= spot.delay) continue

    const progress = Math.min((blend - spot.delay) / (0.75 - spot.delay), 1)
    // Ease-in (power 1.8): slow growth early, accelerates toward the end
    const eased = Math.pow(progress, 1.8)

    const rx = Math.round(eased * spot.r * spot.xs)
    const ry = Math.round(eased * spot.r * spot.ys)
    if (rx <= 0 || ry <= 0) continue

    gradients.push(
      `radial-gradient(ellipse ${rx}px ${ry}px at ${spot.x}% ${spot.y}%, white 50%, transparent 100%)`
    )
  }

  return gradients.length > 0 ? gradients.join(', ') : 'none'
}

function readState(): { primary: Season; secondary: Season | null; blend: number } {
  const html = document.documentElement
  const primary = (html.getAttribute('data-season') ?? 'winter') as Season
  const sec = html.getAttribute('data-secondary-season')
  const secondary = sec && sec.length > 0 ? (sec as Season) : null
  const blend = parseFloat(html.getAttribute('data-season-blend') ?? '0')
  return { primary, secondary, blend }
}

interface Props {
  children: string
  className?: string
  style?: React.CSSProperties
}

export default function SeasonAccentWord({ children, className, style }: Props) {
  const { enabled: fxEnabled } = useSeasonalFx()
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<{ primary: Season; secondary: Season | null; blend: number }>({
    primary: 'winter',
    secondary: null,
    blend: 0,
  })

  useEffect(() => {
    const t = setTimeout(() => {
      setState(readState())
      setMounted(true)
    }, 0)

    const handler = (e: Event) => {
      const next = (e as CustomEvent).detail
      setTimeout(() => {
        setState({
          primary: next.primary as Season,
          secondary: (next.secondary as Season | null) ?? null,
          blend: next.blend as number,
        })
      }, 0)
    }
    window.addEventListener('season-dev-override', handler)
    return () => {
      clearTimeout(t)
      window.removeEventListener('season-dev-override', handler)
    }
  }, [])

  const mask = useMemo(() => {
    if (!mounted || !state.secondary || state.blend <= 0.01) return 'none'
    return buildMask(state.blend)
  }, [mounted, state.secondary, state.blend])

  // Pre-mount, or Seasonal FX off: just the season accent CSS var (luxury
  // default when FX is off), no mask/infection animation.
  if (!mounted || !fxEnabled) {
    return (
      <span className={className} style={{ color: 'var(--season-accent)', ...style }}>
        {children}
      </span>
    )
  }

  const baseColor = SEASON_ACCENT[state.primary]
  const infectionColor = state.secondary ? SEASON_ACCENT[state.secondary] : null
  const hasInfection = infectionColor !== null
    && state.secondary !== null
    && state.blend > 0.01
    && mask !== 'none'
    && isOutgoing(state.primary, state.secondary)

  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-block', ...style }}
    >
      {/* Base layer — current season color, always visible */}
      <span style={{ color: baseColor }}>{children}</span>

      {/* Infection layer — new season color revealed through organic spot mask */}
      {hasInfection && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            color: infectionColor!,
            WebkitMaskImage: mask,
            maskImage: mask,
            // Ensure mask layers union (additive), not intersect
            WebkitMaskComposite: 'source-over',
            maskComposite: 'add',
          }}
        >
          {children}
        </span>
      )}
    </span>
  )
}
