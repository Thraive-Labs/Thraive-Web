'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

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

          {/* Right: one honest photo — no card, no overlay tricks */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <EditorialImage
              src={EDITORIAL_IMAGES.homeProblem.src}
              alt={EDITORIAL_IMAGES.homeProblem.alt}
              aspectRatio="4 / 5"
              sizes="(max-width: 900px) 90vw, 540px"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
