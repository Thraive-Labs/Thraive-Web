// Fixed "Editorial Warmth" accent palette — applied whenever the seasonal engine
// is turned off (the default while the redesign is being evaluated in demo mode).
// Blue / black / white: warmth here comes from the photography and human content,
// not the chrome — the UI itself stays precise, monochrome, and blue-accented.
//
// Consumed by styles/globals.css via the zero-specificity `:where(:root)` /
// `:where([data-mode="dark"])` fallback blocks for the --season-* tokens, so
// every component that already reads var(--season-accent) etc. gets this
// palette automatically with no code changes. Keep these hex values in sync
// with globals.css if either changes.
export const LUXURY_PALETTE = {
  light: {
    '--season-ambient': '#60A5FA',
    '--season-ambient-dim': '#3B82F6',
    '--season-glow': 'rgba(37, 99, 235, 0.08)',
    '--season-glow-soft': 'rgba(37, 99, 235, 0.05)',
    '--season-bg-tint': 'rgba(37, 99, 235, 0.03)',
    '--season-card-border': 'rgba(37, 99, 235, 0.14)',
    '--season-accent': '#2455E8',
    '--season-btn-bg': '#1D4ED8',
    '--season-btn-hover': '#1E40AF',
  },
  dark: {
    '--season-ambient': '#60A5FA',
    '--season-ambient-dim': '#3B82F6',
    '--season-glow': 'rgba(96, 165, 250, 0.14)',
    '--season-glow-soft': 'rgba(96, 165, 250, 0.06)',
    '--season-bg-tint': 'rgba(37, 99, 235, 0.03)',
    '--season-card-border': 'rgba(96, 165, 250, 0.18)',
    '--season-accent': '#5B8DFF',
    '--season-btn-bg': '#1D4ED8',
    '--season-btn-hover': '#1E40AF',
  },
} as const
