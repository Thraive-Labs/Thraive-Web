const PRODUCT_PREFIXES: Record<string, string> = {
  wildcafe:  'WLDC',
  smartpos:  'SMPS',
  pharmacy:  'PHRM',
  routeflow: 'RTFL',
  autoserv:  'ASVR',
  sonara:    'SNRA',
}

// Unambiguous charset — no 0/O, 1/I/L
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomSegment(): string {
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  }
  return result
}

export function generateLicenseKey(product: string): string {
  const prefix = PRODUCT_PREFIXES[product] ?? 'THRV'
  return `${prefix}-${randomSegment()}-${randomSegment()}-${randomSegment()}`
}
