import type { Season } from './seasonal'

// ---------------------------------------------------------------------------
// Month-specific particle overrides (shapes + size + fall speed)
//
// Every month has a distinct visual character driven by three axes:
//   - shapes:    which particle types can spawn
//   - sizeRange: min/max particle size in px
//   - fallSpeed: min/max fall speed in px/s
//
// Winter  — Dec: tiny simple flakes, slow gentle drift (first snow of the season)
//           Jan: all 6 types, large + heavy fall (peak blizzard)
//           Feb: small simple flakes, light fall (winding down, spring blend begins)
//
// Spring  — Mar: plum blossoms only, compact size (plum blooms first)
//           Apr: plum + cherry full mix, medium size (both in bloom, peak spring)
//           May: cherry blossoms only, widest petals (cherry peaks, plum done)
//
// Summer  — Jun: gold dust drifting upward (heat shimmer, incoming summer)
//           Jul: tropical butterflies — slow flutter, warm amber wings
//           Aug: gold dust drifting upward (outgoing summer, autumn blend begins)
//
// Autumn  — Sep: Elm + Birch only, small light leaves (early fall, subtle colour)
//           Oct: all four types, full size (peak autumn — maximum chaos)
//           Nov: Oak + Elm only, large + heavy fall (late fall, sparse and weighty)
// ---------------------------------------------------------------------------

export interface ParticleConfig {
  count: number
  shapes: (string | null)[]
  sizeRange: [number, number]
  opacityRange: [number, number]
  fallSpeed: [number, number]
  swayAmount: number
  swaySpeed: number
  rotationSpeed: [number, number]
  spawnFromTop: boolean
}

// Snowflake paths — 6-pointed crystals, centered at (0,0), radius ~10
const SNOWFLAKE_1 = 'SNOWFLAKE_1'
const SNOWFLAKE_2 = 'SNOWFLAKE_2'
const SNOWFLAKE_3 = 'SNOWFLAKE_3'
const SNOWFLAKE_4 = 'SNOWFLAKE_4'
const SNOWFLAKE_5 = 'SNOWFLAKE_5'
const SNOWFLAKE_6 = 'SNOWFLAKE_6'

// Cherry/plum blossom petals
const PETAL_1 = 'PETAL_1'
const PETAL_2 = 'PETAL_2'
const PETAL_3 = 'PETAL_3'
const PLUM_1  = 'PLUM_1'
const PLUM_2  = 'PLUM_2'

// Autumn leaves
export const LEAF_OAK   = 'LEAF_OAK'
export const LEAF_MAPLE = 'LEAF_MAPLE'
export const LEAF_ELM   = 'LEAF_ELM'
export const LEAF_BIRCH = 'LEAF_BIRCH'

// Gold dust — null means use ctx.arc()
const DUST_1 = null

// Tropical butterfly — wings drawn procedurally with flap animation
export const BUTTERFLY = 'BUTTERFLY'

// Rising ember spark — circle with strong amber glow, fades as it rises
export const EMBER = 'EMBER'

export const PARTICLE_CONFIGS: Record<Season, ParticleConfig> = {
  winter: {
    count: 80,
    shapes: [SNOWFLAKE_1, SNOWFLAKE_2, SNOWFLAKE_3, SNOWFLAKE_4, SNOWFLAKE_5, SNOWFLAKE_6],
    sizeRange: [4, 14],
    opacityRange: [0.3, 0.7],
    fallSpeed: [40, 80],
    swayAmount: 25,
    swaySpeed: 0.8,
    rotationSpeed: [-20, 20],
    spawnFromTop: true,
  },
  spring: {
    count: 60,
    shapes: [PETAL_1, PETAL_2, PETAL_3, PLUM_1, PLUM_2],
    sizeRange: [8, 20],
    opacityRange: [0.4, 0.85],
    fallSpeed: [25, 55],
    swayAmount: 40,
    swaySpeed: 0.5,
    rotationSpeed: [-90, 90],
    spawnFromTop: true,
  },
  summer: {
    count: 80,
    shapes: [DUST_1],
    sizeRange: [2, 6],
    opacityRange: [0.15, 0.45],
    fallSpeed: [-15, -30],
    swayAmount: 15,
    swaySpeed: 1.2,
    rotationSpeed: [0, 0],
    spawnFromTop: false,
  },
  autumn: {
    count: 50,
    shapes: [LEAF_OAK, LEAF_MAPLE, LEAF_ELM, LEAF_BIRCH],
    sizeRange: [14, 28],
    opacityRange: [0.6, 0.95],
    fallSpeed: [60, 120],
    swayAmount: 60,
    swaySpeed: 0.4,
    rotationSpeed: [-180, 180],
    spawnFromTop: true,
  },
}

