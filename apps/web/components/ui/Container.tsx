import type { HTMLAttributes, ReactNode } from 'react'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Container({ children, style, ...props }: ContainerProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        paddingLeft: 'clamp(16px, 5vw, 48px)',
        paddingRight: 'clamp(16px, 5vw, 48px)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
