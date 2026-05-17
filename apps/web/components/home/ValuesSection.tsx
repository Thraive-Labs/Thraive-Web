'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import SeasonAccentWord from '@/components/home/SeasonAccentWord'

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 4C9 4 5 8 5 13c0 3 1.5 5.5 4 7v3h10v-3c2.5-1.5 4-4 4-7 0-5-4-9-9-9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 24h8M14 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 13l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    headline: 'Works without internet.',
    body: 'All core functionality works fully offline. Data syncs when connection is restored. A power cut or router outage is a minor inconvenience, not a business crisis. We designed for the grid, not against it.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    headline: 'Your data stays yours.',
    body: 'Your business data is stored on your device, not sold to advertisers and not mined by us. We have no access to your records. You own your data completely &mdash; and that will never change.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 4c0 0-5 4-5 10s5 10 5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 4c0 0 5 4 5 10s-5 10-5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    headline: 'Made for this market.',
    body: 'LKR pricing, local tax structures, Sinhala and Tamil support, and a support team that answers in your timezone. We\'re not a global product with Sri Lanka as an afterthought &mdash; this is home.',
  },
]

export default function ValuesSection() {
  return (
    <section
      aria-labelledby="values-heading"
      style={{ padding: '96px 0' }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginBottom: 64, textAlign: 'center' }}
        >
          <SectionLabel>How we&rsquo;re different</SectionLabel>
          <h2
            id="values-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Built for how you actually <SeasonAccentWord>work.</SeasonAccentWord>
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 48,
          }}
          className="grid-3"
        >
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--season-glow-soft)',
                  border: '1px solid var(--season-card-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  color: 'var(--season-accent)',
                }}
              >
                {v.icon}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                }}
              >
                {v.headline}
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                }}
              >
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
