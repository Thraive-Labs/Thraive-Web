'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SeasonAccentWord from '@/components/home/SeasonAccentWord'

export default function ClosingSection() {
  return (
    <section
      aria-labelledby="closing-heading"
      style={{
        padding: '120px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}
        >
          <h2
            id="closing-heading"
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            Ready to get{' '}
            <SeasonAccentWord>started?</SeasonAccentWord>
          </h2>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: 40,
            }}
          >
            Join hundreds of businesses across Sri Lanka who run on Thraive.
            Pick your product and be running today.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 48,
                padding: '0 24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--season-btn-bg)',
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 150ms, transform 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--season-btn-hover)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'var(--season-btn-bg)'
                el.style.transform = ''
              }}
            >
              Explore products
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 48,
                padding: '0 24px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'border-color 150ms, color 150ms',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--season-ambient)'
                el.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border)'
                el.style.color = 'var(--text-secondary)'
              }}
            >
              Get in touch
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
