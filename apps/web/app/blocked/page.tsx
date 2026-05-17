import Link from 'next/link'
import LogoMark from '@/components/ui/LogoMark'

export default function BlockedPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <LogoMark size={36} />
        </div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}
        >
          Account suspended
        </h1>
        <p
          style={{
            fontSize: 15,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Your account has been suspended. If you believe this is a mistake, please contact
          support.
        </p>
        <a
          href="mailto:support@thraive.com"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'var(--season-btn-bg)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Contact support
        </a>
        <p style={{ marginTop: 20 }}>
          <Link
            href="/"
            style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            Return to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
