'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import EditorialImage from '@/components/ui/EditorialImage'
import { EDITORIAL_IMAGES } from '@/lib/editorialImages'

// Role-based placeholders, not fabricated personal identities — swap the
// photo, role, and note for real team members and bios when available.
const TEAM = [
  { role: 'Founder & Engineering', note: 'Writes the code and talks to customers.', photo: EDITORIAL_IMAGES.team[0] },
  { role: 'Product & Design', note: 'Shapes what ships and how it feels.', photo: EDITORIAL_IMAGES.team[1] },
  { role: 'Support & Operations', note: 'Keeps every business running smoothly.', photo: EDITORIAL_IMAGES.team[2] },
]

export default function AboutTeam() {
  return (
    <section
      aria-labelledby="team-heading"
      style={{
        padding: '80px 0',
        background: 'var(--bg-subtle)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>The team</SectionLabel>
          <h2
            id="team-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--text-primary)',
              marginBottom: 20,
              maxWidth: 640,
            }}
          >
            Small team. Big impact.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: 16,
              maxWidth: 640,
            }}
          >
            Thraive Labs is a small, focused team based in Sri Lanka. We believe in staying lean —
            fewer people means faster decisions, tighter product thinking, and every person having a
            genuine impact on what ships.
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: 40,
              maxWidth: 640,
            }}
          >
            We&rsquo;re a technical team first. The people who talk to customers are the same people
            who write the code. There&rsquo;s no wall between product, engineering, and support.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
              maxWidth: 780,
              marginBottom: 40,
            }}
            className="grid-3"
          >
            {TEAM.map((member, i) => (
              <motion.div
                key={member.role}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <EditorialImage
                  src={member.photo.src}
                  alt={member.photo.alt}
                  aspectRatio="1 / 1"
                  sizes="(max-width: 768px) 90vw, 240px"
                  radius="var(--radius-lg)"
                  style={{ marginBottom: 14 }}
                />
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {member.role}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  {member.note}
                </p>
              </motion.div>
            ))}
          </div>

          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color 150ms, color 150ms',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--color-brand)'
              el.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'var(--border)'
              el.style.color = 'var(--text-secondary)'
            }}
          >
            Get in touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </Container>
    </section>
  )
}
