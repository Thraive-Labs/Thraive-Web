'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import type { ProductDetail } from '@/lib/product-details'

type BillingCycle = 'monthly' | 'annual' | 'one_time'

function CheckoutButton({
  label,
  highlighted,
  accent,
  product,
  plan,
  billingType,
  isCustom,
}: {
  label: string
  highlighted: boolean
  accent: string
  product: string
  plan: string
  billingType: BillingCycle
  isCustom: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isCustom) {
    return (
      <a
        href="/contact"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
          borderRadius: 'var(--radius-md)',
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
          transition: 'opacity 150ms',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      >
        {label}
      </a>
    )
  }

  async function handleClick() {
    setLoading(true)
    setError(null)

    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('supabase.auth.token') : null
    const isLoggedIn = !!stored

    if (!isLoggedIn) {
      // Store intended purchase for post-login resume
      sessionStorage.setItem('pending_checkout', JSON.stringify({ product, plan, billingType }))
      router.push('/register?redirect=checkout')
      return
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, plan, billingType }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 44,
          borderRadius: 'var(--radius-md)',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'opacity 150ms, transform 150ms',
          opacity: loading ? 0.7 : 1,
          ...(highlighted
            ? { background: accent, color: 'white' }
            : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' }),
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            const el = e.currentTarget as HTMLElement
            el.style.opacity = '0.85'
            el.style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.opacity = loading ? '0.7' : '1'
          el.style.transform = ''
        }}
      >
        {loading ? 'Redirecting...' : label}
      </button>
      {error && (
        <p style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 6, textAlign: 'center' }}>{error}</p>
      )}
    </div>
  )
}

export default function ProductPricing({ product }: { product: ProductDetail }) {
  const hasPeriods = product.pricing.some((p) => p.period === 'month')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly')

  // Derive plan slug from plan name (e.g. "Starter" → "starter")
  function planSlug(name: string) {
    return name.toLowerCase().replace(/\s+/g, '_')
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
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
          <SectionLabel>Pricing</SectionLabel>
          <h2
            id="pricing-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Simple, transparent pricing.
          </h2>
          <p
            style={{
              marginTop: 16,
              fontSize: 17,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            All plans include a 14-day free trial. No credit card required.
          </p>

          {/* Billing cycle toggle */}
          {hasPeriods && (
            <div
              role="group"
              aria-label="Billing cycle"
              style={{
                display: 'inline-flex',
                marginTop: 24,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                padding: 4,
                gap: 2,
              }}
            >
              {(['monthly', 'annual', 'one_time'] as BillingCycle[]).map((cycle) => {
                const label = cycle === 'monthly' ? 'Monthly' : cycle === 'annual' ? 'Annual (save 20%)' : 'Lifetime'
                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    aria-pressed={billingCycle === cycle}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: billingCycle === cycle ? product.accent : 'transparent',
                      color: billingCycle === cycle ? 'white' : 'var(--text-muted)',
                      transition: 'background 150ms, color 150ms',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            alignItems: 'stretch',
          }}
          className="grid-3"
        >
          {product.pricing.map((plan, i) => {
            const isCustom = plan.price === 'Custom'
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  border: plan.highlighted
                    ? `2px solid ${product.accent}`
                    : '1px solid var(--border)',
                  background: plan.highlighted ? `${product.accent}08` : 'var(--bg-card)',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: plan.highlighted
                    ? `0 0 0 1px ${product.accent}20, 0 16px 48px ${product.accent}12`
                    : 'none',
                }}
              >
                {plan.highlighted && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -13,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: product.accent,
                      color: 'white',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-full)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Most popular
                  </div>
                )}

                <div style={{ marginBottom: 28 }}>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {plan.description}
                  </p>
                </div>

                <div style={{ marginBottom: 32 }}>
                  {isCustom ? (
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Custom
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          marginBottom: 2,
                        }}
                      >
                        LKR
                      </span>
                      <span
                        style={{
                          fontSize: 36,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.02em',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {Number(plan.price.replace(/[^0-9]/g, '')).toLocaleString()}
                      </span>
                      {plan.period && (
                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    flex: 1,
                  }}
                >
                  {plan.features.map((feature, fi) => (
                    <li
                      key={fi}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 1 }}
                        aria-hidden="true"
                      >
                        <circle cx="8" cy="8" r="7" fill={`${product.accent}18`} />
                        <path
                          d="M5 8l2 2 4-4"
                          stroke={product.accent}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <CheckoutButton
                  label={plan.cta}
                  highlighted={!!plan.highlighted}
                  accent={product.accent}
                  product={product.slug}
                  plan={planSlug(plan.name)}
                  billingType={isCustom ? 'monthly' : billingCycle}
                  isCustom={isCustom}
                />
              </motion.div>
            )
          })}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 32,
            fontSize: 13,
            color: 'var(--text-muted)',
          }}
        >
          Prices in Sri Lankan Rupees (LKR). Enterprise plans include custom terms and SLAs.
        </p>
      </Container>
    </section>
  )
}
