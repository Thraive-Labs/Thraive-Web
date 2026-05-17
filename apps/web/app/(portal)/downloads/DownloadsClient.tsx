'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'

export interface VersionEntry {
  product: string
  name: string
  accent: string
  windows: { version: string; released: string; download_url: string; file_size: string | null; checksum: string | null } | null
  android: { version: string; released: string; download_url: string; file_size: string | null; checksum: string | null } | null
}

const ACCORDION_ITEMS = [
  {
    question: 'How to install on Windows',
    answer:
      'Download the .exe installer and run it. You may see a Windows SmartScreen warning — click "More info" then "Run anyway". Follow the setup wizard to complete installation. The application will appear in your Start menu.',
  },
  {
    question: 'How to install on Android',
    answer:
      'Download the .apk file to your Android device. Go to Settings > Security and enable "Install from unknown sources" (or "Allow from this source" on Android 8+). Open the downloaded APK file and follow the installation prompts.',
  },
  {
    question: 'How to activate with your license key',
    answer:
      'On first launch, the application will prompt you for your license key. Copy your key from the Dashboard and paste it in. An internet connection is required for initial activation only. After activation, the software runs fully offline.',
  },
  {
    question: 'Troubleshooting',
    answer:
      'If the software fails to launch, try running it as Administrator (Windows). If your license key is not accepted, ensure you are entering the key for the correct product. For further help, contact support@thraive.com with your order details.',
  },
]

function PlatformRow({
  label,
  ext,
  url,
  size,
}: {
  label: string
  ext: string
  url: string
  size: string | null
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <div>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
        {size && (
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>{size}</span>
        )}
      </div>
      <a
        href={url}
        download
        style={{
          background: 'var(--season-btn-bg)',
          color: 'white',
          padding: '6px 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: 13,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'background 150ms',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-hover)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--season-btn-bg)'
        }}
      >
        Download {ext}
      </a>
    </div>
  )
}

function DownloadCard({ entry }: { entry: VersionEntry }) {
  const [checksumExpanded, setChecksumExpanded] = useState(false)

  const latestVersion = entry.windows?.version ?? entry.android?.version ?? ''
  const latestReleased = entry.windows?.released ?? entry.android?.released ?? ''
  const anyChecksum = entry.windows?.checksum ?? entry.android?.checksum

  return (
    <GlassCard style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: entry.accent }} />

      <div style={{ padding: '24px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: 4 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${entry.accent}20`,
              color: entry.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              {entry.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              v{latestVersion} &mdash; Released {latestReleased}
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          {entry.windows && (
            <PlatformRow
              label="Windows installer"
              ext=".exe"
              url={entry.windows.download_url}
              size={entry.windows.file_size}
            />
          )}
          {entry.android && (
            <PlatformRow
              label="Android APK"
              ext=".apk"
              url={entry.android.download_url}
              size={entry.android.file_size}
            />
          )}

          {anyChecksum && (
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setChecksumExpanded((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  padding: 0,
                  marginBottom: checksumExpanded ? 8 : 0,
                }}
              >
                SHA256 checksum
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  style={{ transition: 'transform 150ms', transform: checksumExpanded ? 'rotate(180deg)' : 'none' }}
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {checksumExpanded && (
                <code
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    wordBreak: 'break-all',
                    lineHeight: 1.6,
                    padding: '8px 0',
                  }}
                >
                  {anyChecksum}
                </code>
              )}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          borderBottom: '1px dashed var(--border)',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text-primary)',
          gap: 12,
        }}
      >
        {question}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          style={{ transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
        >
          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', padding: '12px 0 4px' }}>
          {answer}
        </p>
      )}
    </div>
  )
}

export default function DownloadsClient({ entries }: { entries: VersionEntry[] }) {
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
        Download the latest versions of your licensed software below. Always use the latest version
        for the most recent bug fixes and improvements.
      </p>

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 16,
        }}
      >
        Your Downloads
      </p>

      {entries.length > 0 ? (
        entries.map((entry) => <DownloadCard key={entry.product} entry={entry} />)
      ) : (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>
          No active licenses found.{' '}
          <Link href="/products" style={{ color: 'var(--season-accent)', textDecoration: 'none' }}>
            Browse products
          </Link>
        </p>
      )}

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: 16,
          marginTop: 48,
        }}
      >
        Installation Help
      </p>

      <GlassCard style={{ padding: '0 24px' }}>
        {ACCORDION_ITEMS.map((item) => (
          <AccordionItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </GlassCard>
    </div>
  )
}
