# Seasonal Engine

The heart of the Thraive Labs website. Everything visual flows from here.

The site has a living identity that changes with the calendar and the clock. The same homepage visited in January looks and feels different from July. The same page at 6am feels different from 10pm. This is not a gimmick — it is the brand.

---

## Architecture Overview

```
Next.js layout.tsx (server)
  → calculates current season, month blend, time-of-day
  → applies data attributes to <html> element
  → passes SeasonState as a context value

Client components:
  SeasonalEngine.tsx     orchestrates all visual layers
    ├── ParticleCanvas   falling particles
    ├── AccumulationCanvas  bottom pile accumulation
    └── AuraLayer        silk thread ambient glow

LoadingScreen.tsx        shown on first page load only
  → animates independently
  → reveals page when done
```

---

## Season and Month Mapping

```typescript
// lib/seasonal.ts

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'golden' | 'evening' | 'night'

export interface SeasonState {
  primary: Season
  secondary: Season | null
  blend: number              // 0–0.75, secondary particle blend factor
  depth: number              // 0.5–1.0, bell curve position within the 3-month season window
                             // 0.5 at season start/end, 1.0 at peak middle month
                             // scales particle count — Jan peak differs from Feb winding down
  primaryFade: number        // 1.0 normally; ramps down to 0.35 over days 20–end of outgoing months
  colorBlend: number         // 0–1 over the last 5 days of outgoing months (2/5/8/11)
                             // drives gradual interpolation of all UI CSS vars
  month: number              // 1-12
  day: number                // 1-31
  timeOfDay: TimeOfDay
  hour: number               // 0-23
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
// Particle count is identical at the boundary for a seamless hand-off.
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

  return {
    primary: config.primary,
    secondary: config.secondary,
    blend: config.blendFn(day),
    month,
    day,
    timeOfDay: getTimeOfDay(hour),
    hour,
    darkMode,
  }
}
```

---

## CSS Token System

Seasonal colors are applied as CSS custom properties on the `<html>` element. Components use these tokens — never hardcoded colors.

### Base tokens (shared across light/dark)

```css
/* styles/globals.css */
:root {
  /* Typography */
  --font-display: 'Cal Sans', 'Instrument Serif', Georgia, serif;
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;
  --space-32: 128px;

  /* Radii */
  --radius-sm: 6px;  --radius-md: 10px;
  --radius-lg: 16px; --radius-xl: 24px;
  --radius-full: 9999px;

  /* Product accent colors — fixed, never change */
  --color-wildcafe:  #F97316;
  --color-pharmacy:  #06B6D4;
  --color-smartpos:  #10B981;
  --color-routeflow: #3B82F6;
  --color-autoserv:  #8B5CF6;
  --color-sonara:    #7C3AED;

  /* Brand */
  --color-brand: #7C3AED;
  --color-brand-bright: #8B5CF6;
  --color-brand-dim: #5B21B6;
}
```

### Light mode base

```css
[data-mode="light"] {
  --bg:              #FAFAFA;
  --bg-subtle:       #F4F4F5;
  --bg-card:         #FFFFFF;
  --bg-glass:        rgba(255, 255, 255, 0.75);
  --border:          #E4E4E7;
  --border-subtle:   #F0F0F1;
  --text-primary:    #09090B;
  --text-secondary:  #52525B;
  --text-muted:      #A1A1AA;
  --glass-blur:      blur(20px) saturate(160%);
  --glass-border:    1px solid rgba(0, 0, 0, 0.06);
}
```

### Dark mode base

```css
[data-mode="dark"] {
  --bg:              #09090B;
  --bg-subtle:       #111113;
  --bg-card:         #18181B;
  --bg-glass:        rgba(24, 24, 27, 0.8);
  --border:          #27272A;
  --border-subtle:   #1C1C1F;
  --text-primary:    #FAFAFA;
  --text-secondary:  #A1A1AA;
  --text-muted:      #52525B;
  --glass-blur:      blur(20px) saturate(180%);
  --glass-border:    1px solid rgba(255, 255, 255, 0.06);
}
```

### Seasonal token layers (applied on top of mode)

