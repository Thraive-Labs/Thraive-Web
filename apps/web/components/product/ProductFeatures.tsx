'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ProductDetail } from '@/lib/product-details'

function FeatureIcon({ name, accent }: { name: string; accent: string }) {
  const icons: Record<string, React.ReactNode> = {
    table: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M3 9h16M9 9v10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    order: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M6 2h10l2 5H4L6 2Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="3" y="7" width="16" height="13" rx="1.5" stroke={accent} strokeWidth="1.5" />
        <path d="M8 12h6M8 16h4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    kitchen: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="14" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M7 8h8M7 12h5M15 12h1" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bill: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 2h14v18l-3-2-3 2-3-2-3 2-2-2V2Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 8h6M8 12h6M8 16h4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    report: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M7 15l3-4 3 2 3-5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    offline: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 14v4M8 18h6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 10c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        <circle cx="11" cy="13" r="2" stroke={accent} strokeWidth="1.5" />
      </svg>
    ),
    inventory: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 6l8-4 8 4v10l-8 4-8-4V6Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 2v18M3 6l8 4 8-4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    prescription: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="2" width="14" height="18" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M8 7h6M8 11h6M8 15h3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 12l3 4" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    alert: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L2 19h18L11 2Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 9v4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="15.5" r="1" fill={accent} />
      </svg>
    ),
    customer: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="7" r="4" stroke={accent} strokeWidth="1.5" />
        <path d="M3 19c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    returns: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 8h10a5 5 0 0 1 0 10H4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 4L4 8l4 4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    catalog: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" />
        <rect x="12" y="3" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" />
        <rect x="3" y="12" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" />
        <rect x="12" y="12" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" />
      </svg>
    ),
    barcode: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 4h2v14H4zM8 4h1v14H8zM11 4h2v14h-2zM15 4h1v14h-1zM18 4h-1v14h1z" fill={accent} />
        <path d="M2 8h20M2 16h20" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      </svg>
    ),
    agent: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="6" r="3.5" stroke={accent} strokeWidth="1.5" />
        <path d="M5 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="5" r="2" stroke={accent} strokeWidth="1.2" />
        <circle cx="4" cy="5" r="2" stroke={accent} strokeWidth="1.2" />
      </svg>
    ),
    route: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="5" cy="5" r="2.5" stroke={accent} strokeWidth="1.5" />
        <circle cx="17" cy="17" r="2.5" stroke={accent} strokeWidth="1.5" />
        <path d="M5 7.5C5 11 10 11 11 11s6 0 6 3.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    delivery: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M2 13l3-8h10l3 8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="13" width="18" height="5" rx="1.5" stroke={accent} strokeWidth="1.5" />
        <circle cx="6" cy="20" r="1.5" stroke={accent} strokeWidth="1.5" />
        <circle cx="16" cy="20" r="1.5" stroke={accent} strokeWidth="1.5" />
      </svg>
    ),
    jobcard: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="2" width="14" height="18" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M8 7h6M8 11h6M8 15h4" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 15l1.5 1.5L18 14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    history: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke={accent} strokeWidth="1.5" />
        <path d="M11 7v4l3 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 3L3 5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    parts: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M14.5 3a4 4 0 0 1 0 8 4 4 0 0 1 0-8Z" stroke={accent} strokeWidth="1.5" />
        <path d="M3 19l6-6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 10l-7 7" stroke={accent} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
        <circle cx="5" cy="17" r="2" stroke={accent} strokeWidth="1.5" />
      </svg>
    ),
    technician: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="6" r="3.5" stroke={accent} strokeWidth="1.5" />
        <path d="M5 18c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 11l2 2-4 4-2-2" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    sms: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 4h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H7l-4 3V5a1 1 0 0 1 1-1Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M7 9h8M7 13h5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    billing: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="12" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M3 9h16" stroke={accent} strokeWidth="1.5" />
        <path d="M7 13h3M14 13h1" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    pitch: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M2 12c2-5 5-8 9-8s7 3 9 8c-2 5-5 8-9 8s-7-3-9-8Z" stroke={accent} strokeWidth="1.5" />
        <circle cx="11" cy="12" r="3" stroke={accent} strokeWidth="1.5" />
        <path d="M11 12l3-3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    exercise: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 12h4l3-8 4 16 3-8h5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    plan: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="2" stroke={accent} strokeWidth="1.5" />
        <path d="M3 8h16" stroke={accent} strokeWidth="1.5" />
        <path d="M7 3v5M15 3v5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 13h8M7 17h5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    progress: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 18V10l4 3 4-8 3 5 3-3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20h14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    voice: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="8" y="2" width="6" height="12" rx="3" stroke={accent} strokeWidth="1.5" />
        <path d="M4 10a7 7 0 0 0 14 0" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 17v3M8 20h6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  }

  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-lg)',
        background: `${accent}15`,
        border: `1px solid ${accent}25`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        flexShrink: 0,
      }}
    >
      {icons[name] ?? (
        <div style={{ width: 22, height: 22, background: accent, borderRadius: 4, opacity: 0.5 }} />
      )}
    </div>
  )
}

export default function ProductFeatures({ product }: { product: ProductDetail }) {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{ padding: '96px 0' }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <SectionLabel>Features</SectionLabel>
          <h2
            id="features-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Everything you need, nothing you don&rsquo;t.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px 48px',
          }}
          className="grid-3"
        >
          {product.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <FeatureIcon name={feature.iconName} accent={product.accent} />
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
