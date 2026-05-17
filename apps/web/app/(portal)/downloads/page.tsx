import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DownloadsClient, { type VersionEntry } from './DownloadsClient'

const PRODUCT_NAMES: Record<string, string> = {
  wildcafe: 'WildCafe POS',
  smartpos: 'SmartPOS',
  pharmacy: 'Pharmacy POS',
  routeflow: 'RouteFlow',
  autoserv: 'AutoServ',
  sonara: 'Sonara',
}

const PRODUCT_ACCENTS: Record<string, string> = {
  wildcafe: '#F97316',
  smartpos: '#10B981',
  pharmacy: '#06B6D4',
  routeflow: '#3B82F6',
  autoserv: '#8B5CF6',
  sonara: '#7C3AED',
}

export default async function DownloadsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: licenses } = await supabase
    .from('licenses')
    .select('product')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  let entries: VersionEntry[] = []

  if (licenses && licenses.length > 0) {
    const products = [...new Set(licenses.map((l) => l.product as string))]

    const { data: versions } = await supabase
      .from('app_versions')
      .select('product, platform, version, released_at, download_url, file_size, checksum')
      .in('product', products)
      .eq('is_current', true)

    entries = products.map((product) => {
      const win = versions?.find((v) => v.product === product && v.platform === 'windows') ?? null
      const apk = versions?.find((v) => v.product === product && v.platform === 'android') ?? null

      const fmt = (d: string) =>
        new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

      return {
        product,
        name: PRODUCT_NAMES[product] ?? product,
        accent: PRODUCT_ACCENTS[product] ?? 'var(--season-accent)',
        windows: win
          ? { version: win.version, released: fmt(win.released_at as string), download_url: win.download_url, file_size: win.file_size, checksum: win.checksum }
          : null,
        android: apk
          ? { version: apk.version, released: fmt(apk.released_at as string), download_url: apk.download_url, file_size: apk.file_size, checksum: apk.checksum }
          : null,
      }
    })
  }

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          padding: '0 32px',
          height: 56,
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Downloads</h1>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dateStr}</span>
      </div>

      <DownloadsClient entries={entries} />
    </>
  )
}