These define the ambient color, glow, and particle colors. Both light and dark mode use the same seasonal tokens — the season applies over whichever mode is active.

```css
/* styles/seasonal/winter.css */
[data-season="winter"] {
  --season-ambient:        #BAE6FD;   /* ice blue */
  --season-ambient-dim:    #7DD3FC;
  --season-glow:           rgba(186, 230, 253, 0.12);
  --season-glow-soft:      rgba(186, 230, 253, 0.05);
  --season-bg-tint:        rgba(186, 230, 253, 0.04);  /* added to --bg */
  --season-card-border:    rgba(186, 230, 253, 0.15);
  --season-accent:         #0EA5E9;
  --particle-primary:      #E0F2FE;   /* snowflake color */
  --particle-secondary:    #BAE6FD;
  --particle-glow:         rgba(224, 242, 254, 0.4);
  --accumulation-color:    #E0F2FE;
  --accumulation-glow:     rgba(224, 242, 254, 0.3);
  --aura-color-1:          #BAE6FD;
  --aura-color-2:          #7DD3FC;
  --aura-color-3:          #E0F2FE;
}

/* styles/seasonal/spring.css */
[data-season="spring"] {
  --season-ambient:        #FBCFE8;   /* sakura pink */
  --season-ambient-dim:    #F9A8D4;
  --season-glow:           rgba(251, 207, 232, 0.12);
  --season-glow-soft:      rgba(251, 207, 232, 0.05);
  --season-bg-tint:        rgba(251, 207, 232, 0.04);
  --season-card-border:    rgba(251, 207, 232, 0.2);
  --season-accent:         #EC4899;
  --particle-primary:      #FBCFE8;   /* cherry blossom pink */
  --particle-secondary:    #FDF2F8;   /* pale petal */
  --particle-tertiary:     #F472B6;   /* plum blossom deeper pink */
  --particle-glow:         rgba(251, 207, 232, 0.3);
  --accumulation-color:    #FBCFE8;
  --accumulation-glow:     rgba(251, 207, 232, 0.25);
  --aura-color-1:          #FBCFE8;
  --aura-color-2:          #FDF2F8;
  --aura-color-3:          #F9A8D4;
}

/* styles/seasonal/summer.css */
[data-season="summer"] {
  --season-ambient:        #FDE68A;   /* warm gold */
  --season-ambient-dim:    #FCD34D;
  --season-glow:           rgba(253, 230, 138, 0.12);
  --season-glow-soft:      rgba(253, 230, 138, 0.05);
  --season-bg-tint:        rgba(253, 230, 138, 0.03);
  --season-card-border:    rgba(253, 230, 138, 0.2);
  --season-accent:         #F59E0B;
  --particle-primary:      #FDE68A;   /* gold dust */
  --particle-secondary:    #FCD34D;
  --particle-glow:         rgba(253, 230, 138, 0.5);
  --accumulation-color:    #FDE68A;
  --aura-color-1:          #FDE68A;
  --aura-color-2:          #FCD34D;
  --aura-color-3:          #FEF3C7;
  /* night-specific for summer */
  --firefly-color:         #86EFAC;
  --firefly-glow:          rgba(134, 239, 172, 0.6);
}

/* styles/seasonal/autumn.css */
[data-season="autumn"] {
  --season-ambient:        #FB923C;   /* burnt orange */
  --season-ambient-dim:    #F97316;
  --season-glow:           rgba(251, 146, 60, 0.12);
  --season-glow-soft:      rgba(251, 146, 60, 0.05);
  --season-bg-tint:        rgba(251, 146, 60, 0.04);
  --season-card-border:    rgba(251, 146, 60, 0.2);
  --season-accent:         #EA580C;
  --particle-primary:      #FB923C;   /* orange leaf */
  --particle-secondary:    #B45309;   /* burgundy leaf */
  --particle-tertiary:     #D97706;   /* gold leaf */
  --particle-rain:         rgba(148, 163, 184, 0.4);
  --particle-glow:         rgba(251, 146, 60, 0.2);
  --accumulation-color:    #FB923C;
  --accumulation-glow:     rgba(251, 146, 60, 0.2);
  --aura-color-1:          #FB923C;
  --aura-color-2:          #FDE68A;
  --aura-color-3:          #B45309;
}
```

