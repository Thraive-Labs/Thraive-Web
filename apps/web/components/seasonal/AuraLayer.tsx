'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { Season } from '@/lib/seasonal'

interface AuraThread {
  points: { x: number; y: number; vx: number; vy: number }[]
  opacity: number
  width: number
  colorIndex: number
  colorPhase: number
  speed: number
  offset: number
  phase: number
}

interface AuraLayerProps {
  season: Season
  mode: 'loading' | 'page'
  intensityTarget?: number
}

const AURA_COLORS: Record<Season, [string, string, string]> = {
  winter: ['#BAE6FD', '#7DD3FC', '#E0F2FE'],
  spring: ['#FBCFE8', '#FDF2F8', '#F9A8D4'],
  summer: ['#FDE68A', '#FCD34D', '#FEF3C7'],
  autumn: ['#FB923C', '#FDE68A', '#B45309'],
}

function noise(x: number, y: number): number {
  return (
    Math.sin(x * 1.5 + y * 0.7) * 0.5 +
    Math.sin(x * 0.3 - y * 1.2) * 0.3 +
    Math.sin(x * 2.1 + y * 1.7) * 0.2
  )
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bl})`
}

function createThread(
  canvasW: number,
  canvasH: number,
  index: number,
  mode: 'loading' | 'page',
): AuraThread {
  const pointCount = 8
  const points = []
  // In loading mode keep threads in the outer thirds so they stay clear of
  // the centred logo. Top half: indices 0-1, bottom half: indices 2-3.
  const yBase = mode === 'loading'
    ? index < 2
      ? canvasH * (0.05 + Math.random() * 0.18)   // top zone  5–23%
      : canvasH * (0.77 + Math.random() * 0.18)   // bottom zone 77–95%
    : canvasH * (0.2 + Math.random() * 0.6)        // page mode: anywhere
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: (canvasW / (pointCount - 1)) * i,
      y: yBase + (Math.random() - 0.5) * canvasH * 0.05,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    })
  }

  const maxOpacity = mode === 'loading' ? 0.28 : 0.09
  const minOpacity = mode === 'loading' ? 0.14 : 0.04

  return {
    points,
    opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
    width: 1 + Math.random() * 3,
    colorIndex: index % 3,
    colorPhase: Math.random() * Math.PI * 2,
    speed: 0.15 + Math.random() * 0.25,
    offset: index * 1.7,
    phase: Math.random() * Math.PI * 2,
  }
}

export default function AuraLayer({ season, mode, intensityTarget = 1 }: AuraLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const threadsRef = useRef<AuraThread[]>([])
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const intensityRef = useRef(0)
  const reducedMotion = useRef(false)

  const initThreads = useCallback((w: number, h: number) => {
    const count = mode === 'loading' ? 4 : 2
    threadsRef.current = Array.from({ length: count }, (_, i) => createThread(w, h, i, mode))
  }, [mode])

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initThreads(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion.current) {
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const colors = AURA_COLORS[season]
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.5)
      grad.addColorStop(0, colors[0] + '20')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return () => { window.removeEventListener('resize', resize) }
    }

    const draw = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = timestamp
      timeRef.current += dt

      intensityRef.current += (intensityTarget - intensityRef.current) * 0.03

      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const colors = AURA_COLORS[season]
      const t = timeRef.current

      for (const thread of threadsRef.current) {
        const points = thread.points
        for (let i = 1; i < points.length - 1; i++) {
          const nx = noise(i * 0.4, t * thread.speed + thread.offset)
          const ny = noise(i * 0.4 + 100, t * thread.speed + thread.offset + 50)
          points[i].vx += nx * 0.8
          points[i].vy += ny * 0.8
          points[i].vx *= 0.92
          points[i].vy *= 0.92
          points[i].x += points[i].vx
          points[i].y += points[i].vy

          if (points[i].y < canvas.height * 0.05) points[i].vy += 0.5
          if (points[i].y > canvas.height * 0.95) points[i].vy -= 0.5
          // In loading mode push threads back toward their zone if they drift inward
          if (mode === 'loading') {
            const isTop = threadsRef.current.indexOf(thread) < 2
            if (isTop  && points[i].y > canvas.height * 0.38) points[i].vy -= 0.6
            if (!isTop && points[i].y < canvas.height * 0.62) points[i].vy += 0.6
          }
        }

        const colorT = (Math.sin(t * 0.3 + thread.colorPhase) + 1) * 0.5
        const c1 = colors[thread.colorIndex % 3]
        const c2 = colors[(thread.colorIndex + 1) % 3]
        const color = lerpColor(c1, c2, colorT)

        const opacity = thread.opacity * intensityRef.current
        if (opacity < 0.005) continue

        ctx.save()
        ctx.globalAlpha = opacity
        ctx.strokeStyle = color
        ctx.lineWidth = thread.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.shadowColor = color
        ctx.shadowBlur = thread.width * 6
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length - 1; i++) {
          const mx = (points[i].x + points[i + 1].x) / 2
          const my = (points[i].y + points[i + 1].y) / 2
          ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my)
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
        ctx.stroke()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [season, mode, intensityTarget, initThreads])

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
        zIndex: mode === 'loading' ? 9998 : 1,
      }}
    />
  )
}
