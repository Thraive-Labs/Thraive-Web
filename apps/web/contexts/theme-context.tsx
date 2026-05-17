'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Mode = 'dark' | 'light'

interface ThemeContextValue {
  mode: Mode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'light', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    function resolveMode(): Mode {
      try {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark' || saved === 'light') return saved
      } catch {}
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    // Defer initial sync (avoids synchronous setState-in-effect lint rule)
    const t = setTimeout(() => {
      const initial = resolveMode()
      setMode(initial)
      document.documentElement.setAttribute('data-mode', initial)
    }, 0)

    // Follow system preference changes when no manual override is saved
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSysChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try { saved = localStorage.getItem('theme') } catch {}
      if (!saved) {
        const next: Mode = e.matches ? 'dark' : 'light'
        setMode(next)
        document.documentElement.setAttribute('data-mode', next)
      }
    }
    mq.addEventListener('change', onSysChange)
    return () => {
      clearTimeout(t)
      mq.removeEventListener('change', onSysChange)
    }
  }, [])

  const toggle = () => {
    const next: Mode = mode === 'dark' ? 'light' : 'dark'

    document.documentElement.classList.add('theme-transitioning')
    document.documentElement.setAttribute('data-mode', next)

    try {
      localStorage.setItem('theme', next)
    } catch {}

    setMode(next)
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 350)
  }

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
