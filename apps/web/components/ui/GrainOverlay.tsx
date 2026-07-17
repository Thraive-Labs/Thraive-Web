// Static SVG turbulence noise, layered over the whole viewport at low opacity.
// The one cheap, always-on texture cue for the "tangible surface" luxury feel —
// a static background-image, not canvas/JS, so it has no animation or perf cost
// and needs no prefers-reduced-motion handling.
export const GRAIN_DATA_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9980,
        pointerEvents: 'none',
        backgroundImage: `url("${GRAIN_DATA_URI}")`,
        backgroundRepeat: 'repeat',
        mixBlendMode: 'overlay',
        opacity: 0.035,
      }}
    />
  )
}
