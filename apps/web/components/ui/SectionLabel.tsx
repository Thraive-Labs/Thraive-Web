import type { HTMLAttributes } from 'react'

interface SectionLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string
}

export default function SectionLabel({ children, className = '', ...props }: SectionLabelProps) {
  return (
    <p
      className={`text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--season-accent)] mb-4 ${className}`}
      {...props}
    >
      {children}
    </p>
  )
}
