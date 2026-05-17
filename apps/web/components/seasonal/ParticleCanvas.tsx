'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Season, TimeOfDay } from '@/lib/seasonal'
import { getPrimaryFade } from '@/lib/seasonal'
import { PARTICLE_CONFIGS, drawParticleShape, getParticleColors, getMonthOverrides, BUTTERFLY } from '@/lib/particles'

interface FallingParticle {
  x: number
  y: number
  size: number
  opacity: number
  speedY: number
  speedX: number  // sway base speed
  swayPhase: number
  swayAmount: number
  swaySpeed: number
  rotation: number
  rotationSpeed: number
  shape: string | null
  age: number
  bounceY: number
  bouncing: boolean
  bounceTick: number
  spawnFromTop: boolean
  maxAge: number  // 0 = immortal (respawn), >0 = fades out and expires
}

interface DustTrail {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  maxAge: number
  size: number
  color: string
}

interface RainDrop {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

interface Firefly {
  x: number
  y: number
  phase: number
  blinkSpeed: number
  driftX: number
  driftY: number
  size: number
}

interface ParticleCanvasProps {
  season: Season
  timeOfDay: TimeOfDay
  month: number
  blend: number
  secondary: Season | null
  depth?: number
  onParticleLand?: (x: number, size: number) => void
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function spawnParticle(
  season: Season,
  month: number,
  canvasW: number,
  canvasH: number,
): FallingParticle {
  const cfg = PARTICLE_CONFIGS[season]
  const overrides = getMonthOverrides(season, month)
  const shape = randItem(overrides.shapes)
  const size = rand(overrides.sizeRange[0], overrides.sizeRange[1])
  const spawnFromTop = overrides.spawnFromTop ?? cfg.spawnFromTop
  const swayAmount = overrides.swayAmount ?? cfg.swayAmount
  const swaySpeed = overrides.swaySpeed ?? cfg.swaySpeed
  const opacityRange = overrides.opacityRange ?? cfg.opacityRange
  const rotationSpeedRange = overrides.rotationSpeed ?? cfg.rotationSpeed

  let y: number
  if (spawnFromTop) {
    y = -size - Math.random() * canvasH * 0.3
  } else {
    // summer dust: spawn from bottom, drift up
    y = canvasH + size + Math.random() * canvasH * 0.3
  }

  return {
    x: rand(-size, canvasW + size),
    y,
    size,
    opacity: rand(opacityRange[0], opacityRange[1]),
    speedY: rand(overrides.fallSpeed[0], overrides.fallSpeed[1]),
    speedX: rand(-swayAmount * 0.5, swayAmount * 0.5),
    swayPhase: rand(0, Math.PI * 2),
    swayAmount,
    swaySpeed,
    rotation: rand(0, 360),
    rotationSpeed: rand(rotationSpeedRange[0], rotationSpeedRange[1]),
    shape,
    age: 0,
    bounceY: 0,
    bouncing: false,
    bounceTick: 0,
    spawnFromTop,
    maxAge: overrides.maxAge ?? 0,
  }
}

function spawnRainDrop(canvasW: number, canvasH: number): RainDrop {
  return {
    x: rand(0, canvasW + 100),
    y: rand(-20, canvasH * 0.3),
    length: rand(8, 20),
    speed: rand(200, 300),
    opacity: rand(0.1, 0.25),
  }
}

function spawnFirefly(canvasW: number, canvasH: number, fullScreen = false): Firefly {
  return {
    x: rand(0, canvasW),
    y: fullScreen ? rand(canvasH * 0.15, canvasH * 0.9) : rand(canvasH * 0.4, canvasH),
    phase: rand(0, Math.PI * 2),
    blinkSpeed: rand(0.4, 1.2),
    driftX: rand(-10, 10),
    driftY: rand(-5, 5),
    size: rand(3, 7),
  }
}

function getStoredMultiplier(): number {
  if (typeof window === 'undefined') return 0.5
  try {
    const val = localStorage.getItem('particle-multiplier')
    return val ? Math.max(0, Math.min(2, parseFloat(val))) : 0.5
  } catch { return 0.5 }
}

export default function ParticleCanvas({
  season,
  timeOfDay,
  month,
  blend,
  secondary,
  depth = 1,
  onParticleLand,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FallingParticle[]>([])
  const secondaryParticlesRef = useRef<FallingParticle[]>([])
  const rainRef = useRef<RainDrop[]>([])
  const firefliesRef = useRef<Firefly[]>([])
  const dustTrailRef = useRef<DustTrail[]>([])
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef(0)
  const reducedMotion = useRef(false)
  const particleMultiplierRef = useRef(getStoredMultiplier())
  const depthRef = useRef(depth)

  useEffect(() => { depthRef.current = depth }, [depth])

  const hasRain = season === 'autumn' && (month === 10 || month === 11) || blend > 0.15
  const hasFireflies = season === 'summer' && (
    timeOfDay === 'night' ||
    (month === 6 && timeOfDay === 'evening')
  )

  const initParticles = useCallback((w: number, h: number) => {
    const cfg = PARTICLE_CONFIGS[season]
    const overrides = getMonthOverrides(season, month)
    const liveBlend = typeof document !== 'undefined'
      ? parseFloat(document.documentElement.getAttribute('data-season-blend') ?? '0')
      : 0
    const fade = getPrimaryFade(month, liveBlend)
    const count = Math.floor((overrides.count ?? cfg.count) * particleMultiplierRef.current * depthRef.current * fade)
    particlesRef.current = Array.from({ length: count }, () => {
      const p = spawnParticle(season, month, w, h)
      p.y = rand(0, h)
      return p
    })
    secondaryParticlesRef.current = []
    dustTrailRef.current = []

    if (hasRain) {
      rainRef.current = Array.from({ length: 100 }, () => spawnRainDrop(w, h))
    }
    if (hasFireflies) {
      const isJune = month === 6
      const count = isJune ? 24 : 15
      firefliesRef.current = Array.from({ length: count }, () => spawnFirefly(w, h, isJune))
    }
  }, [season, month, hasRain, hasFireflies])

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      particleMultiplierRef.current = (e as CustomEvent<number>).detail
    }
    window.addEventListener('particle-count-override', handler)
    return () => window.removeEventListener('particle-count-override', handler)
  }, [])

