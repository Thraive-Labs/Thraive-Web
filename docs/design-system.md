# Design System

## Visual Philosophy

Calm. Modern. Alive. The website breathes with the seasons. Content is spacious. Typography does the heavy lifting. The seasonal engine provides the emotion — the layout provides the clarity.

Never chaotic. Never empty. Guided storytelling through generous space and intentional motion.

---

## Typography

```
Display font:  Cal Sans (headings, hero)
               Fallback: Instrument Serif, Georgia, serif
Body font:     Inter (all body text, UI)
               Fallback: -apple-system, sans-serif
Mono font:     JetBrains Mono (prices, version numbers, code)
               Fallback: Fira Code, monospace
```

### Type Scale

```css
.text-hero  { font-size: 72px; line-height: 1.05; letter-spacing: -0.04em; font-weight: 700; }
.text-4xl   { font-size: 52px; line-height: 1.1;  letter-spacing: -0.03em; font-weight: 700; }
.text-3xl   { font-size: 38px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 700; }
.text-2xl   { font-size: 28px; line-height: 1.2;  letter-spacing: -0.02em; font-weight: 600; }
.text-xl    { font-size: 22px; line-height: 1.3;  letter-spacing: -0.01em; font-weight: 600; }
.text-lg    { font-size: 18px; line-height: 1.5;  font-weight: 400; }
.text-base  { font-size: 16px; line-height: 1.6;  font-weight: 400; }
.text-sm    { font-size: 14px; line-height: 1.6;  font-weight: 400; }
.text-xs    { font-size: 12px; line-height: 1.5;  font-weight: 500; }
.text-2xs   { font-size: 11px; line-height: 1.4;  font-weight: 500; letter-spacing: 0.06em; }
```

---

## Components

### Button

```tsx
// Variants: primary, secondary, ghost, danger
// Sizes: sm (32px), md (40px), lg (48px)

Primary:
  background: var(--color-brand)
  color: white
  border: none
  border-radius: var(--radius-md)
  On hover: background: var(--color-brand-bright), translateY(-1px)
  On press: scale 0.97, 80ms

Secondary:
  background: var(--bg-card)
  color: var(--text-primary)
  border: 1px solid var(--border)
  On hover: border-color: var(--border-bright), translateY(-1px)

Ghost:
  background: transparent
  color: var(--text-secondary)
  border: none
  On hover: background: var(--bg-subtle), color: var(--text-primary)

All buttons:
  font-weight: 500
  transition: all 150ms ease
  cursor: pointer
  white-space: nowrap
```

### Product Card

```tsx
// Used on homepage products section and /products page

<div className="product-card">
  [3px top border in product accent color]
  [product icon 32px]
  [product name + category tag]
  [one-sentence description]
  [platform tags: Windows, Android etc.]
  [Learn more →]
</div>

Styling:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: var(--radius-xl)
  padding: 28px
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease

Hover:
  transform: translateY(-4px)
  box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)
  border-color: var(--season-card-border)
  top border brightens to full product accent color
```

### Glass Card

```tsx
// Used for testimonials, value props, stat displays

background: var(--bg-glass)
backdrop-filter: var(--glass-blur)
border: var(--glass-border)
border-radius: var(--radius-xl)
box-shadow: 0 8px 32px rgba(0,0,0,0.08)
```

### Section Label

```tsx
// The small uppercase label above every section heading
// e.g. "What we build" above the products section

color: var(--color-brand)
font-size: 11px
font-weight: 600
letter-spacing: 0.08em
text-transform: uppercase
margin-bottom: 16px
```

### Seasonal Glow Divider

```tsx
// Between major sections — replaces a hard horizontal rule
// A soft gradient line that fades in and out at edges

height: 1px
background: linear-gradient(
  to right,
  transparent,
  var(--season-ambient) at 30%,
  var(--season-ambient) at 70%,
  transparent
)
opacity: 0.3
margin: 80px 0
```

---

## Layout System

### Container

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px)  { .container { padding: 0 40px; } }
@media (min-width: 1200px) { .container { padding: 0 48px; } }
```

### Section Padding

```css
.section { padding: 96px 0; }
.section-sm { padding: 64px 0; }
.section-lg { padding: 128px 0; }
```

### Grid

```css
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-products { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

@media (max-width: 900px) {
  .grid-3, .grid-products { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .grid-2, .grid-3, .grid-products { grid-template-columns: 1fr; }
}
```

---

## Navbar

```
Height: 64px
Position: sticky top-0
Background: var(--bg-glass)
Backdrop-filter: var(--glass-blur)
Border-bottom: var(--glass-border)
z-index: 100

On scroll > 20px:
  border-bottom: 1px solid var(--border)
  transition: border-color 200ms

Left:   [◈ Thraive Labs] — logo mark SVG + wordmark
Center: [Products ▾]  [About]  [Blog]  (hidden on mobile)
Right:  [☀/☾ dark toggle]  [Sign in]  [Get started →]

Mobile: hamburger menu, full-screen overlay

Products dropdown:
  Opens on hover/click
  Shows all 6 products as a grid (3×2)
  Each: product icon + name + one-line description
  Closes on click outside or escape
  Animated: scaleY from 0.95 + fadeIn, 150ms
```

---

## Footer

```
Background: var(--bg-subtle)
Border-top: 1px solid var(--border)
Padding: 64px 0 32px

Layout:
  Top section: 4 columns
    Col 1: Logo + description + social links
    Col 2: Products (all 6)
    Col 3: Company (About, Blog, Careers, Contact)
    Col 4: Legal + Support

  Bottom bar (border-top):
    Left: © 2026 Thraive Labs. All rights reserved.
    Center: Season indicator — e.g. "Winter 2026" in very muted text
            This is a subtle nod to the seasonal design system
            Users who notice it feel clever for understanding why the site looks the way it does
    Right: Dark mode toggle

Season indicator:
  font-size: 11px
  color: var(--text-muted)
  opacity: 0.6
  No explanation — just present. Let users discover it.
```

---

## Animations (Framer Motion)

### Page entrance

```tsx
// Each section animates in when scrolled into view
// Use Intersection Observer via framer-motion's whileInView

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
}

// Children within a section stagger
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
}
```

### Hero text reveal

```tsx
// Each word in the hero headline animates in
// Split headline into words, wrap each in motion.span
// Stagger: 60ms between words
// Animation: translateY(20px) → 0, opacity 0 → 1, 400ms ease-out
```

### Product card grid entrance

```tsx
// Cards stagger in when section scrolls into view
// Each card: delay = index * 80ms
// Animation: translateY(20px) → 0, opacity 0 → 1
```

### Stats count-up

```tsx
// When stats section enters viewport, numbers count up
// Use framer-motion useMotionValue + useTransform
// Duration: 1200ms, ease-out
// Numbers format with comma separators as they count
```

### Dark mode transition

```tsx
// On toggle: 300ms crossfade via CSS transition on all color tokens
// document.documentElement.setAttribute('data-mode', 'dark')
// CSS: * { transition: background-color 300ms, border-color 300ms, color 300ms; }
// Apply only during toggle, remove after to avoid unwanted transitions
```

---

## Accessibility

- All interactive elements focusable via keyboard
- Focus rings: 2px solid var(--color-brand), 2px offset
- Color contrast: WCAG AA minimum everywhere, AAA for body text
- Alt text on all images
- ARIA labels on icon-only buttons
- Reduce motion: all Framer Motion animations disabled, particles stop, aura shows as static gradient
- Screen reader: section headings properly structured (h1 → h2 → h3)
- Skip to main content link (visually hidden, shown on focus)
