'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

export default function AboutMission() {
  return (
    <section
      aria-labelledby="mission-heading"
      style={{
        padding: '80px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>Our mission</SectionLabel>
            <h2
              id="mission-heading"
              style={{
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
                marginBottom: 20,
              }}
            >
              Software that respects where you are, not just where Silicon Valley is.
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                marginBottom: 16,
              }}
            >
              Most business software is designed for high-bandwidth, always-connected environments
              with large teams and enterprise budgets. Sri Lankan businesses operate in a different
              reality: patchy internet, power outages, lean margins, and local payment systems that
              global software ignores.
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
              }}
            >
              We started Thraive Labs to change that. Every product we build ships with offline
              support as a first-class feature, pricing that matches local market realities, and
              support from a team in the same timezone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              {[
                {
                  num: '01',
                  heading: 'Offline first',
                  body: 'Every product works without internet. Data syncs the moment connectivity is restored.',
                },
                {
                  num: '02',
                  heading: 'Affordable pricing',
                  body: 'Priced in LKR. No surprise currency conversions. Plans designed for local business budgets.',
                },
                {
                  num: '03',
                  heading: 'Local language',
                  body: 'Sinhala and Tamil language support across the product suite. Software that speaks to your staff.',
                },
                {
                  num: '04',
                  heading: 'Sri Lanka support',
                  body: 'Our support team is here. Same timezone, direct phone, same-day response.',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-brand)',
                      opacity: 0.6,
                      minWidth: 24,
                      paddingTop: 2,
                    }}
                    aria-hidden="true"
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: 6,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item.heading}
                    </h3>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
