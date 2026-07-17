'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface SeasonalFxContextValue {
  enabled: boolean
  setEnabled: (next: boolean) => void
  toggle: () => void
}

const SeasonalFxContext = createContext<SeasonalFxContextValue>({
  enabled: false,
  setEnabled: () => {},
  toggle: () => {},
})

export function SeasonalFxProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false)

  // Sync with whatever the anti-FOUC script already decided (see SEASONAL_FX_SCRIPT
  // in app/layout.tsx) rather than re-reading localStorage — avoids a redundant
  // read and keeps the two in lockstep.
  useEffect(() => {
    const t = setTimeout(() => {
      setEnabledState(document.documentElement.getAttribute('data-seasonal-fx') === 'on')
    }, 0)
    return () => clearTimeout(t)
  }, [])

  const setEnabled = (next: boolean) => {
    setEnabledState(next)
    try {
      localStorage.setItem('seasonal-fx', next ? 'on' : 'off')
    } catch {}
    document.documentElement.setAttribute('data-seasonal-fx', next ? 'on' : 'off')
    window.dispatchEvent(new CustomEvent('seasonal-fx-change', { detail: { enabled: next } }))
  }

  const toggle = () => setEnabled(!enabled)

  return (
    <SeasonalFxContext.Provider value={{ enabled, setEnabled, toggle }}>
      {children}
    </SeasonalFxContext.Provider>
  )
}

export function useSeasonalFx() {
  return useContext(SeasonalFxContext)
}
