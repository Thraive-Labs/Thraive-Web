'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSeasonState, type SeasonState, type TimeOfDay } from '@/lib/seasonal'
import { useSeasonalFx } from '@/contexts/seasonal-fx-context'

// ─── constants ───────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const SEASON_FOR_MONTH: Record<number, string> = {
  1: 'winter', 2: 'winter', 3: 'spring', 4: 'spring',
  5: 'spring', 6: 'summer', 7: 'summer', 8: 'summer',
  9: 'autumn', 10: 'autumn', 11: 'autumn', 12: 'winter',
}

const SEASON_ACCENT: Record<string, string> = {
  winter: '#0EA5E9',
  spring: '#EC4899',
  summer: '#F59E0B',
  autumn: '#EA580C',
}

const SEASON_NAMES: Record<string, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
}

const TIME_OPTIONS: { label: string; sublabel: string; hour: number; color: string }[] = [
  { label: 'Dawn',      sublabel: '5am',  hour: 5,  color: '#FBBF24' },
  { label: 'Morning',   sublabel: '8am',  hour: 8,  color: '#93C5FD' },
  { label: 'Afternoon', sublabel: '1pm',  hour: 13, color: '#60A5FA' },
  { label: 'Golden',    sublabel: '5pm',  hour: 17, color: '#FB923C' },
  { label: 'Evening',   sublabel: '8pm',  hour: 20, color: '#A78BFA' },
  { label: 'Night',     sublabel: '11pm', hour: 23, color: '#4338CA' },
]

const SPEEDS = [
  { label: 'Slow', ms: 2800 },
  { label: 'Med',  ms: 1000 },
  { label: 'Fast', ms: 350  },
]

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildSeasonState(month: number, day: number, hour: number): SeasonState {
  const date = new Date(2026, month - 1, day, hour, 0, 0)
  const darkMode =
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-mode') !== 'light'
      : true
  return getSeasonState(date, darkMode)
}

function dispatch(state: SeasonState) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('season-dev-override', { detail: state }))
  }
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  )
}

function PanelDivider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
}

// ─── main panel ──────────────────────────────────────────────────────────────

function getStoredParticlePercent(): number {
  if (typeof window === 'undefined') return 50
  try {
    const val = localStorage.getItem('particle-multiplier')
    return val ? Math.round(parseFloat(val) * 100) : 50
  } catch { return 50 }
}

