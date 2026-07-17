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

// Shared art-direction wrapper for every real photo on the site — a consistent
// warm color grade, rounded frame, soft shadow, and grain so stock photography
// today reads as one deliberate art direction rather than assorted stock images,
// and real company photography drops in later with zero visual change.
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
        boxShadow: '0 24px 60px -20px rgba(22,19,15,0.35), 0 4px 16px rgba(22,19,15,0.12)',
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
          filter: 'sepia(8%) saturate(108%) contrast(101%) brightness(101%)',
        }}
      />

      {/* Warm vignette — deepens the frame edge so photos feel bordered/composed */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(120% 120% at 50% 18%, transparent 55%, rgba(22,19,15,0.18) 100%)',
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
          opacity: 0.06,
        }}
      />
    </div>
  )
}
