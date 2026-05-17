'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

const STEPS = [
  {
    num: '1',
    title: 'Choose a product',
    body: 'Browse our six products, read what fits your business type, and select the plan that works for your scale.',
  },
  {
    num: '2',
    title: 'Pay and receive your key',
    body: 'Checkout through our secure payment portal. Your license key arrives by email within seconds.',
  },
  {
    num: '3',
    title: 'Download and activate',
    body: 'Download the installer for your platform, enter your key, and your software is ready. No setup call required.',
  },
]

export default function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-heading"
      style={{
        padding: '96px 0',
        background: 'color-mix(in srgb, var(--bg-subtle) 100%, var(--season-bg-tint))',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <SectionLabel>Getting started</SectionLabel>
          <h2
            id="how-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            From purchase to running &mdash; in minutes.
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            position: 'relative',
          }}
          className="grid-3-no-gap"
        >
          {STEPS.map((step, i) => (
            <div key={i} style={{ position: 'relative', padding: '0 24px', textAlign: 'center' }}>
              {/* Connector line between steps */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 28,
                    right: 0,
                    width: '50%',
                    height: 1,
                    background: 'var(--season-ambient)',
                    opacity: 0.35,
                    zIndex: 0,
                  }}
                />
              )}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 28,
                    left: 0,
                    width: '50%',
                    height: 1,
                    background: 'var(--season-ambient)',
                    opacity: 0.35,
                    zIndex: 0,
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                {/* Step circle */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--season-btn-bg)',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 0 0 8px var(--season-glow-soft)',
                  }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>

                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {step.body}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
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
              transition: 'background 150ms, transform 150ms',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--season-btn-hover)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--season-btn-bg)'
              el.style.transform = ''
            }}
          >
            Get started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
