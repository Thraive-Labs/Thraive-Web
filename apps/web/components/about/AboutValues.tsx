'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const VALUES = [
  {
    heading: 'Usefulness over features',
    body: "We ship what you actually need. Every feature starts with a real customer problem, not a product roadmap checkbox. If it doesn't make your day faster, we don't build it.",
  },
  {
    heading: 'Reliability over novelty',
    body: "Your business can't afford downtime. We obsess over uptime, offline resilience, and data integrity. Boring and reliable beats flashy and fragile.",
  },
  {
    heading: 'Transparency',
    body: "Pricing you can predict. No dark patterns. No feature-locked paywalls designed to extract more money. You always know what you're paying for and why.",
  },
  {
    heading: 'Local roots',
    body: "We're Sri Lankan, and that shapes everything. We understand local business culture, local regulations, and the real constraints local businesses operate under.",
  },
  {
    heading: 'Long-term thinking',
    body: 'We build for the decade, not the demo. Our customers depend on us to still be here in five years. We take that responsibility seriously.',
  },
  {
    heading: 'Continuous improvement',
    body: 'Every release makes the product better. We ship updates based on real feedback, and we treat every bug report as a gift.',
  },
]

export default function AboutValues() {
  return (
    <section aria-labelledby="values-heading" style={{ padding: '96px 0' }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <SectionLabel>What we believe</SectionLabel>
          <h2
            id="values-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Values that shape every decision.
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
          {VALUES.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 32,
                  height: 3,
                  borderRadius: 2,
                  background: 'var(--color-brand)',
                  opacity: 0.5,
                  marginBottom: 18,
                }}
              />
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                }}
              >
                {value.heading}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                {value.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
