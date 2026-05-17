'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SeasonState } from '@/lib/seasonal'
import { applySeasonColorBlend } from '@/lib/seasonColors'
import { useLoading } from '@/contexts/loading-context'
import LoadingScreen from './LoadingScreen'
import ParticleCanvas from './ParticleCanvas'
import AccumulationCanvas, { type AccumulationHandle } from './AccumulationCanvas'

interface SeasonalEngineProps {
  seasonState: SeasonState
}

export default function SeasonalEngine({ seasonState }: SeasonalEngineProps) {
  const { isLoaded, setLoaded } = useLoading()
  const accRef = useRef<AccumulationHandle>(null)
  const [liveState, setLiveState] = useState<SeasonState>(seasonState)
  const colorStateRef = useRef({ primary: seasonState.primary, secondary: seasonState.secondary, colorBlend: seasonState.colorBlend })

  // Apply color blend on mount and whenever state changes
  useEffect(() => {
    colorStateRef.current = { primary: liveState.primary, secondary: liveState.secondary, colorBlend: liveState.colorBlend }
    applySeasonColorBlend(liveState.primary, liveState.secondary, liveState.colorBlend)
  }, [liveState.primary, liveState.secondary, liveState.colorBlend])

  // Re-apply when dark/light mode toggles (data-mode attribute changes)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const { primary, secondary, colorBlend } = colorStateRef.current
      applySeasonColorBlend(primary, secondary, colorBlend)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function handleOverride(e: Event) {
      const next = (e as CustomEvent<SeasonState>).detail
      setLiveState(next)
      const html = document.documentElement
      html.setAttribute('data-season', next.primary)
      html.setAttribute('data-secondary-season', next.secondary ?? '')
      html.setAttribute('data-season-blend', next.blend.toFixed(3))
      html.setAttribute('data-time', next.timeOfDay)
      applySeasonColorBlend(next.primary, next.secondary, next.colorBlend)
    }
    window.addEventListener('season-dev-override', handleOverride)
    return () => window.removeEventListener('season-dev-override', handleOverride)
  }, [])

  const handleParticleLand = useCallback((x: number, size: number) => {
    accRef.current?.onParticleLand(x, size)
  }, [])

  const { primary, secondary, blend, depth, timeOfDay, month, darkMode } = liveState

  return (
    <>
      {!isLoaded && (
        <LoadingScreen
          onComplete={setLoaded}
          season={primary}
          timeOfDay={timeOfDay}
          month={month}
          blend={blend}
          secondary={secondary}
          darkMode={darkMode}
        />
      )}

      {isLoaded && (
        <>
          <ParticleCanvas
            season={primary}
            timeOfDay={timeOfDay}
            month={month}
            blend={blend}
            secondary={secondary}
            depth={depth}
            onParticleLand={handleParticleLand}
          />
          <AccumulationCanvas ref={accRef} season={primary} />
        </>
      )}
    </>
  )
}
