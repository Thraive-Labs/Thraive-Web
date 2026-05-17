import type { Product } from '@/lib/products'
import {
  WildCafeIcon,
  PharmacyIcon,
  SmartPOSIcon,
  RouteFlowIcon,
  AutoServIcon,
  SonaraIcon,
} from './ProductIcons'

interface ProductCardProps {
  product: Product
}

function ProductIcon({ slug, accent }: { slug: string; accent: string }) {
  const props = { size: 24, color: accent }
  switch (slug) {
    case 'wildcafe':  return <WildCafeIcon  {...props} />
    case 'pharmacy':  return <PharmacyIcon  {...props} />
    case 'smartpos':  return <SmartPOSIcon  {...props} />
    case 'routeflow': return <RouteFlowIcon {...props} />
    case 'autoserv':  return <AutoServIcon  {...props} />
    case 'sonara':    return <SonaraIcon    {...props} />
    default:          return null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { slug, name, tagline, description, accent, platforms, category } = product

  return (
    <a
      href={`/products/${slug}`}
      style={{
        display: 'block',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'transform 200ms, box-shadow 200ms, border-color 200ms',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)'
        el.style.borderColor = `${accent}50`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = ''
        el.style.borderColor = 'var(--border)'
      }}
    >
      {/* Header band */}
      <div
        style={{
          height: 72,
          background: `${accent}0C`,
          borderBottom: `1px solid ${accent}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: `${accent}18`,
            border: `1px solid ${accent}28`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ProductIcon slug={slug} accent={accent} />
        </div>

        {/* Category badge */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.03em',
            color: accent,
            background: `${accent}12`,
            border: `1px solid ${accent}22`,
            borderRadius: 'var(--radius-full)',
            padding: '3px 10px',
          }}
        >
          {category}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '22px 24px 24px' }}>
        {/* Name */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: 5,
            lineHeight: 1.25,
          }}
        >
          {name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: accent,
            marginBottom: 14,
            lineHeight: 1.4,
          }}
        >
          {tagline}
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: 18,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {platforms.join(' · ')}
          </p>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: accent,
            }}
          >
            Learn more
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </a>
  )
}