### Time-of-day overlay tokens

```css
[data-time="dawn"] {
  --tod-tint:   rgba(251, 207, 232, 0.06);  /* soft rose dawn */
  --tod-glow:   rgba(251, 191, 36, 0.08);   /* warm horizon */
}
[data-time="morning"] {
  --tod-tint:   rgba(255, 255, 255, 0);     /* neutral */
  --tod-glow:   rgba(255, 255, 255, 0);
}
[data-time="afternoon"] {
  --tod-tint:   rgba(255, 255, 255, 0);
  --tod-glow:   rgba(255, 255, 255, 0);
}
[data-time="golden"] {
  --tod-tint:   rgba(251, 191, 36, 0.05);   /* golden hour warmth */
  --tod-glow:   rgba(251, 146, 60, 0.08);
}
[data-time="evening"] {
  --tod-tint:   rgba(139, 92, 246, 0.05);   /* dusk violet */
  --tod-glow:   rgba(124, 58, 237, 0.06);
}
[data-time="night"] {
  --tod-tint:   rgba(15, 23, 42, 0.12);     /* deeper dark */
  --tod-glow:   rgba(124, 58, 237, 0.04);
}
```

---

## Loading Screen

The first thing any visitor sees. This is not a spinner. This is a statement.

### Visual Design

```
Full viewport, fixed position, z-index 9999
Background: --bg (follows dark/light mode, already calculated server-side)

Layer 1 — Particle fall:
  Season-appropriate particles fall from top as loading begins
  Same particle system as main site but slightly denser
  Accumulation at bottom begins building immediately

Layer 2 — Aura (silk thread):
  See Aura Layer spec below
  Begins flowing immediately, intensifies as loading progresses

Layer 3 — Logo reveal:
  [◈]  Thraive Labs
  Logo mark and wordmark centered

  Animation sequence:
  0ms:    Nothing visible
  300ms:  [◈] logo mark fades in + scales from 0.8 to 1.0 (spring ease)
  600ms:  "Thraive" slides in from left, letter by letter stagger
           Each letter: translateX(-20px) → 0, opacity 0 → 1
           30ms stagger between letters
  900ms:  "Labs" slides in from right, same stagger
  1200ms: Full wordmark visible
  1500ms: Tagline fades in below: "Thraive to the next level"
           --text-sm, --color-text-muted, tracking-wider
  2000ms: Subtle glow pulse around logo (brand color)
  2500ms: If page loaded: begin exit transition
           If not loaded: hold until page ready

Layer 4 — Progress (invisible):
  Loading progress is tracked internally
  No visible progress bar — the aura intensity communicates loading progress

Exit transition:
  Logo scales up slightly (1.0 → 1.04) then fades out (300ms)
  Particles and aura fade out (300ms, same timing)
  Background fades to transparent (400ms)
  Page content fades in underneath as loading screen fades (overlap 200ms)
  Total exit: 500ms

Minimum display time: 2500ms (even if page loads in 100ms)
Maximum display time: 8000ms (then force show page with whatever loaded)
```

### Loading Screen Code Structure

```typescript
// components/seasonal/LoadingScreen.tsx

interface LoadingScreenProps {
  onComplete: () => void
  season: Season
  timeOfDay: TimeOfDay
  darkMode: boolean
}

// Internal state machine:
// 'animating' → 'ready' (page loaded) → 'exiting' → unmounted

// The logo wordmark uses individual <motion.span> per character
// Staggered with framer-motion staggerChildren
// The [◈] symbol is a custom SVG, not a character
```

---

## Aura Layer (Silk Thread Effect)

This is the ambient flowing light that runs through the loading screen and subtly on the main page.

### What it looks like

Imagine a thin silk thread or ribbon of light that flows organically across the screen. It has no fixed path — it curves and drifts slowly, following a noise-based path. The thread is semi-transparent, glowing in the season's ambient color. Multiple threads at different speeds and opacities layer to create depth.

