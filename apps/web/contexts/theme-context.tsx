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
    // Light is the default regardless of OS preference — only an explicit
    // stored choice (from the toggle) should ever produce dark mode.
    function resolveMode(): Mode {
      try {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark' || saved === 'light') return saved
      } catch {}
      return 'light'
    }

    // Defer initial sync (avoids synchronous setState-in-effect lint rule)
    const t = setTimeout(() => {
      const initial = resolveMode()
      setMode(initial)
      document.documentElement.setAttribute('data-mode', initial)
    }, 0)

    return () => clearTimeout(t)
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
