import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  href?: string
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 h-8 text-sm',
  md: 'px-6 h-10 text-sm',
  lg: 'px-8 h-12 text-base',
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[var(--season-btn-bg)] text-white border-transparent ' +
    'hover:bg-[var(--season-btn-hover)] hover:-translate-y-px ' +
    'active:scale-[0.97]',
  secondary:
    'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border)] ' +
    'hover:-translate-y-px hover:border-[var(--season-ambient)] ' +
    'active:scale-[0.97]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] border-transparent ' +
    'hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] ' +
    'active:scale-[0.97]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] ' +
    'font-medium border transition-all duration-150 cursor-pointer ' +
    'focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2 ' +
    'whitespace-nowrap select-none'

  const classes = `${base} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} role="button">
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
