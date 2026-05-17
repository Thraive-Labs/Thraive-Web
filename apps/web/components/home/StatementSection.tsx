'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SeasonalDivider from '@/components/ui/SeasonalDivider'
import SeasonAccentWord from '@/components/home/SeasonAccentWord'

export default function StatementSection() {
  return (
    <section
      aria-label="Company statement"
      style={{
        background: 'color-mix(in srgb, var(--bg-subtle) 100%, var(--season-bg-tint))',
        padding: '128px 0',
      }}
    >
      <Container>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            &ldquo;We build software for people
            <br />
            who can&rsquo;t afford for it to stop <SeasonAccentWord>working.</SeasonAccentWord>&rdquo;
          </motion.blockquote>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            style={{ transformOrigin: 'center' }}
          >
            <SeasonalDivider className="mt-12 mb-0" />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
