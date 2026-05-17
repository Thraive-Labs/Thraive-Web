'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import GlassCard from '@/components/ui/GlassCard'

const TESTIMONIALS = [
  {
    quote:
      'The system kept running through two power cuts on the same night. Our customers didn\'t even notice. That\'s everything we needed.',
    name: 'Priya Wickramasinghe',
    business: 'Cafe owner',
    location: 'Kandy',
    initials: 'PW',
  },
  {
    quote:
      'We tried three other systems before this. All of them required the internet. RouteFlow works even when our agents are in remote areas with no signal.',
    name: 'Roshan Fernando',
    business: 'Distribution manager',
    location: 'Galle',
    initials: 'RF',
  },
  {
    quote:
      'Finally software that understands how a Sri Lankan pharmacy actually works. The prescription tracking alone saved us hours every week.',
    name: 'Dr. Chamali Perera',
    business: 'Pharmacy',
    location: 'Colombo',
    initials: 'CP',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ padding: '96px 0' }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <SectionLabel>What people say</SectionLabel>
          <h2
            id="testimonials-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Trusted by businesses across Sri Lanka.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="grid-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <GlassCard
                style={{
                  padding: 28,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                {/* Quote mark */}
                <div
                  aria-hidden="true"
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: 'var(--season-accent)',
                    fontFamily: 'Georgia, serif',
                    opacity: 0.6,
                    marginBottom: -12,
                  }}
                >
                  &ldquo;
                </div>

                {/* Quote text */}
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    flex: 1,
                  }}
                >
                  {t.quote}
                </p>

                {/* Attribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--season-glow-soft)',
                      border: '1px solid var(--season-card-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--season-accent)',
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {t.business} &middot; {t.location}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
