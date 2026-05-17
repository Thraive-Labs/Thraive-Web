import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '../styles/globals.css'
import { getSeasonState } from '@/lib/seasonal'
import { getInterpolatedColorVars } from '@/lib/seasonColors'
import { LoadingProvider } from '@/contexts/loading-context'
import { ThemeProvider } from '@/contexts/theme-context'
import SeasonalEngine from '@/components/seasonal/SeasonalEngine'
import SeasonDevPanel from '@/components/dev/SeasonDevPanel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thraive.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Thraive Labs — Business Software Built for Sri Lanka',
    template: '%s — Thraive Labs',
  },
  description:
    'Thraive Labs builds offline-first, privacy-first software for restaurants, pharmacies, retailers, and more. Made in Sri Lanka.',
  openGraph: {
    siteName: 'Thraive Labs',
    type: 'website',
    locale: 'en_LK',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thraive',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const THEME_SCRIPT = `try{var s=localStorage.getItem('theme');var m=s==='dark'||s==='light'?s:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-mode',m);}catch(e){document.documentElement.setAttribute('data-mode','light');}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const now = new Date()
  const state = getSeasonState(now, true)
  const colorVars = getInterpolatedColorVars(state.primary, state.secondary, state.colorBlend, state.darkMode)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-season={state.primary}
      data-secondary-season={state.secondary ?? ''}
      data-season-blend={state.blend.toFixed(3)}
      data-time={state.timeOfDay}
      data-mode="light"
      style={colorVars as React.CSSProperties}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LoadingProvider>
            <SeasonalEngine seasonState={state} />
            {children}
            <SeasonDevPanel />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
