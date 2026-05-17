'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Container from '@/components/ui/Container'

interface Stat {
  value: number | null
  label: string
  suffix?: string
  isText?: string
}

const STATS: Stat[] = [
  { value: 6,    label: 'Products' },
  { value: 4,    label: 'Platforms' },
  { value: 1,    label: 'Company' },
  { value: null, label: 'First',    isText: 'Offline' },
]

function CountUp({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(target * ease))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, target, duration])

  return <span ref={ref}>{count}</span>
}

export default function StatsSection() {
  return (
    <section
      aria-label="Company statistics"
      style={{
        background: 'linear-gradient(135deg, var(--season-btn-bg) 0%, var(--season-btn-hover) 100%)',
        padding: '64px 0',
      }}
    >
      <Container>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 32,
            textAlign: 'center',
          }}
          className="grid-4"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'white',
                  marginBottom: 8,
                  letterSpacing: '-0.02em',
                }}
              >
                {stat.isText ? (
                  stat.isText
                ) : stat.value !== null ? (
                  <CountUp target={stat.value} />
                ) : null}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.75)',
                  letterSpacing: '0.01em',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