// Draw a single particle shape onto a canvas context at (0,0), scaled to size.
// wingPhase is only used by BUTTERFLY — ignored by all other shapes.
export function drawParticleShape(
  ctx: CanvasRenderingContext2D,
  shape: string | null,
  size: number,
  fillColor: string,
  strokeColor: string | null,
  glowColor: string | null,
  useGradient: boolean,
  wingPhase = 0,
): void {
  const s = size / 20 // normalize to 20px design space

  if (glowColor) {
    ctx.shadowColor = glowColor
    ctx.shadowBlur = size * 0.8
  }

  switch (shape) {
    case 'SNOWFLAKE_1':
      drawSnowflake(ctx, s, 6, true, false, false, fillColor)
      break
    case 'SNOWFLAKE_2':
      drawSnowflake(ctx, s, 6, false, false, false, fillColor)
      break
    case 'SNOWFLAKE_3':
      drawSnowflake(ctx, s, 8, false, false, false, fillColor)
      break
    case 'SNOWFLAKE_4':
      drawSnowflake(ctx, s, 6, true, true, false, fillColor)
      break
    case 'SNOWFLAKE_5':
      drawSnowflake(ctx, s, 4, false, false, false, fillColor)
      break
    case 'SNOWFLAKE_6':
      drawSnowflake(ctx, s, 6, true, false, true, fillColor)
      break

    case 'PETAL_1':
      drawPetal(ctx, s, 10, 8, fillColor, useGradient)
      break
    case 'PETAL_2':
      drawPetal(ctx, s, 10, 10, fillColor, useGradient)
      break
    case 'PETAL_3':
      drawPetal(ctx, s, 10, 6, fillColor, useGradient)
      break
    case 'PLUM_1':
      drawPetal(ctx, s, 8, 8, '#F472B6', useGradient)
      break
    case 'PLUM_2':
      drawPetal(ctx, s, 7, 7, '#EC4899', useGradient)
      break

    case 'LEAF_OAK':
      drawLeafOak(ctx, s)
      break
    case 'LEAF_MAPLE':
      drawLeafMaple(ctx, s)
      break
    case 'LEAF_ELM':
      drawLeafElm(ctx, s)
      break
    case 'LEAF_BIRCH':
      drawLeafBirch(ctx, s)
      break

    case 'BUTTERFLY':
      drawButterfly(ctx, s, fillColor, strokeColor ?? '#78350F', wingPhase)
      ctx.shadowBlur = 0
      return

    case 'EMBER':
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2)
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.shadowBlur = 0
      return

    default:
      // DUST_1 — simple circle
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.shadowBlur = 0
      return
  }

  ctx.fillStyle = fillColor
  ctx.fill()
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
  ctx.shadowBlur = 0
}

