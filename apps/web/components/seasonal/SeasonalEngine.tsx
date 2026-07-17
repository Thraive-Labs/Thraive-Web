'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SeasonState } from '@/lib/seasonal'
import { getSeasonState } from '@/lib/seasonal'
import { applySeasonColorBlend } from '@/lib/seasonColors'
import { useLoading } from '@/contexts/loading-context'
import { useSeasonalFx } from '@/contexts/seasonal-fx-context'
import LoadingScreen from './LoadingScreen'
import ParticleCanvas from './ParticleCanvas'
import AccumulationCanvas, { type AccumulationHandle } from './AccumulationCanvas'

interface SeasonalEngineProps {
  seasonState: SeasonState
}

export default function SeasonalEngine({ seasonState }: SeasonalEngineProps) {
  const { isLoaded, setLoaded } = useLoading()
  const { enabled: fxEnabled } = useSeasonalFx()
  const accRef = useRef<AccumulationHandle>(null)
  const [liveState, setLiveState] = useState<SeasonState>(seasonState)
  const colorStateRef = useRef({ primary: seasonState.primary, secondary: seasonState.secondary, colorBlend: seasonState.colorBlend })

  // Apply color blend on mount and whenever state changes — only while FX is on.
  // When off, the luxury default palette (zero-specificity in globals.css) applies
  // untouched, so we must not write inline --season-* overrides here.
  useEffect(() => {
    if (!fxEnabled) return
    colorStateRef.current = { primary: liveState.primary, secondary: liveState.secondary, colorBlend: liveState.colorBlend }
    applySeasonColorBlend(liveState.primary, liveState.secondary, liveState.colorBlend)
  }, [fxEnabled, liveState.primary, liveState.secondary, liveState.colorBlend])

  // Re-apply when dark/light mode toggles (data-mode attribute changes)
  useEffect(() => {
    if (!fxEnabled) return
    const observer = new MutationObserver(() => {
      const { primary, secondary, colorBlend } = colorStateRef.current
      applySeasonColorBlend(primary, secondary, colorBlend)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
    return () => observer.disconnect()
  }, [fxEnabled])

  useEffect(() => {
    function handleOverride(e: Event) {
      if (!fxEnabled) return
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
  }, [fxEnabled])

  // Live toggling from the dev panel — mount/unmount canvases and swap the
  // inline vars immediately instead of waiting for a page reload.
  useEffect(() => {
    function handleFxChange(e: Event) {
      const next = (e as CustomEvent<{ enabled: boolean }>).detail
      const html = document.documentElement
      if (next.enabled) {
        const darkMode = html.getAttribute('data-mode') !== 'light'
        const fresh = getSeasonState(new Date(), darkMode)
        setLiveState(fresh)
        html.setAttribute('data-season', fresh.primary)
        html.setAttribute('data-secondary-season', fresh.secondary ?? '')
        html.setAttribute('data-season-blend', fresh.blend.toFixed(3))
        html.setAttribute('data-time', fresh.timeOfDay)
        applySeasonColorBlend(fresh.primary, fresh.secondary, fresh.colorBlend)
      } else {
        html.removeAttribute('data-season')
        html.removeAttribute('data-secondary-season')
        html.removeAttribute('data-season-blend')
        html.removeAttribute('data-time')
        for (const key of [
          '--season-ambient', '--season-ambient-dim', '--season-glow', '--season-glow-soft',
          '--season-bg-tint', '--season-card-border', '--season-accent', '--season-btn-bg', '--season-btn-hover',
        ]) {
          html.style.removeProperty(key)
        }
      }
    }
    window.addEventListener('seasonal-fx-change', handleFxChange)
    return () => window.removeEventListener('seasonal-fx-change', handleFxChange)
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
          fxEnabled={fxEnabled}
        />
      )}

      {isLoaded && fxEnabled && (
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
