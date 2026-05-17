import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function GlassCard({ children, className = '', style, ...props }: GlassCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] ${className}`}
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'var(--glass-blur)',
        border: 'var(--glass-border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