function drawButterfly(
  ctx: CanvasRenderingContext2D,
  s: number,
  wingColor: string,
  bodyColor: string,
  wingPhase: number,
): void {
  // Spend more time open (glide) than closed (flap): min spread 0.15
  const spread = Math.max(0.15, Math.abs(Math.sin(wingPhase)))

  // ctx.scale(spread, 1) gives a perspective-correct fold:
  // all x-coords compress to near-zero as wings fold edge-on toward viewer
  ctx.save()
  ctx.scale(spread, 1)

  // Left forewing — large swept-back wing, monarch/swallowtail shape
  ctx.beginPath()
  ctx.moveTo(0, -2 * s)                                            // body top
  ctx.bezierCurveTo(-3 * s, -10 * s, -12 * s, -12 * s, -16 * s, -7 * s)  // leading edge to tip
  ctx.bezierCurveTo(-17 * s, -4 * s, -16 * s, 0,       -12 * s,  3 * s)  // outer edge
  ctx.bezierCurveTo( -8 * s,  6 * s,  -2 * s,  5 * s,   0,        3 * s) // trailing back
  ctx.closePath()
  ctx.fillStyle = wingColor
  ctx.fill()

  // Right forewing (mirror)
  ctx.beginPath()
  ctx.moveTo(0, -2 * s)
  ctx.bezierCurveTo( 3 * s, -10 * s,  12 * s, -12 * s,  16 * s, -7 * s)
  ctx.bezierCurveTo(17 * s,  -4 * s,  16 * s,  0,        12 * s,  3 * s)
  ctx.bezierCurveTo( 8 * s,   6 * s,   2 * s,  5 * s,    0,       3 * s)
  ctx.closePath()
  ctx.fillStyle = wingColor
  ctx.fill()

  // Left hindwing — rounder, slightly transparent
  ctx.beginPath()
  ctx.moveTo(0,  3 * s)
  ctx.bezierCurveTo(-4 * s,  2 * s, -11 * s,  4 * s, -13 * s,  8 * s)
  ctx.bezierCurveTo(-15 * s, 12 * s, -12 * s, 16 * s,  -7 * s, 15 * s)
  ctx.bezierCurveTo( -4 * s, 14 * s,  -1 * s, 11 * s,   0,     10 * s)
  ctx.closePath()
  ctx.fillStyle = wingColor + 'BB'
  ctx.fill()

  // Right hindwing (mirror)
  ctx.beginPath()
  ctx.moveTo(0, 3 * s)
  ctx.bezierCurveTo( 4 * s,  2 * s,  11 * s,  4 * s,  13 * s,  8 * s)
  ctx.bezierCurveTo(15 * s, 12 * s,  12 * s, 16 * s,   7 * s, 15 * s)
  ctx.bezierCurveTo( 4 * s, 14 * s,   1 * s, 11 * s,   0,     10 * s)
  ctx.closePath()
  ctx.fillStyle = wingColor + 'BB'
  ctx.fill()

  ctx.restore()

  // Body + head — drawn outside scale so always full-width regardless of fold
  ctx.beginPath()
  ctx.ellipse(0, 4 * s, 0.9 * s, 5.5 * s, 0, 0, Math.PI * 2)
  ctx.fillStyle = bodyColor
  ctx.fill()

  ctx.beginPath()
  ctx.arc(0, -2.5 * s, 1.4 * s, 0, Math.PI * 2)
  ctx.fillStyle = bodyColor
  ctx.fill()
}

function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  s: number,
  arms: number,
  hasBranches: boolean,
  hasInnerHex = false,
  hasDots = false,
  color = '#E0F2FE',
): void {
  const r = 10 * s
  const angle = (Math.PI * 2) / arms

  ctx.beginPath()
  for (let i = 0; i < arms; i++) {
    const a = angle * i - Math.PI / 2
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)

    if (hasBranches) {
      const branchLen = r * 0.35
      const b1 = a - Math.PI / 4
      const b2 = a + Math.PI / 4
      const mid = r * 0.5
      const mx = Math.cos(a) * mid
      const my = Math.sin(a) * mid
      ctx.moveTo(mx, my)
      ctx.lineTo(mx + Math.cos(b1) * branchLen, my + Math.sin(b1) * branchLen)
      ctx.moveTo(mx, my)
      ctx.lineTo(mx + Math.cos(b2) * branchLen, my + Math.sin(b2) * branchLen)
    }
  }

  if (hasInnerHex) {
    const ir = r * 0.3
    ctx.moveTo(ir, 0)
    for (let i = 1; i <= 6; i++) {
      const a = (Math.PI / 3) * i
      ctx.lineTo(Math.cos(a) * ir, Math.sin(a) * ir)
    }
    ctx.closePath()
  }

  if (hasDots) {
    for (let i = 0; i < arms; i++) {
      const a = angle * i - Math.PI / 2
      const dr = r * 0.75
      ctx.moveTo(Math.cos(a) * dr + r * 0.06, Math.sin(a) * dr)
      ctx.arc(Math.cos(a) * dr, Math.sin(a) * dr, r * 0.06, 0, Math.PI * 2)
    }
  }

  ctx.strokeStyle = color
  ctx.lineWidth = s * 1.2
  ctx.lineCap = 'round'
  ctx.stroke()
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  s: number,
  halfH: number,
  halfW: number,
  fillColor: string,
  useGradient: boolean,
): void {
  const h = halfH * s
  const w = halfW * s

  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.bezierCurveTo(w * 0.6, -h * 0.8, w, -h * 0.2, w, h * 0.2)
  ctx.bezierCurveTo(w, h * 0.7, w * 0.4, h, 0, h)
  ctx.bezierCurveTo(-w * 0.4, h, -w, h * 0.7, -w, h * 0.2)
  ctx.bezierCurveTo(-w, -h * 0.2, -w * 0.6, -h * 0.8, 0, -h)
  ctx.closePath()

  if (useGradient) {
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, h)
    grad.addColorStop(0, '#FFFFFF')
    grad.addColorStop(0.4, fillColor)
    grad.addColorStop(1, fillColor + 'CC')
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = fillColor
  }
  ctx.fill()
}

