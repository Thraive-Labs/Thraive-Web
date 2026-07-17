import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '../styles/globals.css'
import { getSeasonState } from '@/lib/seasonal'
import { LoadingProvider } from '@/contexts/loading-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { SeasonalFxProvider } from '@/contexts/seasonal-fx-context'
import SeasonalEngine from '@/components/seasonal/SeasonalEngine'
import SeasonDevPanel from '@/components/dev/SeasonDevPanel'
import GrainOverlay from '@/components/ui/GrainOverlay'

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

// Light is the default regardless of OS preference — only an explicit stored
// choice (from the Navbar/Footer toggle) should ever produce dark mode.
const THEME_SCRIPT = `try{var s=localStorage.getItem('theme');var m=s==='dark'||s==='light'?s:'light';document.documentElement.setAttribute('data-mode',m);}catch(e){document.documentElement.setAttribute('data-mode','light');}`

// Seasonal FX defaults to OFF (Editorial Warmth luxury palette) while the redesign
// is being evaluated in demo mode. Strips the server-rendered season attributes
// before first paint when the user hasn't explicitly turned FX on, so the
// zero-specificity luxury fallback in globals.css applies with no flash.
const SEASONAL_FX_SCRIPT = `try{var f=localStorage.getItem('seasonal-fx');var on=f==='on';document.documentElement.setAttribute('data-seasonal-fx',on?'on':'off');if(!on){document.documentElement.removeAttribute('data-season');document.documentElement.removeAttribute('data-secondary-season');document.documentElement.removeAttribute('data-season-blend');document.documentElement.removeAttribute('data-time');}}catch(e){document.documentElement.setAttribute('data-seasonal-fx','off');}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const now = new Date()
  const state = getSeasonState(now, true)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-season={state.primary}
      data-secondary-season={state.secondary ?? ''}
      data-season-blend={state.blend.toFixed(3)}
      data-time={state.timeOfDay}
      data-mode="light"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: SEASONAL_FX_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SeasonalFxProvider>
            <LoadingProvider>
              <SeasonalEngine seasonState={state} />
              {children}
              <GrainOverlay />
              <SeasonDevPanel />
            </LoadingProvider>
          </SeasonalFxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
