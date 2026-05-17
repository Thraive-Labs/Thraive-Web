interface IconProps {
  size?: number
  color?: string
}

export function WildCafeIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2h12l-1 6H7L6 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 8c0 5 1 10 5 12 4-2 5-7 5-12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 6c2 0 4 1 4 3s-2 3-4 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 22h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PharmacyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.5" />
      <path d="M12 7v10M7 12h10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SmartPOSIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 20h8M12 18v2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="6" y="7" width="5" height="4" rx="1" stroke={color} strokeWidth="1.2" />
      <path d="M14 8h4M14 11h4M6 14h12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function RouteFlowIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="6" r="2.5" stroke={color} strokeWidth="1.5" />
      <circle cx="19" cy="18" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M5 8.5C5 12 10 12 12 12s7 0 7 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2" stroke={color} strokeWidth="1.2" />
      <path d="M12 4V2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function AutoServIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 13l2-6h14l2 6"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="2" y="13" width="20" height="6" rx="1.5" stroke={color} strokeWidth="1.5" />
      <circle cx="7" cy="20" r="2" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="20" r="2" stroke={color} strokeWidth="1.5" />
      <path d="M9 10h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SonaraIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18V7l12-3v11"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="18" cy="15" r="3" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}