On the **loading screen**: 3-4 threads, more visible (opacity 30-50%), fills the screen.

On the **main page**: 1-2 threads, very subtle (opacity 8-15%), only visible in the hero section and between major sections. Does not distract from content.

### Technical Implementation

```typescript
// components/seasonal/AuraLayer.tsx
// Canvas-based. Uses Perlin noise or simplex noise for organic path generation.

interface AuraThread {
  points: { x: number; y: number }[]  // bezier control points
  opacity: number
  width: number          // 1px-4px, feathered
  color: string          // from --aura-color-1/2/3
  speed: number          // how fast the path evolves
  offset: number         // phase offset so threads don't move in sync
}

// Each frame:
// 1. Advance time by deltaTime
// 2. Recalculate bezier control points using noise(x, time * speed + offset)
// 3. Draw smooth bezier curve through points
// 4. Apply gradient along the curve (color fades at start and end of thread)
// 5. Apply blur filter to canvas for softness

// The thread is drawn as a series of small bezier segments
// Each segment slightly thicker in the middle, tapering at ends
// Creates the "silk ribbon" appearance

// Color:
// Thread cycles through --aura-color-1, --aura-color-2, --aura-color-3
// Transition between colors is smooth (interpolated over 3-5 seconds)
// Never abrupt

// On loading screen: threads start dim, reach full opacity at 800ms
// On main page: threads are always subtle, never more than 15% opacity
// Both: threads respect prefers-reduced-motion (static glow instead)
```

### Reduced Motion Fallback

When `prefers-reduced-motion` is active or user has enabled reduce motion:
- Loading screen: static centered logo, simple fade in and out. No particles, no aura.
- Main page: no particles, no aura. Just the seasonal color tint on backgrounds.

---

## Particle System

All particles are Canvas-based. Never DOM elements. One `<canvas>` per layer.

### Particle Definitions

```typescript
// lib/particles.ts

export interface ParticleConfig {
  count: number           // active particles at any time (scaled by depth × multiplier)
  shapes: ParticleShape[] // fallback shape pool (overridden per-month by getShapesForMonth)
  sizeRange: [number, number]    // min/max px
  opacityRange: [number, number] // min/max
  fallSpeed: [number, number]    // px/second min/max
  swayAmount: number      // horizontal drift amplitude
  swaySpeed: number       // horizontal drift frequency
  rotationSpeed: [number, number] // degrees/second, can be negative
  spawnFromTop: boolean   // spawn from y=0 or random y
}

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
    rotationSpeed: [-90, 90],  // petals tumble more
    spawnFromTop: true,
  },
  summer: {
    count: 80,             // many but tiny
    shapes: [DUST_1],      // tiny circles/dots — summer overhaul planned
    sizeRange: [2, 6],
    opacityRange: [0.15, 0.45],
    fallSpeed: [-15, -30], // negative = drift upward
    swayAmount: 15,
    swaySpeed: 1.2,
    rotationSpeed: [0, 0],
    spawnFromTop: false,   // spawn from bottom, drift up
  },
  autumn: {
    count: 50,
    shapes: [LEAF_OAK, LEAF_MAPLE, LEAF_ELM, LEAF_BIRCH],
    sizeRange: [14, 28],
    opacityRange: [0.6, 0.95],
    fallSpeed: [60, 120],
    swayAmount: 60,
    swaySpeed: 0.4,
    rotationSpeed: [-180, 180], // dramatic tumble
    spawnFromTop: true,
  },
}
```

### Month-specific particle overrides

`getMonthOverrides(season, month)` returns `{ shapes, sizeRange, fallSpeed }` for every month, giving each calendar month a distinct visual character. `spawnParticle` always calls this — `cfg.shapes`, `cfg.sizeRange`, and `cfg.fallSpeed` are only used as documentation defaults; the overrides take precedence.

