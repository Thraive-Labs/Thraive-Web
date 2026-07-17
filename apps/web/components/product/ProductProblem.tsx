'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ProductDetail } from '@/lib/product-details'

export default function ProductProblem({ product }: { product: ProductDetail }) {
  return (
    <section
      aria-labelledby="product-problem-heading"
      style={{
        padding: '80px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <SectionLabel>Why it exists</SectionLabel>
            <h2
              id="product-problem-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(26px, 4vw, 42px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
                marginBottom: 24,
              }}
            >
              {product.problem.heading}
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}
            >
              {product.problem.body}
            </p>

            {/* Accent line */}
            <div
              aria-hidden="true"
              style={{
                marginTop: 36,
                height: 3,
                width: 48,
                borderRadius: 2,
                background: product.accent,
              }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
