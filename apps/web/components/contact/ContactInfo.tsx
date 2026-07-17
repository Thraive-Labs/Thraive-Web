'use client'

import { motion } from 'framer-motion'

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          color: 'var(--text-primary)',
          marginBottom: 16,
        }}
      >
        Let&rsquo;s talk.
      </h2>
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.75,
          color: 'var(--text-secondary)',
          marginBottom: 40,
          maxWidth: 360,
        }}
      >
        Whether you&rsquo;re evaluating a product, need support, or want to partner with us —
        we&rsquo;re reachable and we reply fast.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {[
          {
            label: 'Email',
            value: 'hello@thraive.com',
            href: 'mailto:hello@thraive.com',
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M2 6l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            label: 'Location',
            value: 'Colombo, Sri Lanka',
            href: null,
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            ),
          },
          {
            label: 'Response time',
            value: 'Within one business day',
            href: null,
            icon: (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9 5v4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ),
          },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {item.icon}
            </div>
            <div>
              <p
                style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3, letterSpacing: '0.04em', textTransform: 'uppercase' }}
              >
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  style={{
                    fontSize: 15,
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <p style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 500 }}>
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
