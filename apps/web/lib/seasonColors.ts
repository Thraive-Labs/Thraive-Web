import type { Season } from './seasonal'

type UIVars = {
  '--season-ambient': string
  '--season-ambient-dim': string
  '--season-glow': string
  '--season-glow-soft': string
  '--season-bg-tint': string
  '--season-card-border': string
  '--season-accent': string
  '--season-btn-bg': string
  '--season-btn-hover': string
}

// Mirrors values in styles/seasonal/*.css — keep in sync if CSS changes.
const PALETTE: Record<Season, { dark: UIVars; light: UIVars }> = {
  winter: {
    dark: {
      '--season-ambient':     '#BAE6FD',
      '--season-ambient-dim': '#7DD3FC',
      '--season-glow':        'rgba(186, 230, 253, 0.12)',
      '--season-glow-soft':   'rgba(186, 230, 253, 0.05)',
      '--season-bg-tint':     'rgba(186, 230, 253, 0.04)',
      '--season-card-border': 'rgba(186, 230, 253, 0.15)',
      '--season-accent':      '#0EA5E9',
      '--season-btn-bg':      '#0284C7',
      '--season-btn-hover':   '#0369A1',
    },
    light: {
      '--season-ambient':     '#BAE6FD',
      '--season-ambient-dim': '#7DD3FC',
      '--season-glow':        'rgba(37, 99, 235, 0.1)',
      '--season-glow-soft':   'rgba(59, 130, 246, 0.06)',
      '--season-bg-tint':     'rgba(186, 230, 253, 0.04)',
      '--season-card-border': 'rgba(186, 230, 253, 0.15)',
      '--season-accent':      '#0EA5E9',
      '--season-btn-bg':      '#0284C7',
      '--season-btn-hover':   '#0369A1',
    },
  },
  spring: {
    dark: {
      '--season-ambient':     '#FBCFE8',
      '--season-ambient-dim': '#F9A8D4',
      '--season-glow':        'rgba(251, 207, 232, 0.12)',
      '--season-glow-soft':   'rgba(251, 207, 232, 0.05)',
      '--season-bg-tint':     'rgba(251, 207, 232, 0.04)',
      '--season-card-border': 'rgba(251, 207, 232, 0.2)',
      '--season-accent':      '#EC4899',
      '--season-btn-bg':      '#BE185D',
      '--season-btn-hover':   '#9D174D',
    },
    light: {
      '--season-ambient':     '#FBCFE8',
      '--season-ambient-dim': '#F9A8D4',
      '--season-glow':        'rgba(190, 24, 93, 0.1)',
      '--season-glow-soft':   'rgba(190, 24, 93, 0.06)',
      '--season-bg-tint':     'rgba(251, 207, 232, 0.04)',
      '--season-card-border': 'rgba(251, 207, 232, 0.2)',
      '--season-accent':      '#EC4899',
      '--season-btn-bg':      '#BE185D',
      '--season-btn-hover':   '#9D174D',
    },
  },
  summer: {
    dark: {
      '--season-ambient':     '#FDE68A',
      '--season-ambient-dim': '#FCD34D',
      '--season-glow':        'rgba(253, 230, 138, 0.12)',
      '--season-glow-soft':   'rgba(253, 230, 138, 0.05)',
      '--season-bg-tint':     'rgba(253, 230, 138, 0.03)',
      '--season-card-border': 'rgba(253, 230, 138, 0.2)',
      '--season-accent':      '#F59E0B',
      '--season-btn-bg':      '#B45309',
      '--season-btn-hover':   '#92400E',
    },
    light: {
      '--season-ambient':     '#FDE68A',
      '--season-ambient-dim': '#FCD34D',
      '--season-glow':        'rgba(180, 83, 9, 0.08)',
      '--season-glow-soft':   'rgba(180, 83, 9, 0.05)',
      '--season-bg-tint':     'rgba(253, 230, 138, 0.03)',
      '--season-card-border': 'rgba(253, 230, 138, 0.2)',
      '--season-accent':      '#F59E0B',
      '--season-btn-bg':      '#B45309',
      '--season-btn-hover':   '#92400E',
    },
  },
  autumn: {
    dark: {
      '--season-ambient':     '#FB923C',
      '--season-ambient-dim': '#F97316',
      '--season-glow':        'rgba(251, 146, 60, 0.12)',
      '--season-glow-soft':   'rgba(251, 146, 60, 0.05)',
      '--season-bg-tint':     'rgba(251, 146, 60, 0.04)',
      '--season-card-border': 'rgba(251, 146, 60, 0.2)',
      '--season-accent':      '#EA580C',
      '--season-btn-bg':      '#C2410C',
      '--season-btn-hover':   '#9A3412',
    },
    light: {
      '--season-ambient':     '#FB923C',
      '--season-ambient-dim': '#F97316',
      '--season-glow':        'rgba(194, 65, 12, 0.1)',
      '--season-glow-soft':   'rgba(194, 65, 12, 0.06)',
      '--season-bg-tint':     'rgba(251, 146, 60, 0.04)',
      '--season-card-border': 'rgba(251, 146, 60, 0.2)',
      '--season-accent':      '#EA580C',
      '--season-btn-bg':      '#C2410C',
      '--season-btn-hover':   '#9A3412',
    },
  },
}

const VAR_KEYS = Object.keys(PALETTE.winter.dark) as (keyof UIVars)[]

function parseColor(c: string): [number, number, number, number] {
  if (c.startsWith('#')) {
    return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1]
  }
  const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (m) return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1]
  return [0, 0, 0, 0]
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab, aa] = parseColor(a)
  const [br, bg, bb, ba] = parseColor(b)
  const r  = Math.round(ar + (br - ar) * t)
  const g  = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  const al = aa + (ba - aa) * t
  if (a.startsWith('#') && b.startsWith('#')) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
  }
  return `rgba(${r}, ${g}, ${bl}, ${al.toFixed(3)})`
}

// Returns interpolated CSS variable values, or empty object when no blend is active.
// Safe to call server-side (no DOM access).
export function getInterpolatedColorVars(
  primary: Season,
  secondary: Season | null,
  colorBlend: number,
  darkMode: boolean
): Record<string, string> {
  if (colorBlend <= 0 || secondary === null) return {}
  const mode = darkMode ? 'dark' : 'light'
  const from = PALETTE[primary][mode]
  const to   = PALETTE[secondary][mode]
  const result: Record<string, string> = {}
  for (const key of VAR_KEYS) {
    result[key] = lerpColor(from[key], to[key], colorBlend)
  }
  return result
}

// Applies or clears interpolated vars on document.documentElement.
// Reads current data-mode from the DOM so theme toggles are respected.
export function applySeasonColorBlend(
  primary: Season,
  secondary: Season | null,
  colorBlend: number
): void {
  const html = document.documentElement
  if (colorBlend <= 0 || secondary === null) {
    for (const key of VAR_KEYS) html.style.removeProperty(key)
    return
  }
  const darkMode = html.getAttribute('data-mode') !== 'light'
  const vars = getInterpolatedColorVars(primary, secondary, colorBlend, darkMode)
  for (const [k, v] of Object.entries(vars)) html.style.setProperty(k, v)
}