function drawLeafOak(ctx: CanvasRenderingContext2D, s: number): void {
  // Elongated leaf with two rounded lobes per side and a pointed tip
  ctx.beginPath()
  ctx.moveTo(0, 13 * s)
  ctx.bezierCurveTo(-3 * s, 10 * s, -9 * s,  8 * s, -8 * s,  4 * s)  // left lower lobe
  ctx.bezierCurveTo(-7 * s,  0,     -9 * s, -2 * s, -7 * s, -6 * s)  // left upper lobe
  ctx.bezierCurveTo(-5 * s, -9 * s, -2 * s, -12 * s, 0, -13 * s)     // tip
  ctx.bezierCurveTo( 2 * s, -12 * s,  5 * s, -9 * s,  7 * s, -6 * s) // right upper lobe
  ctx.bezierCurveTo( 9 * s, -2 * s,   7 * s,  0,      8 * s,  4 * s) // right lower lobe
  ctx.bezierCurveTo( 9 * s,  8 * s,   3 * s, 10 * s,  0,     13 * s) // back to stem
  ctx.closePath()
}

function drawLeafMaple(ctx: CanvasRenderingContext2D, s: number): void {
  // 5-lobe maple with deep notches (inner radius 0.28 = pronounced lobes)
  const r = 11 * s
  const tips = 5
  ctx.beginPath()
  for (let i = 0; i < tips; i++) {
    const outerA = (Math.PI * 2 * i) / tips - Math.PI / 2
    const innerA = outerA + Math.PI / tips
    ctx.lineTo(Math.cos(outerA) * r, Math.sin(outerA) * r)
    ctx.lineTo(Math.cos(innerA) * r * 0.28, Math.sin(innerA) * r * 0.28)
  }
  ctx.closePath()
  // stem
  ctx.moveTo(0, r * 0.7)
  ctx.lineTo(0, r * 1.3)
}

function drawLeafElm(ctx: CanvasRenderingContext2D, s: number): void {
  // Teardrop leaf: sharp pointed tip at top, rounded base — NOT a symmetric oval
  const h = 12 * s, w = 6 * s
  ctx.beginPath()
  ctx.moveTo(0, -h)                                                     // pointed tip
  ctx.bezierCurveTo( w * 0.6, -h * 0.65,  w,      -h * 0.1,  w * 0.85, h * 0.35)
  ctx.bezierCurveTo( w * 0.6,  h * 0.72,  w * 0.2, h * 0.95, 0,        h)
  ctx.bezierCurveTo(-w * 0.2,  h * 0.95, -w * 0.6, h * 0.72, -w * 0.85, h * 0.35)
  ctx.bezierCurveTo(-w,       -h * 0.1,  -w * 0.6, -h * 0.65, 0,       -h)
  ctx.closePath()
}

function drawLeafBirch(ctx: CanvasRenderingContext2D, s: number): void {
  // Small ovate leaf: pointed tip, broad middle, rounded base
  const h = 9 * s, w = 6.5 * s
  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.bezierCurveTo( w * 0.5, -h * 0.5,  w,       h * 0.1,  w * 0.7, h * 0.55)
  ctx.bezierCurveTo( w * 0.35, h * 0.85, 0,        h,        0,       h)
  ctx.bezierCurveTo(0,         h,        -w * 0.35, h * 0.85, -w * 0.7, h * 0.55)
  ctx.bezierCurveTo(-w,        h * 0.1,  -w * 0.5, -h * 0.5,  0,      -h)
  ctx.closePath()
}

export interface MonthOverrides {
  shapes: (string | null)[]
  sizeRange: [number, number]
  fallSpeed: [number, number]
  count?: number
  rotationSpeed?: [number, number]
  swayAmount?: number
  swaySpeed?: number
  spawnFromTop?: boolean
  opacityRange?: [number, number]
  maxAge?: number
}