```
Winter
  December  shapes: SNOWFLAKE_2 + SNOWFLAKE_5 only   size: 2–8px    speed: 25–55px/s
            tiny delicate flakes drifting gently — first snow of the season
  January   shapes: all 6 snowflake types             size: 8–18px   speed: 55–95px/s
            large heavy flakes falling fast — peak blizzard
  February  shapes: SNOWFLAKE_2 + SNOWFLAKE_5 only   size: 3–10px   speed: 30–65px/s
            smaller lighter flakes — winter winding down, spring blend begins

Spring
  March     shapes: PLUM_1 + PLUM_2 only             size: 6–14px   speed: 20–45px/s
            compact plum blossoms — plum tree blooms first in early spring
  April     shapes: PETAL_1-3 + PLUM_1-2 full mix    size: 8–20px   speed: 25–55px/s
            peak spring — cherry and plum both in bloom
  May       shapes: PETAL_1 + PETAL_2 + PETAL_3 only size: 10–22px  speed: 25–55px/s
            wide open cherry blossoms — plum done, cherry at its peak

Summer
  June      shapes: DUST_1 (gold dust) + 24 FIREFLIES full-screen (night+evening only)
            size: 2–6px    speed: −15 to −30px/s   fireflies: drift 5–15px/s, blink 0.6–2.0s
  July      shapes: BUTTERFLY (monarch/swallowtail bezier wings)
            size: 14–28px  speed: 10–28px/s (falling)  count: 28
            dust trail: DustTrail system emits golden particles when wings open
            wing fold: ctx.scale(spread,1) where spread = |sin(wingPhase)|
  August    shapes: EMBER (rising sparks, upward drift)
            size: 2–5px    speed: −45 to −100px/s   maxAge: 2.4s   count: 70
            embers fade via effectiveOpacity = opacity × (1 − age/maxAge)

Autumn
  September shapes: LEAF_ELM + LEAF_BIRCH only       size: 10–18px  speed: 45–85px/s
            small light leaves — early fall, colour just starting
  October   shapes: all four types (OAK/MAPLE/ELM/BIRCH) size: 14–28px speed: 60–120px/s
            peak autumn — maximum leaf chaos, full colour range
  November  shapes: LEAF_OAK + LEAF_ELM only         size: 18–32px  speed: 80–140px/s
            large heavy leaves falling fast — late fall, sparse and weighty
```

Combined with the `depth` bell-curve (0.5 at season edges → 1.0 at peak month) scaling particle *count*, every month is distinct in what falls, how big it is, how fast it falls, and how many appear.

### SVG Shape Definitions

Each shape is defined as an SVG path string. Rendered to an offscreen canvas once at startup, then drawn via `drawImage()` for performance.

```typescript
// Snowflakes — 6-pointed crystal shapes, each different
const SNOWFLAKE_1 = `M 0 -10 L 0 10 M -8.66 -5 L 8.66 5 M -8.66 5 L 8.66 -5
                     M 0 -10 L -3 -7 M 0 -10 L 3 -7 ...` // branching crystal

const SNOWFLAKE_2 = `...` // simpler 6-point star
// ... 4 more variants

// Cherry/Plum blossom petals — organic tear-drop shapes with gentle curves
const PETAL_1 = `M 0 -10 C 5 -8 8 -2 8 2 C 8 7 4 10 0 10 C -4 10 -8 7 -8 2 C -8 -2 -5 -8 0 -10 Z`
// Filled with gradient: --particle-primary at center, --particle-secondary at edges

const PETAL_2 = `...` // slightly wider petal
const PETAL_3 = `...` // more pointed petal
const PLUM_1 = `...`  // smaller, rounder
const PLUM_2 = `...`  // slightly deeper pink variant

// Autumn leaves — realistic silhouettes
const LEAF_OAK    = `M 0 -15 C 5 -12 10 -5 8 0 C 6 5 10 8 8 15 L 0 18 L -8 15 C -10 8 -6 5 -8 0 C -10 -5 -5 -12 0 -15 Z`
const LEAF_MAPLE  = `...` // classic maple leaf shape, 5-pointed
const LEAF_ELM    = `...` // oval with serrated edges
const LEAF_BIRCH  = `...` // small, diamond-shaped

// Gold dust — simple small circles, drawn natively not as SVG
const DUST_1 = null // drawn as ctx.arc() calls for performance
```

