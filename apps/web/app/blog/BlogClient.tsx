'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionLabel from '@/components/ui/SectionLabel'
import GlassCard from '@/components/ui/GlassCard'

export default function BlogClient() {
  const [email, setEmail] = useState('')
  const [inputFocused, setInputFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <>
      <Navbar />
      <section style={{ padding: '120px 0' }}>
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          <SectionLabel>Blog</SectionLabel>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Updates, guides, and stories.
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: 0,
            }}
          >
            We&#39;re just getting started. Product updates, technical guides, and stories
            from building software in Sri Lanka — coming soon.
          </p>

          <GlassCard
            style={{
              padding: 32,
              maxWidth: 440,
              margin: '32px auto 0',
            }}
          >
            {submitted ? (
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--season-accent)',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                You&#39;re on the list. We&#39;ll let you know when we publish our first post.
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  Get notified when we publish our first post.
                </p>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}
                >
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    required
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${inputFocused ? 'var(--season-accent)' : 'var(--border)'}`,
                      background: 'var(--bg)',
                      color: 'var(--text-primary)',
                      padding: '0 14px',
                      fontSize: 14,
                      transition: 'border-color 150ms',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      height: 44,
                      padding: '0 20px',
                      background: 'var(--season-btn-bg)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'background 150ms',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-hover)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-bg)'
                    }}
                  >
                    Notify me
                  </button>
                </form>
              </>
            )}
          </GlassCard>
        </div>
      </section>
      <Footer />
    </>
  )
}
