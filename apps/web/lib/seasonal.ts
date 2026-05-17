export type Season = 'winter' | 'spring' | 'summer' | 'autumn'
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'golden' | 'evening' | 'night'

export interface SeasonState {
  primary: Season
  secondary: Season | null
  blend: number
  depth: number        // 0.5–1.0: how central we are in the season (1 = peak month, 0.5 = start/end)
  primaryFade: number  // 1.0 normally; ramps down to 0.35 over days 20-end of outgoing months
  colorBlend: number   // 0–1 over the last 5 days of outgoing months; drives UI color interpolation
  month: number
  day: number
  timeOfDay: TimeOfDay
  hour: number
  darkMode: boolean
}

// Transition design:
//
// Outgoing months (Feb/May/Aug/Nov): secondary particles appear only after day 20,
// ramping from 0 → 0.75 by end of month. Primary particles simultaneously fade
// from 1.0 → 0.35 (tracked via primaryFade, not blend).
//
// Incoming months (Mar/Jun/Sep/Dec): secondary (old season) starts at 0.70 blend
// — which equals 35% of old-season count (0.70 × 0.5), matching exactly where the
// outgoing month's primaryFade ended — then tapers to 0 by day 4.
// This makes the particle count identical at the boundary for a seamless hand-off.
//
// Peak months (Jan/Apr/Jul/Oct): pure, no secondary.
const SEASON_MAP: Record<number, { primary: Season; secondary: Season | null; blendFn: (day: number) => number }> = {
  1:  { primary: 'winter', secondary: null,     blendFn: () => 0 },
  2:  { primary: 'winter', secondary: 'spring', blendFn: d => Math.max(0, ((d - 20) / (28 - 20)) * 0.75) },
  3:  { primary: 'spring', secondary: 'winter', blendFn: d => Math.max(0, 0.70 * (1 - (d - 1) / 3)) },
  4:  { primary: 'spring', secondary: null,     blendFn: () => 0 },
  5:  { primary: 'spring', secondary: 'summer', blendFn: d => Math.max(0, ((d - 20) / (31 - 20)) * 0.75) },
  6:  { primary: 'summer', secondary: 'spring', blendFn: d => Math.max(0, 0.70 * (1 - (d - 1) / 3)) },
  7:  { primary: 'summer', secondary: null,     blendFn: () => 0 },
  8:  { primary: 'summer', secondary: 'autumn', blendFn: d => Math.max(0, ((d - 20) / (31 - 20)) * 0.75) },
  9:  { primary: 'autumn', secondary: 'summer', blendFn: d => Math.max(0, 0.70 * (1 - (d - 1) / 3)) },
  10: { primary: 'autumn', secondary: null,     blendFn: () => 0 },
  11: { primary: 'autumn', secondary: 'winter', blendFn: d => Math.max(0, ((d - 20) / (30 - 20)) * 0.75) },
  12: { primary: 'winter', secondary: 'autumn', blendFn: d => Math.max(0, 0.70 * (1 - (d - 1) / 3)) },
}

// Month lengths (non-leap for simplicity)
const MONTH_LENGTHS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// The three months that make up each season, in calendar order
const SEASON_MONTHS: Record<Season, [number, number, number]> = {
  winter: [12, 1, 2],
  spring: [3,  4, 5],
  summer: [6,  7, 8],
  autumn: [9, 10, 11],
}

// Returns 0.5 at the very start/end of a season, 1.0 at the peak middle month.
// This creates visible variation between e.g. Jan (peak) and Feb (winding down).
function getSeasonDepth(season: Season, month: number, day: number): number {
  const months = SEASON_MONTHS[season]
  const idx = months.indexOf(month)
  if (idx === -1) return 0.7

  let offset = day
  for (let i = 0; i < idx; i++) offset += MONTH_LENGTHS[months[i]]
  const totalDays = months.reduce((sum, m) => sum + MONTH_LENGTHS[m], 0)

  const t = (offset - 1) / Math.max(totalDays - 1, 1)
  return 0.5 + 0.5 * Math.sin(t * Math.PI)
}

// Primary particle count multiplier for outgoing months (2,5,8,11).
// Blend rises 0→0.75 as days go 20→end; primaryFade falls 1.0→0.35 in lockstep.
// At blend=0 (days 1-19): full particles. At blend=0.75 (end of month): 35% remain.
// For all other months returns 1.0.
export function getPrimaryFade(month: number, blend: number): number {
  if (![2, 5, 8, 11].includes(month)) return 1
  return 1 - Math.min(blend, 0.75) / 0.75 * 0.65
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7)   return 'dawn'
  if (hour >= 7 && hour < 11)  return 'morning'
  if (hour >= 11 && hour < 16) return 'afternoon'
  if (hour >= 16 && hour < 19) return 'golden'
  if (hour >= 19 && hour < 21) return 'evening'
  return 'night'
}

export function getSeasonState(date: Date, darkMode: boolean): SeasonState {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const config = SEASON_MAP[month]

  const blend = config.blendFn(day)
  const daysInMonth = MONTH_LENGTHS[month]
  const colorBlend = [2, 5, 8, 11].includes(month)
    ? Math.max(0, Math.min(1, (day - (daysInMonth - 5)) / 5))
    : 0

  return {
    primary: config.primary,
    secondary: config.secondary,
    blend,
    depth: getSeasonDepth(config.primary, month, day),
    primaryFade: getPrimaryFade(month, blend),
    colorBlend,
    month,
    day,
    timeOfDay: getTimeOfDay(hour),
    hour,
    darkMode,
  }
}