### Particle Colors per Season

```typescript
function getParticleColor(season: Season, shape: string, darkMode: boolean): string {
  const colors = {
    winter: {
      fill: '#E0F2FE',
      stroke: '#BAE6FD',
      opacity: 0.85,
    },
    spring: {
      fill: shape.startsWith('PLUM') ? '#F472B6' : '#FBCFE8',
      stroke: shape.startsWith('PLUM') ? '#EC4899' : '#F9A8D4',
      gradient: true,   // petals use radial gradient fill
      opacity: 0.75,
    },
    summer: {
      fill: '#FDE68A',
      stroke: 'none',
      glow: true,        // dust particles have glow
      opacity: 0.4,
    },
    autumn: {
      fill: shape === 'LEAF_OAK'   ? '#FB923C'
           : shape === 'LEAF_MAPLE' ? '#B45309'
           : shape === 'LEAF_ELM'   ? '#D97706'
           : '#EA580C',
      stroke: 'rgba(0,0,0,0.15)',
      opacity: 0.85,
    },
  }
  return colors[season]
}
```

### Rain (Autumn October/November blend)

When `month === 10` or when autumn/winter blend > 0.15:

```typescript
interface RainDrop {
  x: number
  y: number
  length: number   // 8-20px
  speed: number    // 200-300px/second
  opacity: number  // 0.1-0.25
}

// Rain drawn as thin diagonal lines at 70° angle
// ctx.moveTo / ctx.lineTo, strokeStyle rgba(148,163,184, opacity)
// Fast falling, no accumulation (rain doesn't pile up)
// Count: 80-120 drops active at once
```

### Summer Fireflies (Night time only)

When `season === 'summer'` and `timeOfDay === 'night'`:

```typescript
interface Firefly {
  x: number
  y: number
  phase: number       // 0-2π, for blink cycle
  blinkSpeed: number  // how fast it blinks
  driftX: number      // slow horizontal drift
  driftY: number      // slow vertical drift
  size: number        // 3-6px
}

// Fireflies drift very slowly (5-10px/second)
// Blink: opacity oscillates 0 → 0.8 → 0 over 1-3 seconds
// Color: #86EFAC (soft green-yellow)
// Glow: strong glow radius when at peak opacity
// Count: 12-20 fireflies
// Spawn in lower 60% of viewport
```

---

## Particle Accumulation System

The pile that builds at the bottom of the viewport. Rendered on a separate canvas element positioned at the bottom.

### Canvas Setup

```
Position: fixed, bottom 0, left 0, width 100vw, height 120px
z-index: above background, below page content
Pointer events: none
```

### Column-Based Height Map

```typescript
class AccumulationSystem {
  columnWidth = 4       // px per column
  columns: number[]     // height of pile in each column (px from bottom)
  maxPileHeight = 80    // max pile height before clearing starts (px)
  clearThreshold = 0.85 // 85% of max before clear triggers
  particlesLanded = 0

  onParticleLand(x: number, particle: FallingParticle) {
    const col = Math.floor(x / this.columnWidth)
    if (!this.columns[col]) this.columns[col] = 0

    // Add height based on particle size
    const heightAdd = particle.size * 0.4
    this.columns[col] += heightAdd

    // Spread to adjacent columns (snow/leaves spread outward)
    this.spreadToNeighbors(col, heightAdd * 0.3)

    this.particlesLanded++

    // Check if pile needs clearing
    const avgHeight = this.columns.reduce((a, b) => a + b, 0) / this.columns.length
    if (avgHeight > this.maxPileHeight * this.clearThreshold) {
      this.startClearAnimation()
    }
  }

  spreadToNeighbors(col: number, amount: number) {
    // Spread decreasing amounts to adjacent columns
    // Creates organic irregular pile surface
    [-3,-2,-1,1,2,3].forEach((offset, i) => {
      const targetCol = col + offset
      if (targetCol >= 0 && targetCol < this.columns.length) {
        this.columns[targetCol] += amount * (1 - Math.abs(offset) * 0.25)
      }
    })
  }
}
```

### Pile Rendering

