import Image from 'next/image'
import { GRAIN_DATA_URI } from './GrainOverlay'

interface EditorialImageProps {
  src: string
  alt: string
  /** CSS aspect-ratio, e.g. '4 / 5', '16 / 10'. Default portrait-leaning editorial crop. */
  aspectRatio?: string
  priority?: boolean
  sizes?: string
  radius?: string
  className?: string
  style?: React.CSSProperties
}

// Shared art-direction wrapper for every real photo on the site — a rounded
// frame, soft shadow, and grain so stock photography today reads as one
// deliberate art direction. The color grade is deliberately light-touch: the
// UI chrome carries the blue/black/white precision, the photography carries
// the human warmth as shot — we don't want to flatten that with a heavy grade.
export default function EditorialImage({
  src,
  alt,
  aspectRatio = '4 / 5',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  radius = 'var(--radius-lg)',
  className,
  style,
}: EditorialImageProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio,
        borderRadius: radius,
        overflow: 'hidden',
        boxShadow: '0 24px 60px -20px rgba(6,9,15,0.30), 0 4px 16px rgba(6,9,15,0.10)',
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{
          objectFit: 'cover',
          filter: 'contrast(104%) saturate(102%)',
        }}
      />

      {/* Vignette — deepens the frame edge so photos feel bordered/composed */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(120% 120% at 50% 18%, transparent 60%, rgba(6,9,15,0.16) 100%)',
        }}
      />

      {/* Grain — matches the site-wide GrainOverlay treatment on the image itself */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `url("${GRAIN_DATA_URI}")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
          opacity: 0.05,
        }}
      />
    </div>
  )
}
