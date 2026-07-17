'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import ProductCard from '@/components/ui/ProductCard'
import type { ProductDetail } from '@/lib/product-details'

export default function ProductsClient({ products }: { products: ProductDetail[] }) {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          padding: '80px 0 64px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-labelledby="products-heading"
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
              textAlign: 'center',
              maxWidth: 640,
              margin: '0 auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <SectionLabel>Our Products</SectionLabel>
            <h1
              id="products-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 6vw, 68px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.08,
                color: 'var(--text-primary)',
                marginBottom: 20,
              }}
            >
              Built for how Sri Lanka does business.
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              Six focused products. One company. No bloat, no subscriptions you&rsquo;ll never use.
              Every product ships with offline support, local payment integrations, and Sinhala/Tamil
              language support.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Products grid */}
      <section aria-labelledby="products-grid-label" style={{ padding: '0 0 96px' }}>
        <Container>
          <h2 id="products-grid-label" className="sr-only">
            All products
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="grid-3"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Bottom trust */}
      <section
        style={{
          padding: '64px 0',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-subtle)',
        }}
        aria-label="Product commitments"
      >
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 40,
              textAlign: 'center',
            }}
            className="grid-3"
          >
            {[
              {
                heading: 'Offline-first',
                body: 'Every product works without internet. Data syncs when you reconnect.',
              },
              {
                heading: '14-day free trial',
                body: 'No credit card required. Get your whole team onboarded before you pay.',
              },
              {
                heading: 'Local support',
                body: 'Sri Lanka-based team. Same timezone, same language, same day response.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 10,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.heading}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
