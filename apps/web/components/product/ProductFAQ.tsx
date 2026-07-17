'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ProductDetail } from '@/lib/product-details'

function FAQItem({
  question,
  answer,
  accent,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  accent: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const btnId = `faq-btn-${index}`
  const panelId = `faq-panel-${index}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        id={btnId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: isOpen ? accent : 'var(--text-primary)',
            lineHeight: 1.4,
            transition: 'color 200ms',
          }}
        >
          {question}
        </span>
        <div
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `1.5px solid ${isOpen ? accent : 'var(--border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 200ms, background 200ms',
            background: isOpen ? `${accent}12` : 'transparent',
          }}
        >
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <path
              d="M2 4l4 4 4-4"
              stroke={isOpen ? accent : 'var(--text-muted)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                paddingBottom: 22,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ProductFAQ({ product }: { product: ProductDetail }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      aria-labelledby="faq-heading"
      style={{ padding: '96px 0' }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2
            id="faq-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Common questions.
          </h2>
        </motion.div>

        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {product.faq.map((item, i) => (
            <FAQItem
              key={i}
              index={i}
              question={item.question}
              answer={item.answer}
              accent={product.accent}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
