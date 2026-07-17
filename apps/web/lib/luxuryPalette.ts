// Fixed "Editorial Warmth" accent palette — applied whenever the seasonal engine
// is turned off (the default while the redesign is being evaluated in demo mode).
//
// Consumed by styles/globals.css via the zero-specificity `:where(:root)` /
// `:where([data-mode="dark"])` fallback blocks for the --season-* tokens, so
// every component that already reads var(--season-accent) etc. gets this
// palette automatically with no code changes. Keep these hex values in sync
// with globals.css if either changes.
export const LUXURY_PALETTE = {
  light: {
    '--season-ambient': '#D9A15C',
    '--season-ambient-dim': '#C2854A',
    '--season-glow': 'rgba(166, 83, 31, 0.08)',
    '--season-glow-soft': 'rgba(166, 83, 31, 0.05)',
    '--season-bg-tint': 'rgba(201, 112, 58, 0.03)',
    '--season-card-border': 'rgba(166, 83, 31, 0.14)',
    '--season-accent': '#A6531F',
    '--season-btn-bg': '#8A4118',
    '--season-btn-hover': '#6F340F',
  },
  dark: {
    '--season-ambient': '#D9A15C',
    '--season-ambient-dim': '#C2854A',
    '--season-glow': 'rgba(217, 139, 79, 0.12)',
    '--season-glow-soft': 'rgba(217, 139, 79, 0.05)',
    '--season-bg-tint': 'rgba(201, 112, 58, 0.03)',
    '--season-card-border': 'rgba(217, 139, 79, 0.16)',
    '--season-accent': '#D98B4F',
    '--season-btn-bg': '#8A4118',
    '--season-btn-hover': '#6F340F',
  },
} as const