```typescript
renderPile(ctx: CanvasRenderingContext2D, season: Season) {
  // Build the pile surface as a path
  ctx.beginPath()
  ctx.moveTo(0, canvasHeight)

  this.columns.forEach((height, i) => {
    const x = i * this.columnWidth
    const y = canvasHeight - height
    // Add slight noise to pile surface for organic feel
    const noise = Math.sin(i * 0.3 + Date.now() * 0.0005) * 1.5
    ctx.lineTo(x, y + noise)
  })

  ctx.lineTo(canvasWidth, canvasHeight)
  ctx.closePath()

  // Fill based on season
  switch(season) {
    case 'winter':
      // Snow — white with subtle blue tint, inner glow
      const snowGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight)
      snowGrad.addColorStop(0, 'rgba(224, 242, 254, 0.9)')
      snowGrad.addColorStop(1, 'rgba(186, 230, 253, 0.6)')
      ctx.fillStyle = snowGrad
      // Add glow effect: shadow
      ctx.shadowColor = 'rgba(224, 242, 254, 0.5)'
      ctx.shadowBlur = 12
      break

    case 'spring':
      // Petals scattered — draw individual petal SVGs at landed positions
      // rather than a solid fill
      this.drawLandedPetals(ctx)
      return  // skip fill

    case 'autumn':
      // Leaves — draw individual leaf SVGs at landed positions
      this.drawLandedLeaves(ctx)
      return  // skip fill

    case 'summer':
      // Dust settles as a very subtle shimmering layer — barely visible
      ctx.fillStyle = 'rgba(253, 230, 138, 0.08)'
      break
  }

  ctx.fill()
  ctx.shadowBlur = 0
}
```

### Clear Animations

```typescript
clearPile(season: Season) {
  switch(season) {
    case 'winter':
      // Snow melts: each column height decreases gradually from edges inward
      // Rate: outer columns decrease 3x faster than center
      // Duration: 4-6 seconds
      this.animateMelt()
      break

    case 'spring':
      // Gust: petals drift sideways with opacity fade
      // Random direction (left or right), 200-400ms duration
      this.animatePetalGust(Math.random() > 0.5 ? 'right' : 'left')
      break

    case 'autumn':
      // Gust: dramatic leaf tumble — leaves pick up speed sideways
      // Some go left, some right, creating a chaotic beautiful sweep
      // Duration: 600-800ms
      this.animateLeafGust()
      break

    case 'summer':
      // Dust simply fades over 2 seconds
      this.animateDustFade()
      break
  }
}
```

### Bounce on Landing

When a particle lands:
```
Brief spring animation at landing point
Particle position: bounces down 20% of its size, then settles
Duration: 150ms, spring ease
Snow: soft, dampened bounce
Leaves: more energetic bounce, slight rotation on landing
Petals: gentle settle, slight flutter (rotation ±5deg)
```

---

## SeasonAccentWord Infection Effect

`components/home/SeasonAccentWord.tsx` — wraps a heading word and shows the next season's color "infecting" it during the outgoing-month transition.

### How it works

1. Reads SeasonState from the `SeasonalEngine` context
2. Guards: only active when `state.secondary !== null && state.blend > 0.01 && isOutgoing(primary, secondary)` (outgoing months only, not incoming)
3. Renders two overlapping `<span>` elements — the base word in `--text-primary` and an overlay span in the next season's accent color
4. The overlay is revealed via a CSS `mask-image` with three radial gradient waves that sweep left-to-right as `blend` increases
5. The wave timing creates a fluid "bleeding" effect

### Where it's used

- HeroSection — "thrive."
- StatementSection — "working."
- ProductsSection — "business."
- ValuesSection — "work."
- ClosingSection — "started?"

---

## UI Color Blend System

`lib/seasonColors.ts` — gradual interpolation of all UI CSS variables during the last 5 days of outgoing months (Feb/May/Aug/Nov).

### Why separate from particle blend

Particle `blend` starts on day 20. UI color `colorBlend` starts on day 24 (last 5 days). This creates a staged effect: the infection words preview the transition first, then the broader UI palette shifts in the final stretch.

