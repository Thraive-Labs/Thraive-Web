'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ProductDetail } from '@/lib/product-details'

export default function ProductHowItWorks({ product }: { product: ProductDetail }) {
  return (
    <section
      aria-labelledby="hiw-heading"
      style={{
        padding: '96px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <SectionLabel>Getting started</SectionLabel>
          <h2
            id="hiw-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Up and running in minutes.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${product.steps.length}, 1fr)`,
            gap: 0,
            position: 'relative',
          }}
          className="grid-steps"
        >
          {product.steps.map((step, i) => (
            <div
              key={i}
              style={{ position: 'relative', padding: '0 20px', textAlign: 'center' }}
            >
              {i < product.steps.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 27,
                    right: 0,
                    width: '50%',
                    height: 1,
                    background: product.accent,
                    opacity: 0.3,
                  }}
                />
              )}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 27,
                    left: 0,
                    width: '50%',
                    height: 1,
                    background: product.accent,
                    opacity: 0.3,
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: product.accent,
                    color: 'white',
                    fontSize: 17,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: `0 0 0 8px ${product.accent}18`,
                  }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