  // Fade canvas opacity as user scrolls past the hero — particles remain
  // visible as a subtle overlay rather than disappearing entirely.
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const onScroll = () => {
      const hero = window.innerHeight
      const t = Math.min(window.scrollY / hero, 1)
      el.style.opacity = (1 - t * 0.78).toFixed(3)  // 1.0 → ~0.22
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion.current) {
      return () => { window.removeEventListener('resize', resize) }
    }

    const cfg = PARTICLE_CONFIGS[season]
    const monthOverrides = getMonthOverrides(season, month)
    const baseCount = monthOverrides.count ?? cfg.count

    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = timestamp

      const w = canvas.width
      const h = canvas.height

      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, w, h)

      const t = timestamp / 1000

      // --- Rain ---
      if (hasRain) {
        ctx.save()
        ctx.strokeStyle = 'rgba(148,163,184,0.35)'
        ctx.lineWidth = 1
        for (const drop of rainRef.current) {
          drop.y += drop.speed * dt
          drop.x -= drop.speed * 0.36 * dt  // 70° angle

          if (drop.y > h + 20) {
            drop.x = rand(0, w + 100)
            drop.y = rand(-20, h * 0.3)
          }

          ctx.globalAlpha = drop.opacity
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x - drop.length * 0.36, drop.y + drop.length)
          ctx.stroke()
        }
        ctx.restore()
      }

      // --- Fireflies ---
      if (hasFireflies) {
        for (const fly of firefliesRef.current) {
          fly.x += fly.driftX * dt
          fly.y += fly.driftY * dt
          fly.phase += fly.blinkSpeed * dt

          if (fly.x < 0) fly.x = w
          if (fly.x > w) fly.x = 0
          if (fly.y < h * 0.4) fly.driftY = Math.abs(fly.driftY)
          if (fly.y > h) fly.driftY = -Math.abs(fly.driftY)

          const blink = (Math.sin(fly.phase) + 1) * 0.5
          if (blink < 0.05) continue

          ctx.save()
          ctx.globalAlpha = blink * 0.8
          ctx.shadowColor = '#86EFAC'
          ctx.shadowBlur = fly.size * 4 * blink
          ctx.fillStyle = '#86EFAC'
          ctx.beginPath()
          ctx.arc(fly.x, fly.y, fly.size * 0.5 * blink, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // --- Falling particles ---
      const toRemove: number[] = []

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]
        const sway = Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmount * 0.5

        p.age += dt
        p.y += p.speedY * dt
        p.x += (sway + p.speedX * 0.1) * dt
        if (p.shape !== BUTTERFLY) p.rotation += p.rotationSpeed * dt

        // Bounce animation on landing
        if (p.bouncing) {
          p.bounceTick += dt
          const bt = p.bounceTick / 0.15
          p.bounceY = bt < 1 ? Math.sin(bt * Math.PI) * p.size * 0.2 : 0
          if (p.bounceTick > 0.15) { p.bouncing = false; p.bounceY = 0 }
        }

        // Per-particle direction determines landing boundary
        const landed = p.spawnFromTop ? p.y > h + p.size : p.y < -p.size
        const expired = p.maxAge > 0 && p.age >= p.maxAge

        if (p.x < -100 || p.x > w + 100 || landed || expired) {
          if (landed && p.spawnFromTop && onParticleLand) {
            onParticleLand(p.x, p.size)
          }
          toRemove.push(i)
        }
      }

      // Remove and spawn replacements
      for (let i = toRemove.length - 1; i >= 0; i--) {
        particlesRef.current.splice(toRemove[i], 1)
      }
      const liveBlend = parseFloat(document.documentElement.getAttribute('data-season-blend') ?? '0')
      const primaryFade = getPrimaryFade(month, liveBlend)
      const targetCount = Math.floor(baseCount * particleMultiplierRef.current * primaryFade)
      if (particlesRef.current.length > targetCount + 2) {
        particlesRef.current.splice(targetCount)
      }
      while (particlesRef.current.length < targetCount) {
        particlesRef.current.push(spawnParticle(season, month, w, h))
      }

      // Draw particles + emit butterfly dust
      for (const p of particlesRef.current) {
        const { fill, stroke, glow, useGradient } = getParticleColors(season, p.shape)
        const wingPhase = p.shape === BUTTERFLY ? t * p.rotationSpeed * 0.015 + p.swayPhase : 0

        // Butterfly dust emission — from wing tips when wings are near-open
        if (p.shape === BUTTERFLY && dustTrailRef.current.length < 90) {
          const spread = Math.max(0.15, Math.abs(Math.sin(wingPhase)))
          if (spread > 0.55 && Math.random() < 0.18) {
            const scale = p.size / 20
            const side = Math.random() < 0.5 ? -1 : 1
            const colors = ['#FDE68A', '#FFFFFF', '#FCD34D', '#FEF3C7']
            dustTrailRef.current.push({
              x: p.x + side * 16 * spread * scale + rand(-3, 3),
              y: p.y - 6 * scale + rand(-2, 2),
              vx: side * rand(4, 14) + rand(-3, 3),
              vy: rand(-28, -8),
              age: 0,
              maxAge: rand(0.35, 0.75),
              size: rand(0.8, 2.2),
              color: colors[Math.floor(Math.random() * colors.length)],
            })
          }
        }

        // Opacity: maxAge particles fade out over lifetime
        const effectiveOpacity = p.maxAge > 0
          ? p.opacity * Math.max(0, 1 - p.age / p.maxAge)
          : p.opacity

        ctx.save()
        ctx.globalAlpha = effectiveOpacity
        ctx.translate(p.x, p.y - p.bounceY)
        if (p.shape !== BUTTERFLY) ctx.rotate((p.rotation * Math.PI) / 180)

        const scale = p.size / 20
        ctx.scale(scale, scale)
        drawParticleShape(ctx, p.shape, 20, fill, stroke, glow, useGradient, wingPhase)
        ctx.restore()
      }

      // --- Butterfly dust trail update + draw ---
      const dustToRemove: number[] = []
      for (let i = 0; i < dustTrailRef.current.length; i++) {
        const d = dustTrailRef.current[i]
        d.age += dt
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.vy += 18 * dt  // gentle gravity deceleration
        if (d.age >= d.maxAge) dustToRemove.push(i)
      }
      for (let i = dustToRemove.length - 1; i >= 0; i--) {
        dustTrailRef.current.splice(dustToRemove[i], 1)
      }
      for (const d of dustTrailRef.current) {
        const alpha = Math.max(0, 1 - d.age / d.maxAge)
        ctx.save()
        ctx.globalAlpha = alpha * 0.85
        ctx.shadowColor = '#FDE68A'
        ctx.shadowBlur = d.size * 4
        ctx.fillStyle = d.color
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // --- Secondary season particles (independent, coexist with primary) ---
      if (secondary && blend > 0.05) {
        const secCfg = PARTICLE_CONFIGS[secondary]
        const secTargetCount = Math.floor(secCfg.count * blend * 0.5)

        // Update physics for existing secondary particles
        const secToRemove: number[] = []
        for (let i = 0; i < secondaryParticlesRef.current.length; i++) {
          const p = secondaryParticlesRef.current[i]
          const sway = Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmount * 0.5
          p.age += dt
          p.y += p.speedY * dt
          p.x += (sway + p.speedX * 0.1) * dt
          if (p.shape !== BUTTERFLY) p.rotation += p.rotationSpeed * dt
          const landed = p.spawnFromTop ? p.y > h + p.size : p.y < -p.size
          const expired = p.maxAge > 0 && p.age >= p.maxAge
          if (p.x < -100 || p.x > w + 100 || landed || expired) secToRemove.push(i)
        }
        for (let i = secToRemove.length - 1; i >= 0; i--) {
          secondaryParticlesRef.current.splice(secToRemove[i], 1)
        }

        // Trim or grow to match blend-scaled target count
        if (secondaryParticlesRef.current.length > secTargetCount + 2) {
          secondaryParticlesRef.current.splice(secTargetCount)
        }
        while (secondaryParticlesRef.current.length < secTargetCount) {
          secondaryParticlesRef.current.push(spawnParticle(secondary, month, w, h))
        }

        // Draw secondary particles — they coexist, not overlay
        for (const p of secondaryParticlesRef.current) {
          const { fill, stroke, glow, useGradient } = getParticleColors(secondary, p.shape)
          const secOpacity = p.maxAge > 0 ? p.opacity * Math.max(0, 1 - p.age / p.maxAge) : p.opacity
          ctx.save()
          ctx.globalAlpha = secOpacity
          ctx.translate(p.x, p.y - p.bounceY)
          if (p.shape !== BUTTERFLY) ctx.rotate((p.rotation * Math.PI) / 180)
          const scale = p.size / 20
          ctx.scale(scale, scale)
          const wingPhase = p.shape === BUTTERFLY ? t * p.rotationSpeed * 0.015 + p.swayPhase : 0
          drawParticleShape(ctx, p.shape, 20, fill, stroke, glow, useGradient, wingPhase)
          ctx.restore()
        }
      } else {
        secondaryParticlesRef.current = []
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [season, timeOfDay, month, blend, secondary, hasRain, hasFireflies, onParticleLand, initParticles])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        transition: 'opacity 600ms ease',
      }}
    />
  )
}
