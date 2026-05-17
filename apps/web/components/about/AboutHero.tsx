'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'

export default function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      style={{
        padding: '80px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, var(--season-glow-soft), transparent 70%)',
          zIndex: 0,
        }}
      />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            maxWidth: 680,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <SectionLabel>About Thraive Labs</SectionLabel>
          <h1
            id="about-hero-heading"
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: 'var(--text-primary)',
              marginBottom: 20,
            }}
          >
            We build software for the businesses that keep Sri Lanka running.
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: 560,
            }}
          >
            Thraive Labs is a software company based in Sri Lanka. We make practical, affordable
            business software for restaurants, pharmacies, retailers, delivery companies, garages,
            and fitness centers — the kinds of businesses that form the backbone of our economy.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
