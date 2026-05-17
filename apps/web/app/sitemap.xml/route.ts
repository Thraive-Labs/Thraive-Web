const PRODUCT_SLUGS = ['wildcafe', 'smartpos', 'pharmacy', 'routeflow', 'autoserv', 'sonara']

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thraive.com'
  const now = new Date().toISOString().split('T')[0]

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/products', priority: '0.9', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/blog', priority: '0.6', changefreq: 'weekly' },
    { path: '/legal/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/legal/terms', priority: '0.3', changefreq: 'yearly' },
  ]

  const productRoutes = PRODUCT_SLUGS.map((slug) => ({
    path: `/products/${slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }))

  const allRoutes = [...staticRoutes, ...productRoutes]

  const urls = allRoutes
    .map(
      ({ path, priority, changefreq }) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
