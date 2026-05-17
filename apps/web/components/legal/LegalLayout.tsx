import type { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: ReactNode
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '80px 24px 120px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 0 }}>
          Last updated: {lastUpdated}
        </p>
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--border)',
            margin: '24px 0 48px',
          }}
        />
        <div className="legal-content">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