export default function SeasonDevPanel() {
  const now = new Date()
  const { enabled: fxEnabled, setEnabled: setFxEnabled } = useSeasonalFx()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [day, setDay] = useState(15)
  const [hour, setHour] = useState(now.getHours())
  const [isPlaying, setIsPlaying] = useState(false)
  const [cycleBy, setCycleBy] = useState<'month' | 'hour'>('month')
  const [speedIdx, setSpeedIdx] = useState(1)
  const [particlePercent, setParticlePercent] = useState(50)

  useEffect(() => {
    const t = setTimeout(() => setParticlePercent(getStoredParticlePercent()), 0)
    return () => clearTimeout(t)
  }, [])

  function applyParticleCount(percent: number) {
    setParticlePercent(percent)
    const multiplier = percent / 100
    try { localStorage.setItem('particle-multiplier', multiplier.toString()) } catch {}
    window.dispatchEvent(new CustomEvent('particle-count-override', { detail: multiplier }))
  }

  // Stable refs for interval closure — synced in effects, never in render
  const monthRef = useRef(month)
  const hourRef = useRef(hour)
  const dayRef = useRef(day)
  const isPlayingRef = useRef(isPlaying)

  useEffect(() => { monthRef.current = month }, [month])
  useEffect(() => { hourRef.current = hour }, [hour])
  useEffect(() => { dayRef.current = day }, [day])
  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])

  const applyState = useCallback((m: number, d: number, h: number) => {
    dispatch(buildSeasonState(m, d, h))
  }, [])

  // Apply whenever controls change (skip during auto-play — it dispatches inline)
  useEffect(() => {
    if (!isPlayingRef.current) {
      applyState(month, day, hour)
    }
  }, [month, day, hour, applyState])

  // Auto-cycle
  useEffect(() => {
    if (!isPlaying) return
    const { ms } = SPEEDS[speedIdx]
    const id = setInterval(() => {
      if (cycleBy === 'month') {
        const next = (monthRef.current % 12) + 1
        setMonth(next)
        applyState(next, dayRef.current, hourRef.current)
      } else {
        const next = (hourRef.current + 1) % 24
        setHour(next)
        applyState(monthRef.current, dayRef.current, next)
      }
    }, ms)
    return () => clearInterval(id)
  }, [isPlaying, speedIdx, cycleBy, applyState])

  const currentSeason = SEASON_FOR_MONTH[month]
  const accent = SEASON_ACCENT[currentSeason]
  const liveState = buildSeasonState(month, day, hour)

  const maxDay = new Date(2026, month, 0).getDate()

  return (
    <>
      {/* Floating pill — always visible */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(true)}
            aria-label="Open season dev panel"
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 9990,
              height: 34,
              padding: '0 12px',
              borderRadius: 17,
              background: 'var(--bg-card)',
              border: `1px solid ${accent}50`,
              boxShadow: `0 2px 12px rgba(0,0,0,0.25), 0 0 0 1px ${accent}15`,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Pulsing dot */}
            <div style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: fxEnabled ? accent : 'var(--text-muted)',
                  animation: fxEnabled && isPlaying ? 'dev-pulse 1.2s ease-in-out infinite' : 'none',
                }}
              />
              {fxEnabled && isPlaying && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    background: accent,
                    opacity: 0,
                    animation: 'dev-ring 1.2s ease-in-out infinite',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
              }}
            >
              {fxEnabled ? `${SEASON_NAMES[currentSeason]} · ${MONTHS[month - 1]}` : 'Seasonal FX · Off'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel + backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — transparent, click-to-close only */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9990,
                background: 'transparent',
              }}
            />

            {/* Slide-in panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: 272,
                height: '100dvh',
                zIndex: 9991,
                background: 'var(--bg-card)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-16px 0 48px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* ── Header ── */}
              <div
                style={{
                  padding: '14px 14px 12px',
                  borderBottom: '1px solid var(--border)',
                  flexShrink: 0,
                  position: 'sticky',
                  top: 0,
                  background: 'var(--bg-card)',
                  zIndex: 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: accent,
                        boxShadow: `0 0 6px ${accent}`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Season Dev
                    </span>
                    {isPlaying && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: accent,
                          background: `${accent}18`,
                          padding: '2px 6px',
                          borderRadius: 4,
                          border: `1px solid ${accent}30`,
                        }}
                      >
                        playing
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close panel"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Live state */}
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    lineHeight: 1.9,
                    color: 'var(--text-muted)',
                    background: 'var(--bg-subtle)',
                    borderRadius: 6,
                    padding: '8px 10px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.5 }}>season</span>{' '}
                    <span style={{ color: accent, fontWeight: 700 }}>{liveState.primary}</span>
                    {liveState.secondary && (
                      <span style={{ opacity: 0.6 }}>
                        {' '}+ {liveState.secondary} {Math.round(liveState.blend * 100)}%
                      </span>
                    )}
                  </div>
                  <div>
                    <span style={{ opacity: 0.5 }}>time</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{liveState.timeOfDay}</span>
                    <span style={{ opacity: 0.5 }}> · {String(hour).padStart(2, '0')}:00</span>
                  </div>
                  <div>
                    <span style={{ opacity: 0.5 }}>date</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {MONTHS[month - 1]} {day}
                    </span>
                  </div>
                  <div>
                    <span style={{ opacity: 0.5 }}>depth</span>{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{liveState.depth.toFixed(2)}</span>
                    <span style={{ opacity: 0.5 }}> · {Math.round(liveState.depth * 100)}% particles</span>
                  </div>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Seasonal FX on/off — demo-mode master switch */}
                <div>
                  <SectionTitle>Seasonal FX</SectionTitle>
                  <button
                    onClick={() => setFxEnabled(!fxEnabled)}
                    style={{
                      width: '100%',
                      height: 36,
                      borderRadius: 8,
                      border: fxEnabled ? `1.5px solid ${accent}` : '1px solid var(--border)',
                      background: fxEnabled ? `${accent}18` : 'var(--bg-subtle)',
                      color: fxEnabled ? accent : 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 150ms',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 16,
                        borderRadius: 8,
                        background: fxEnabled ? accent : 'var(--border)',
                        position: 'relative',
                        transition: 'background 150ms',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 2,
                          left: fxEnabled ? 14 : 2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: 'white',
                          transition: 'left 150ms',
                        }}
                      />
                    </div>
                    {fxEnabled ? 'On — particles active' : 'Off — luxury default'}
                  </button>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                    Controls apply to particles, accumulation, and season color below only while on.
                  </p>
                </div>

                <PanelDivider />

                {/* Month grid */}
                <div>
                  <SectionTitle>Month</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                    {MONTHS.map((name, i) => {
                      const m = i + 1
                      const mSeason = SEASON_FOR_MONTH[m]
                      const mAccent = SEASON_ACCENT[mSeason]
                      const isActive = m === month
                      return (
                        <button
                          key={m}
                          onClick={() => setMonth(m)}
                          style={{
                            height: 32,
                            borderRadius: 6,
                            border: isActive ? `1.5px solid ${mAccent}` : '1px solid var(--border)',
                            background: isActive ? `${mAccent}18` : 'transparent',
                            color: isActive ? mAccent : 'var(--text-muted)',
                            fontSize: 11,
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 120ms',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <PanelDivider />

                {/* Day slider */}
                <div>
                  <SectionTitle>
                    Day &mdash; {day}{' '}
                    {liveState.secondary && liveState.blend > 0.02 && (
                      <span style={{ color: accent, textTransform: 'none', letterSpacing: 0 }}>
                        ({Math.round(liveState.blend * 100)}% blend)
                      </span>
                    )}
                  </SectionTitle>
                  <input
                    type="range"
                    min={1}
                    max={maxDay}
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    style={{ width: '100%', accentColor: accent }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>1</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{maxDay}</span>
                  </div>
                </div>

                <PanelDivider />

                {/* Time of day */}
                <div>
                  <SectionTitle>Time of Day</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                    {TIME_OPTIONS.map((t) => {
                      const isActive = liveState.timeOfDay === t.label.toLowerCase() as TimeOfDay
                      return (
                        <button
                          key={t.label}
                          onClick={() => setHour(t.hour)}
                          style={{
                            padding: '6px 4px',
                            borderRadius: 6,
                            border: isActive ? `1.5px solid ${t.color}` : '1px solid var(--border)',
                            background: isActive ? `${t.color}18` : 'transparent',
                            color: isActive ? t.color : 'var(--text-muted)',
                            fontSize: 10,
                            fontWeight: isActive ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 120ms',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            lineHeight: 1.2,
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{t.label}</span>
                          <span style={{ fontSize: 9, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>{t.sublabel}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Hour slider */}
                  <div style={{ marginTop: 10 }}>
                    <input
                      type="range"
                      min={0}
                      max={23}
                      value={hour}
                      onChange={(e) => setHour(Number(e.target.value))}
                      style={{ width: '100%', accentColor: TIME_OPTIONS.find(t => liveState.timeOfDay === t.label.toLowerCase())?.color ?? '#7C3AED' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>0:00</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{String(hour).padStart(2, '0')}:00</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>23:00</span>
                    </div>
                  </div>
                </div>

                <PanelDivider />

                {/* Auto cycle */}
                <div>
                  <SectionTitle>Auto Cycle</SectionTitle>

                  {/* Cycle by */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {(['month', 'hour'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setCycleBy(mode)}
                        style={{
                          flex: 1,
                          height: 28,
                          borderRadius: 6,
                          border: cycleBy === mode ? `1.5px solid ${accent}` : '1px solid var(--border)',
                          background: cycleBy === mode ? `${accent}18` : 'transparent',
                          color: cycleBy === mode ? accent : 'var(--text-muted)',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 120ms',
                          textTransform: 'capitalize',
                        }}
                      >
                        by {mode}
                      </button>
                    ))}
                  </div>

                  {/* Speed */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                    {SPEEDS.map((s, i) => (
                      <button
                        key={s.label}
                        onClick={() => setSpeedIdx(i)}
                        style={{
                          flex: 1,
                          height: 26,
                          borderRadius: 6,
                          border: speedIdx === i ? '1.5px solid var(--text-muted)' : '1px solid var(--border)',
                          background: speedIdx === i ? 'var(--bg-subtle)' : 'transparent',
                          color: speedIdx === i ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 120ms',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Play / Pause */}
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    style={{
                      width: '100%',
                      height: 36,
                      borderRadius: 8,
                      border: isPlaying ? `1.5px solid ${accent}` : '1px solid var(--border)',
                      background: isPlaying ? accent : 'transparent',
                      color: isPlaying ? 'white' : 'var(--text-secondary)',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      transition: 'all 150ms',
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
                          <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 1.5l9 4.5-9 4.5V1.5Z" fill="currentColor" />
                        </svg>
                        Play cycle
                      </>
                    )}
                  </button>
                </div>

                <PanelDivider />

                {/* Particle count */}
                <div>
                  <SectionTitle>Particles &middot; {particlePercent}%</SectionTitle>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={particlePercent}
                    onChange={(e) => applyParticleCount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: accent }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>none</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>full</span>
                  </div>
                </div>

                <PanelDivider />

                {/* Reset */}
                <button
                  onClick={() => {
                    const now2 = new Date()
                    const m = now2.getMonth() + 1
                    const h = now2.getHours()
                    const d = now2.getDate()
                    setMonth(m)
                    setDay(d)
                    setHour(h)
                    setIsPlaying(false)
                    applyState(m, d, h)
                  }}
                  style={{
                    width: '100%',
                    height: 30,
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'color 120ms',
                  }}
                >
                  Reset to now
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keyframes for pulsing dot */}
      <style>{`
        @keyframes dev-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes dev-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}
