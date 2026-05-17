interface LogoMarkProps {
  size?: number
  glowing?: boolean
}

export default function LogoMark({ size = 32, glowing = false }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      style={{
        filter: glowing
          ? 'drop-shadow(0 0 8px var(--color-brand-bright))'
          : 'none',
        flexShrink: 0,
      }}
    >
      <path
        d="M24 4 L44 24 L24 44 L4 24 Z"
        stroke="var(--color-brand-bright)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M24 12 L36 24 L24 36 L12 24 Z"
        stroke="var(--color-brand)"
        strokeWidth="1"
        fill="rgba(124,58,237,0.12)"
      />
      <circle cx="24" cy="24" r="3" fill="var(--color-brand-bright)" />
      <circle cx="24" cy="4" r="1.5" fill="var(--color-brand)" />
      <circle cx="44" cy="24" r="1.5" fill="var(--color-brand)" />
      <circle cx="24" cy="44" r="1.5" fill="var(--color-brand)" />
      <circle cx="4" cy="24" r="1.5" fill="var(--color-brand)" />
    </svg>
  )
}
