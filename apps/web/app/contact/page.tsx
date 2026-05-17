import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Container from '@/components/ui/Container'
import SectionLabel from '@/components/ui/SectionLabel'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export const metadata: Metadata = {
  title: 'Contact — Thraive Labs',
  description:
    'Get in touch with Thraive Labs. Sales enquiries, support, partnerships — we respond within one business day.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
      <section
        aria-labelledby="contact-heading"
        style={{
          padding: '80px 0 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
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
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 56 }}>
              <SectionLabel>Contact</SectionLabel>
              <h1
                id="contact-heading"
                style={{
                  fontSize: 'clamp(32px, 4.5vw, 52px)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: 'var(--text-primary)',
                }}
              >
                Get in touch.
              </h1>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr',
                gap: 80,
                alignItems: 'flex-start',
              }}
              className="grid-cols-1 lg:grid-cols-2"
            >
              <ContactInfo />
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </main>
      <Footer />
    </>
  )
}
