import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { bus } from './system/telemetry'
import { CtlCtx, type Ctl } from './system/hooks'
import { ClockHero } from './components/widgets/ClockHero'
import { RenderCard } from './components/widgets/RenderCard'
import { MemoryCard } from './components/widgets/MemoryCard'
import { GlyphCard } from './components/widgets/GlyphCard'
import { BatteryCard } from './components/widgets/BatteryCard'
import { NetworkCard } from './components/widgets/NetworkCard'
import { ContributionsCard } from './components/widgets/ContributionsCard'
import { StreakCard } from './components/widgets/StreakCard'
import { SeismoCard } from './components/widgets/SeismoCard'
import { ActivityCard } from './components/widgets/ActivityCard'
import { CommandPalette } from './components/CommandPalette'

export default function App() {
  const [focus, setFocus] = useState(false)
  const [motionOff, setMotionOff] = useState(false)
  const [autoSweep, setAutoSweepState] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(o => !o)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const ctl: Ctl = useMemo(
    () => ({
      focus,
      setFocus,
      motionOff,
      setMotionOff,
      autoSweep,
      setAutoSweep: (v: boolean) => {
        setAutoSweepState(v)
        bus.setAutoSweep(v)
      },
      paletteOpen,
      setPaletteOpen,
    }),
    [focus, motionOff, autoSweep, paletteOpen],
  )

  return (
    <CtlCtx.Provider value={ctl}>
      <main className={`bento ${focus ? 'focus' : ''} ${motionOff ? 'nofx' : ''}`}>
        <ClockHero index={0} />
        <RenderCard index={1} />
        <MemoryCard index={2} />
        <GlyphCard index={3} />
        <BatteryCard index={4} />
        <NetworkCard index={5} />
        <ContributionsCard index={6} />
        <StreakCard index={7} />
        <SeismoCard index={8} />
        <ActivityCard index={9} />
      </main>
      <AnimatePresence>{paletteOpen && <CommandPalette />}</AnimatePresence>
    </CtlCtx.Provider>
  )
}
