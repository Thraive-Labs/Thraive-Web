'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'
import type { ProductDetail } from '@/lib/product-details'

interface ProductHeroProps {
  product: ProductDetail
}

function MockUI({ accent }: { accent: string }) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)',
        border: `1px solid ${accent}30`,
        boxShadow: `0 24px 64px rgba(0,0,0,0.2), 0 0 0 1px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.06)`,
        overflow: 'hidden',
        aspectRatio: '4/3',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: 40,
          background: 'var(--bg-subtle)',
          borderBottom: `1px solid ${accent}20`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 6,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: i === 1 ? 'var(--color-error)' : i === 2 ? 'var(--signature-gold)' : 'var(--color-success)',
              opacity: 0.6,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 12,
            height: 20,
            flex: 1,
            maxWidth: 200,
            borderRadius: 4,
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            height: 20,
            padding: '0 8px',
            borderRadius: 4,
            background: `${accent}12`,
            border: `1px solid ${accent}30`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'var(--color-success)',
              animation: 'soft-pulse 1.8s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: 9, fontWeight: 600, color: accent, letterSpacing: '0.02em' }}>
            Synced
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '180px 1fr', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            borderRight: `1px solid ${accent}15`,
            background: 'var(--bg-subtle)',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[0.9, 0.5, 0.6, 0.4, 0.7].map((op, i) => (
            <div
              key={i}
              style={{
                height: 28,
                borderRadius: 6,
                background: i === 0 ? accent : 'var(--bg)',
                opacity: i === 0 ? 0.9 : op,
                border: i === 0 ? 'none' : '1px solid var(--border)',
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Stat row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {['32', '94%', '128'].map((val, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 8,
                  border: `1px solid ${accent}20`,
                  background: `${accent}08`,
                  padding: '8px 10px',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: accent, fontFamily: 'var(--font-mono)' }}>{val}</div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--border)',
                    marginTop: 4,
                    width: '70%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Table rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                height: 28,
                borderRadius: 6,
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: accent,
                  opacity: 0.7,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: 'var(--border)',
                  width: `${40 + i * 8}%`,
                }}
              />
              <div
                style={{
                  marginLeft: 'auto',
                  height: 8,
                  width: 40,
                  borderRadius: 4,
                  background: i % 2 === 0 ? `${accent}40` : 'var(--border)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section
      style={{
        padding: '80px 0 64px',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="product-hero-heading"
    >
      {/* Accent glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${product.accent}18, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Category badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: `${product.accent}15`,
                border: `1px solid ${product.accent}30`,
                marginBottom: 24,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 600, color: product.accent, letterSpacing: '0.04em', textTransform: 'uppercase' }}
              >
                {product.category}
              </span>
            </div>

            <h1
              id="product-hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 6vw, 68px)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.08,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: product.accent,
                marginBottom: 20,
                lineHeight: 1.4,
              }}
            >
              {product.tagline}
            </p>

            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: 36,
                maxWidth: 440,
              }}
            >
              {product.longDescription}
            </p>

            {/* Platforms */}
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                fontWeight: 500,
                marginBottom: 28,
              }}
            >
              Available on {product.platforms.join(', ')}
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#pricing"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 48,
                  padding: '0 24px',
                  borderRadius: 'var(--radius-md)',
                  background: product.accent,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 150ms, transform 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.opacity = '0.88'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.opacity = '1'
                  el.style.transform = ''
                }}
              >
                Start free trial
              </a>
              <a
                href="#features"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 48,
                  padding: '0 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'border-color 150ms, color 150ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = product.accent
                  el.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--border)'
                  el.style.color = 'var(--text-secondary)'
                }}
              >
                See features
              </a>
            </div>
          </motion.div>

          {/* Right: mock UI over a photo backdrop */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', padding: '10% 6% 6% 10%' }}
          >
            <div style={{ position: 'absolute', inset: '10% 0 0 10%', zIndex: 0 }}>
              <EditorialImage
                src={EDITORIAL_IMAGES.productHeroBackdrop.src}
                alt={EDITORIAL_IMAGES.productHeroBackdrop.alt}
                aspectRatio="4 / 3"
                sizes="(max-width: 900px) 90vw, 480px"
                radius="var(--radius-xl)"
              />
            </div>
            <div style={{ position: 'relative', zIndex: 1, transform: 'translate(-4%, 4%)' }}>
              <MockUI accent={product.accent} />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
