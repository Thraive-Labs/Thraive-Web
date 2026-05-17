'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import type { ProductDetail } from '@/lib/product-details'

export default function ProductCTA({ product }: { product: ProductDetail }) {
  return (
    <section
      aria-labelledby="product-cta-heading"
      style={{
        padding: '96px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 100%, ${product.accent}14, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            maxWidth: 600,
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-xl)',
              background: `${product.accent}18`,
              border: `1px solid ${product.accent}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z"
                stroke={product.accent}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            id="product-cta-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}
          >
            Ready to get started?
          </h2>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: 40,
            }}
          >
            Try {product.name} free for 14 days. No credit card required. Available on{' '}
            {product.platforms.join(', ')}.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="#pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 52,
                padding: '0 32px',
                borderRadius: 'var(--radius-md)',
                background: product.accent,
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 150ms, transform 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.opacity = '0.88'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.opacity = '1'
                el.style.transform = ''
              }}
            >
              Start free trial
            </a>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 52,
                padding: '0 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 16,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = product.accent
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              Talk to sales
            </a>
          </div>

          <p
            style={{
              marginTop: 28,
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            Questions?{' '}
            <a
              href="/contact"
              style={{ color: product.accent, textDecoration: 'none', fontWeight: 500 }}
            >
              Contact our team
            </a>{' '}
            — we respond within one business day.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