export function getMonthOverrides(season: Season, month: number): MonthOverrides {
  switch (season) {
    case 'winter':
      if (month === 1) return {
        shapes: [SNOWFLAKE_1, SNOWFLAKE_2, SNOWFLAKE_3, SNOWFLAKE_4, SNOWFLAKE_5, SNOWFLAKE_6],
        sizeRange: [8, 18],
        fallSpeed: [55, 95],
      }
      return {
        shapes: [SNOWFLAKE_2, SNOWFLAKE_5],
        sizeRange: [2, 8],
        fallSpeed: [25, 55],
      }

    case 'spring':
      if (month === 3) return {
        shapes: [PLUM_1, PLUM_2],
        sizeRange: [6, 14],
        fallSpeed: [20, 45],
      }
      if (month === 5) return {
        shapes: [PETAL_1, PETAL_2, PETAL_3],
        sizeRange: [10, 22],
        fallSpeed: [25, 55],
      }
      return {
        shapes: [PETAL_1, PETAL_2, PETAL_3, PLUM_1, PLUM_2],
        sizeRange: [8, 20],
        fallSpeed: [25, 55],
      }

    case 'summer':
      if (month === 7) return {
        shapes: [BUTTERFLY],
        sizeRange: [14, 28],
        fallSpeed: [10, 28],
        count: 28,
        rotationSpeed: [280, 560],
        swayAmount: 45,
        swaySpeed: 0.45,
        spawnFromTop: true,
        opacityRange: [0.65, 0.92],
      }
      if (month === 8) return {
        shapes: [EMBER],
        sizeRange: [2, 5],
        fallSpeed: [-45, -100],
        count: 70,
        swayAmount: 18,
        swaySpeed: 2.2,
        spawnFromTop: false,
        opacityRange: [0.75, 1.0],
        maxAge: 2.4,
      }
      return { shapes: [DUST_1], sizeRange: [2, 6], fallSpeed: [-15, -30] }

    case 'autumn':
      if (month === 9) return {
        shapes: [LEAF_ELM, LEAF_BIRCH],
        sizeRange: [10, 18],
        fallSpeed: [45, 85],
      }
      if (month === 11) return {
        shapes: [LEAF_OAK, LEAF_ELM],
        sizeRange: [18, 32],
        fallSpeed: [80, 140],
      }
      return {
        shapes: [LEAF_OAK, LEAF_MAPLE, LEAF_ELM, LEAF_BIRCH],
        sizeRange: [14, 28],
        fallSpeed: [60, 120],
      }
  }
}

export function getParticleColors(season: Season, shape: string | null): {
  fill: string
  stroke: string | null
  glow: string | null
  useGradient: boolean
} {
  const isLight =
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-mode') === 'light'

  switch (season) {
    case 'winter':
      return isLight
        ? { fill: '#2563EB', stroke: '#1D4ED8', glow: 'rgba(37,99,235,0.25)', useGradient: false }
        : { fill: '#E0F2FE', stroke: '#BAE6FD', glow: null, useGradient: false }

    case 'spring': {
      const isPlum = shape === 'PLUM_1' || shape === 'PLUM_2'
      return isLight
        ? { fill: isPlum ? '#9D174D' : '#BE185D', stroke: isPlum ? '#831843' : '#9D174D', glow: null, useGradient: false }
        : { fill: isPlum ? '#F472B6' : '#FBCFE8', stroke: isPlum ? '#EC4899' : '#F9A8D4', glow: null, useGradient: true }
    }

    case 'summer':
      if (shape === BUTTERFLY) {
        return isLight
          ? { fill: '#D97706', stroke: '#78350F', glow: 'rgba(217,119,6,0.35)', useGradient: false }
          : { fill: '#FCD34D', stroke: '#92400E', glow: 'rgba(252,211,77,0.45)', useGradient: false }
      }
      if (shape === EMBER) {
        return isLight
          ? { fill: '#EA580C', stroke: null, glow: 'rgba(234,88,12,0.8)', useGradient: false }
          : { fill: '#FB923C', stroke: null, glow: 'rgba(251,146,60,0.9)', useGradient: false }
      }
      return isLight
        ? { fill: '#B45309', stroke: null, glow: 'rgba(180,83,9,0.4)', useGradient: false }
        : { fill: '#FDE68A', stroke: null, glow: 'rgba(253,230,138,0.6)', useGradient: false }

    case 'autumn': {
      const darkFills: Record<string, string> = {
        LEAF_OAK: '#FB923C', LEAF_MAPLE: '#B45309',
        LEAF_ELM: '#D97706', LEAF_BIRCH: '#EA580C',
      }
      const lightFills: Record<string, string> = {
        LEAF_OAK: '#C2410C', LEAF_MAPLE: '#78350F',
        LEAF_ELM: '#92400E', LEAF_BIRCH: '#9A3412',
      }
      const fills = isLight ? lightFills : darkFills
      return {
        fill: fills[shape ?? ''] ?? (isLight ? '#C2410C' : '#FB923C'),
        stroke: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
        glow: null,
        useGradient: false,
      }
    }
  }
}
