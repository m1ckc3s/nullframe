import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { animate } from 'motion/react'
import { bus, type Snapshot } from './telemetry'

export function useTelemetry(): Snapshot {
  return useSyncExternalStore(bus.subscribe, bus.get)
}

export function useBootNumber(live: number, dec = 0, duration = 0.9): string {
  const [p, setP] = useState(0)
  useEffect(() => {
    const c = animate(0, 1, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setP })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (live * p).toFixed(dec)
}

export type Ctl = {
  focus: boolean
  setFocus: (v: boolean) => void
  motionOff: boolean
  setMotionOff: (v: boolean) => void
  autoSweep: boolean
  setAutoSweep: (v: boolean) => void
  soundOn: boolean
  setSoundOn: (v: boolean) => void
  paletteOpen: boolean
  setPaletteOpen: (v: boolean) => void
}

export const CtlCtx = createContext<Ctl>(null as unknown as Ctl)
export const useCtl = () => useContext(CtlCtx)
