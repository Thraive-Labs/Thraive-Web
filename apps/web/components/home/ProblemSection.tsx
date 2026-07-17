'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

const BEFORE = [
  'Power cut wipes hours of sales data',
  'Software freezes with no internet',
  'Currency and tax settings don\'t match LKR',
  'English-only — staff can\'t use it',
]

const AFTER = [
  'Keeps running, saves everything offline',
  'Full offline mode — no connection needed',
  'Built for LKR, local taxes, local banks',
  'Sinhala, Tamil, and English support',
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

function ComparisonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: 0.15 }}
      style={{
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        overflow: 'hidden',
      }}
    >
      {/* Before */}
      <div style={{ padding: '20px 24px 4px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--color-error-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CrossIcon />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-error)',
            }}
          >
            Without Thraive
          </span>
        </div>

        {BEFORE.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '11px 0',
              borderTop: i === 0 ? 'none' : '1px dashed var(--border)',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <CrossIcon />
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</p>
          </motion.div>
        ))}

        <div style={{ height: 16 }} />
      </div>

      {/* After */}
      <div
        style={{
          padding: '20px 24px 4px',
          background: 'color-mix(in srgb, var(--color-success) 6%, transparent)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: 'var(--color-success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckIcon />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--color-success)',
            }}
          >
            With Thraive
          </span>
        </div>

        {AFTER.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.07 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '11px 0',
              borderTop: i === 0 ? 'none' : '1px dashed color-mix(in srgb, var(--color-success) 15%, transparent)',
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <CheckIcon />
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>{item}</p>
          </motion.div>
        ))}

        <div style={{ height: 16 }} />
      </div>
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

          {/* Right: photo + comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <EditorialImage
                src={EDITORIAL_IMAGES.homeProblem.src}
                alt={EDITORIAL_IMAGES.homeProblem.alt}
                aspectRatio="16 / 9"
                sizes="(max-width: 900px) 90vw, 560px"
              />
            </motion.div>
            <ComparisonCard />
          </div>
        </div>
      </Container>
    </section>
  )
}