### colorBlend formula

```typescript
// Only for months 2, 5, 8, 11. Zero for all others.
colorBlend = Math.max(0, Math.min(1, (day - (daysInMonth - 5)) / 5))
```

### Variables interpolated

All 9 UI tokens:
`--season-accent`, `--season-btn-bg`, `--season-btn-hover`, `--season-ambient`, `--season-ambient-dim`, `--season-glow`, `--season-glow-soft`, `--season-bg-tint`, `--season-card-border`

Particle vars (`--particle-*`, `--aura-color-*`) are NOT interpolated — the particle canvas handles its own blend independently.

### Application flow

1. **Server** — `layout.tsx` calls `getInterpolatedColorVars()` and passes result as `style` prop on `<html>`. Initial render has no flash.
2. **Mount** — `SeasonalEngine` calls `applySeasonColorBlend()` which reads `data-mode` from DOM (corrects for actual dark/light vs server assumption).
3. **Theme toggle** — `MutationObserver` on `data-mode` re-applies with correct mode values.
4. **Dev override** — override handler calls `applySeasonColorBlend()` with new state.

Inline styles on `<html>` have higher specificity than CSS file selectors, so they override the static season CSS variables precisely when needed.

---

## Month Blend Interpolation

When secondary season is non-null, visual properties interpolate between primary and secondary.

```typescript
function interpolateColor(colorA: string, colorB: string, t: number): string {
  // Linear interpolation between two hex colors
  // t = 0 → pure colorA, t = 1 → pure colorB
}

function getBlendedTokens(state: SeasonState): SeasonTokens {
  if (!state.secondary || state.blend === 0) {
    return SEASON_TOKENS[state.primary]
  }

  const primary = SEASON_TOKENS[state.primary]
  const secondary = SEASON_TOKENS[state.secondary]
  const t = state.blend

  return {
    ambient: interpolateColor(primary.ambient, secondary.ambient, t),
    glow: interpolateColor(primary.glow, secondary.glow, t),
    particleBlend: t,  // % of secondary season particles mixed in
    // etc.
  }
}

// Example: February 20 = 72% winter + 28% spring
// → 28% of particles will be spring petals (pale pink)
// → ambient glow mixes ice blue with sakura pink
// → pile mixes snow drift with scattered petal shapes
```

---

## Server-Side Calculation (Next.js)

Seasonal state is calculated server-side in `layout.tsx` to prevent any flash of wrong season on initial load.

```typescript
// app/layout.tsx
import { getSeasonState } from '@/lib/seasonal'
import { getInterpolatedColorVars } from '@/lib/seasonColors'

export default function RootLayout({ children }) {
  const now = new Date()
  const state = getSeasonState(now, true)  // darkMode: true (server default)
  const colorVars = getInterpolatedColorVars(state.primary, state.secondary, state.colorBlend, state.darkMode)

  return (
    <html
      data-season={state.primary}
      data-secondary-season={state.secondary ?? ''}
      data-season-blend={state.blend.toFixed(3)}
      data-time={state.timeOfDay}
      data-mode="light"          // default, THEME_SCRIPT overrides from localStorage
      style={colorVars as React.CSSProperties}  // interpolated UI vars if colorBlend > 0
    >
      <body>{children}</body>
    </html>
  )
}
```

CSS responds immediately to `data-season` attributes. Inline `style` on `<html>` overrides the static CSS vars with interpolated values during the last 5 days of outgoing months. `SeasonalEngine` corrects these on mount for the actual dark/light mode and re-applies on theme toggle via `MutationObserver`.

---

## Performance Requirements

- Particle canvas: must maintain 60fps on mid-range hardware
- Maximum particle counts are tuned for performance (see configs above)
- Offscreen canvas pre-rendering for all particle shapes at startup
- RequestAnimationFrame loop — never setInterval
- Particles outside viewport bounds are culled immediately
- Accumulation canvas redraws only when pile changes (not every frame)
- Aura canvas: max 4 threads, blur applied once via canvas filter
- All canvas operations stop when tab is not visible (Page Visibility API)
- Reduce particle count by 50% on battery saver mode detection
