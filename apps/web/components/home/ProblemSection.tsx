'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

const COMPARISON = [
  { before: 'Power cut wipes sales data', after: 'Keeps running, saves offline' },
  { before: 'Freezes with no internet', after: 'Works with zero connection' },
  { before: "Doesn't understand LKR", after: 'Built for LKR, local banks' },
  { before: 'English-only interface', after: 'Sinhala, Tamil, English' },
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7l3 3 5-5" stroke="var(--color-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4 4l6 6M10 4l-6 6" stroke="var(--color-error)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// Compact paired-row comparison — a glass panel meant to float over the
// bottom portion of a photo, not a standalone stacked block.
function ComparisonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        borderRadius: 'var(--radius-lg)',
        border: 'var(--glass-border)',
        background: 'var(--bg-glass)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: '0 20px 48px -16px rgba(6,9,15,0.4)',
        padding: '16px 18px',
      }}
    >
      {COMPARISON.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.07 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 8,
            padding: '9px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CrossIcon />
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{row.before}</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckIcon />
            <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>{row.after}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-heading"
      style={{
        padding: '96px 0',
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
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SectionLabel>The problem</SectionLabel>
            <h2
              id="problem-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              Business software wasn&rsquo;t built for where you are.
            </h2>

            <blockquote
              style={{
                fontSize: 17,
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                color: 'var(--season-accent)',
                borderLeft: '3px solid var(--season-ambient)',
                paddingLeft: 20,
                marginBottom: 28,
                lineHeight: 1.5,
              }}
            >
              &ldquo;The power went out and we lost three hours of sales data.&rdquo;
            </blockquote>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                fontSize: 16,
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}
            >
              <p>
                Businesses in Sri Lanka face challenges that international software simply
                ignores — unreliable electricity, intermittent internet, and markets that
                work in Sinhala, Tamil, and English all at once.
              </p>
              <p>
                Most businesses still run on paper books because the software they tried
                couldn&rsquo;t handle a power cut, didn&rsquo;t understand LKR, or cost
                more than it saved.
              </p>
            </div>
          </motion.div>

          {/* Right: one layered composition — photo backdrop, comparison
              card floats as a glass panel over its lower half. Height-
              matched to the left column instead of two stacked blocks. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              aspectRatio: '4 / 5',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            <EditorialImage
              src={EDITORIAL_IMAGES.homeProblem.src}
              alt={EDITORIAL_IMAGES.homeProblem.alt}
              fill
              sizes="(max-width: 900px) 90vw, 560px"
              radius="0"
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(6,9,15,0.55) 0%, transparent 45%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
              <ComparisonCard />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
