export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thraive.com'
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Block customer portal and admin — not for indexing',
    'Disallow: /dashboard',
    'Disallow: /downloads',
    'Disallow: /billing',
    'Disallow: /settings',
    'Disallow: /admin-login',
    'Disallow: /admin-dashboard',
    'Disallow: /customers',
    'Disallow: /licenses',
    'Disallow: /payments',
    'Disallow: /subscriptions',
    'Disallow: /staff',
    'Disallow: /audit-log',
    'Disallow: /app-versions',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /verify-email',
    'Disallow: /update-password',
    'Disallow: /forgot-password',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
