'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import type { Season } from '@/lib/seasonal'
import { drawParticleShape, getParticleColors, LEAF_OAK, LEAF_MAPLE, LEAF_ELM, LEAF_BIRCH } from '@/lib/particles'

export interface AccumulationHandle {
  onParticleLand: (x: number, size: number) => void
}

interface LandedPiece {
  x: number
  y: number
  rotation: number
  size: number
  shape: string | null
  opacity: number
  driftX?: number
  driftY?: number
  driftOpacity?: number
}

type ClearState = 'idle' | 'clearing' | 'done'

interface AccumulationCanvasProps {
  season: Season
}

const COLUMN_WIDTH = 4
const MAX_PILE_HEIGHT = 80
const CLEAR_THRESHOLD = 0.85
const CANVAS_HEIGHT = 120

const LEAF_SHAPES = [LEAF_OAK, LEAF_MAPLE, LEAF_ELM, LEAF_BIRCH]
const PETAL_SHAPES = ['PETAL_1', 'PETAL_2', 'PETAL_3', 'PLUM_1']

const AccumulationCanvas = forwardRef<AccumulationHandle, AccumulationCanvasProps>(
  function AccumulationCanvas({ season }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const columnsRef = useRef<number[]>([])
    const landedPiecesRef = useRef<LandedPiece[]>([])
    const clearStateRef = useRef<ClearState>('idle')
    const clearTickRef = useRef(0)
    const clearDurationRef = useRef(5)
    const rafRef = useRef<number>(0)
    const dirtyRef = useRef(true)
    const lastTimeRef = useRef(0)
    const reducedMotion = useRef(false)

    useEffect(() => {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])

    const initColumns = (w: number) => {
      const count = Math.ceil(w / COLUMN_WIDTH)
      columnsRef.current = new Array(count).fill(0)
      landedPiecesRef.current = []
    }

    useImperativeHandle(ref, () => ({
      onParticleLand(x: number, size: number) {
        if (reducedMotion.current) return
        if (clearStateRef.current !== 'idle') return

        const canvas = canvasRef.current
        if (!canvas) return

        const col = Math.max(0, Math.floor(x / COLUMN_WIDTH))
        const cols = columnsRef.current
        if (col >= cols.length) return

        const heightAdd = size * 0.6
        cols[col] = Math.min(cols[col] + heightAdd, MAX_PILE_HEIGHT)

        // Spread to neighbors
        const spread = heightAdd * 0.3
        for (let offset = -3; offset <= 3; offset++) {
          if (offset === 0) continue
          const tc = col + offset
          if (tc >= 0 && tc < cols.length) {
            cols[tc] = Math.min(
              cols[tc] + spread * (1 - Math.abs(offset) * 0.25),
              MAX_PILE_HEIGHT,
            )
          }
        }

        // Track landed piece for spring/autumn
        if (season === 'spring' || season === 'autumn') {
          const shapes = season === 'autumn' ? LEAF_SHAPES : PETAL_SHAPES
          const shape = shapes[Math.floor(Math.random() * shapes.length)]
          const pieceSize = season === 'autumn' ? size * 0.8 : size * 0.6
          const canvasY = CANVAS_HEIGHT - (cols[col] ?? 0)
          landedPiecesRef.current.push({
            x: x + (Math.random() - 0.5) * 16,
            y: canvasY,
            rotation: Math.random() * 360,
            size: pieceSize,
            shape,
            opacity: 0.7 + Math.random() * 0.25,
          })
          // Cap piece count
          if (landedPiecesRef.current.length > 200) {
            landedPiecesRef.current.splice(0, 50)
          }
        }

        dirtyRef.current = true

        // Check clear threshold
        const avg = cols.reduce((a, b) => a + b, 0) / cols.length
        if (avg > MAX_PILE_HEIGHT * CLEAR_THRESHOLD && clearStateRef.current === 'idle') {
          startClear()
        }
      },
    }))

    function startClear() {
      clearStateRef.current = 'clearing'
      clearTickRef.current = 0

      if (season === 'winter') clearDurationRef.current = 5
      else if (season === 'spring') clearDurationRef.current = 0.35
      else if (season === 'autumn') clearDurationRef.current = 0.7
      else clearDurationRef.current = 2

      // Init drift for spring/autumn pieces
      if (season === 'spring' || season === 'autumn') {
        const dir = Math.random() > 0.5 ? 1 : -1
        for (const piece of landedPiecesRef.current) {
          const speed = 150 + Math.random() * 250
          piece.driftX = dir * speed * (0.7 + Math.random() * 0.6)
          piece.driftY = -(30 + Math.random() * 60)
          piece.driftOpacity = piece.opacity
        }
      }
    }

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = CANVAS_HEIGHT
        initColumns(canvas.width)
        dirtyRef.current = true
      }

      resize()
      window.addEventListener('resize', resize)

      if (reducedMotion.current) {
        return () => { window.removeEventListener('resize', resize) }
      }

      const draw = (timestamp: number) => {
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05)
        lastTimeRef.current = timestamp

        const w = canvas.width
        const h = CANVAS_HEIGHT
        const cols = columnsRef.current
        const cs = clearStateRef.current

        let needsRedraw = dirtyRef.current

        if (cs === 'clearing') {
          clearTickRef.current += dt
          const progress = Math.min(clearTickRef.current / clearDurationRef.current, 1)
          needsRedraw = true

          if (season === 'winter') {
            // Snow melts from edges inward
            const centerCol = Math.floor(cols.length / 2)
            for (let i = 0; i < cols.length; i++) {
              const distFromCenter = Math.abs(i - centerCol) / centerCol
              const rate = (1 + distFromCenter * 2) * dt * (MAX_PILE_HEIGHT / clearDurationRef.current)
              cols[i] = Math.max(0, cols[i] - rate)
            }
          } else if (season === 'spring' || season === 'autumn') {
            // Pieces drift away
            for (const piece of landedPiecesRef.current) {
              if (piece.driftX !== undefined) {
                piece.x += piece.driftX! * dt
                piece.y += piece.driftY! * dt
                piece.driftOpacity = (piece.driftOpacity ?? piece.opacity) - dt * 3
                piece.rotation += 180 * dt * (piece.driftX! > 0 ? 1 : -1)
              }
            }
            landedPiecesRef.current = landedPiecesRef.current.filter(
              p => (p.driftOpacity ?? 1) > 0,
            )
            // Also fade columns
            for (let i = 0; i < cols.length; i++) {
              cols[i] = Math.max(0, cols[i] - dt * 80)
            }
          } else if (season === 'summer') {
            // Dust fades
            for (let i = 0; i < cols.length; i++) {
              cols[i] = Math.max(0, cols[i] - dt * (MAX_PILE_HEIGHT / clearDurationRef.current))
            }
          }

          if (progress >= 1) {
            clearStateRef.current = 'idle'
            clearTickRef.current = 0
            landedPiecesRef.current = []
          }
        }

        if (!needsRedraw) {
          rafRef.current = requestAnimationFrame(draw)
          return
        }

        ctx.clearRect(0, 0, w, h)

        const t = timestamp * 0.0005

        if (season === 'spring' || season === 'autumn') {
          // Draw landed pieces
          for (const piece of landedPiecesRef.current) {
            const op = piece.driftOpacity ?? piece.opacity
            if (op <= 0) continue
            const { fill, stroke, glow, useGradient } = getParticleColors(season, piece.shape)
            ctx.save()
            ctx.globalAlpha = Math.max(0, op)
            ctx.translate(piece.x, piece.y)
            ctx.rotate((piece.rotation * Math.PI) / 180)
            const scale = piece.size / 20
            ctx.scale(scale, scale)
            drawParticleShape(ctx, piece.shape, 20, fill, stroke, glow, useGradient)
            ctx.restore()
          }
        } else if (season === 'winter') {
          // Build pile path
          const hasAnyHeight = cols.some(c => c > 0.5)
          if (hasAnyHeight) {
            const isLight = document.documentElement.getAttribute('data-mode') === 'light'
            ctx.beginPath()
            ctx.moveTo(0, h)
            for (let i = 0; i < cols.length; i++) {
              const x = i * COLUMN_WIDTH
              const noiseSway = Math.sin(i * 0.3 + t) * 1.5
              const y = h - cols[i] + noiseSway
              ctx.lineTo(x, Math.max(0, y))
            }
            ctx.lineTo(w, h)
            ctx.closePath()

            const grad = ctx.createLinearGradient(0, 0, 0, h)
            if (isLight) {
              grad.addColorStop(0, 'rgba(37, 99, 235, 0.88)')
              grad.addColorStop(1, 'rgba(96, 165, 250, 0.65)')
              ctx.fillStyle = grad
              ctx.shadowColor = 'rgba(37, 99, 235, 0.35)'
            } else {
              grad.addColorStop(0, 'rgba(224, 242, 254, 0.92)')
              grad.addColorStop(1, 'rgba(186, 230, 253, 0.65)')
              ctx.fillStyle = grad
              ctx.shadowColor = 'rgba(224, 242, 254, 0.5)'
            }
            ctx.shadowBlur = 12
            ctx.fill()
            ctx.shadowBlur = 0
          }
        } else if (season === 'summer') {
          // Very subtle shimmering dust layer
          const avg = cols.reduce((a, b) => a + b, 0) / cols.length
          if (avg > 0.5) {
            ctx.beginPath()
            ctx.moveTo(0, h)
            for (let i = 0; i < cols.length; i++) {
              const x = i * COLUMN_WIDTH
              const y = h - cols[i] * 0.3
              ctx.lineTo(x, y)
            }
            ctx.lineTo(w, h)
            ctx.closePath()
            ctx.fillStyle = 'rgba(253, 230, 138, 0.08)'
            ctx.fill()
          }
        }

        dirtyRef.current = false
        rafRef.current = requestAnimationFrame(draw)
      }

      lastTimeRef.current = performance.now()
      rafRef.current = requestAnimationFrame(draw)

      return () => {
        cancelAnimationFrame(rafRef.current)
        window.removeEventListener('resize', resize)
      }
    }, [season])

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${CANVAS_HEIGHT}px`,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    )
  },
)

export default AccumulationCanvas
