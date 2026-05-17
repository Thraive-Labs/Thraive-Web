'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import SeasonAccentWord from '@/components/home/SeasonAccentWord'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/lib/products'

export default function ProductsSection() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      style={{ padding: '96px 0' }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginBottom: 56 }}
        >
          <SectionLabel>What we build</SectionLabel>
          <h2
            id="products-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: 16,
              maxWidth: 560,
            }}
          >
            Software for every corner of your <SeasonAccentWord>business.</SeasonAccentWord>
          </h2>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              maxWidth: 540,
            }}
          >
            Six products built for six industries, all sharing the same commitment:
            offline-first, privacy-first, and designed for the way Sri Lankan businesses actually work.
          </p>
        </motion.div>

        {/* Product grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
          className="grid-products"
        >
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.4,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
