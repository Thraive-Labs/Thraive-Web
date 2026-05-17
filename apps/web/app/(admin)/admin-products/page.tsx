import { createClient } from '@/lib/supabase/server'

const PRODUCT_ACCENTS: Record<string, string> = {
  wildcafe: '#F97316',
  smartpos: '#10B981',
  pharmacy: '#06B6D4',
  routeflow: '#3B82F6',
  autoserv: '#8B5CF6',
  sonara: '#7C3AED',
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, tagline, status')
    .order('name')

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <>
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB' }}>Products</h1>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{dateStr}</span>
      </div>

      <div style={{ padding: 32 }}>
        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
          Manage the product catalog. Changes are reflected on the marketing site immediately.
        </p>

        {products && products.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map((product) => {
              const accent = PRODUCT_ACCENTS[product.slug as string] ?? '#6366F1'
              const isActive = product.status === 'active'
              return (
                <div
                  key={product.id as string}
                  style={{
                    background: '#111113',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }}
                  />
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${accent}20`,
                      border: `1px solid ${accent}40`,
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#E5E7EB' }}>{product.name as string}</p>
                    <p style={{ fontSize: 12, color: '#4B5563' }}>{product.tagline as string}</p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? '#10B981' : '#6B7280',
                      background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                      padding: '3px 10px',
                      borderRadius: 20,
                    }}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#4B5563' }}>
            No products in database. Seed the products table to manage content here.
          </p>
        )}
      </div>
    </>
  )
}
