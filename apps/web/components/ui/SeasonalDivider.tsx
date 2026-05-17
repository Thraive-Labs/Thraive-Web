interface SeasonalDividerProps {
  className?: string
}

export default function SeasonalDivider({ className = '' }: SeasonalDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`h-px my-20 ${className}`}
      style={{
        background:
          'linear-gradient(to right, transparent, var(--season-ambient) 30%, var(--season-ambient) 70%, transparent)',
        opacity: 0.3,
      }}
    />
  )
}
