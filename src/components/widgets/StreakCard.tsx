import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Card } from '../Card'
import { useBootNumber, useCtl } from '../../system/hooks'
import { streakDays, streakSince } from '../../system/fake'

export function StreakCard({ index }: { index: number }) {
  const ctl = useCtl()
  const motionOff = (useReducedMotion() ?? false) || ctl.motionOff
  const shown = useBootNumber(streakDays)
  const [scramble, setScramble] = useState<string | null>(null)

  useEffect(() => {
    if (motionOff) return
    let iv = 0
    let n = 0
    const auto = window.setInterval(() => {
      if (document.hidden) return
      n = 0
      clearInterval(iv)
      iv = window.setInterval(() => {
        setScramble(`${((Math.random() * 9) | 0) + 1}${(Math.random() * 10) | 0}`)
        if (++n > 5) {
          clearInterval(iv)
          setScramble(null)
        }
      }, 45)
    }, 12000)
    return () => {
      clearInterval(auto)
      clearInterval(iv)
    }
  }, [motionOff])

  return (
    <Card index={index} label="Streak" tag="SIM">
      <div className="doto-val">
        {scramble ?? shown}
        <small>D</small>
      </div>
      <div className="streakbar">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${0.6 + i * 0.05}s, ${0.8 + i * 0.3}s` }} />
        ))}
      </div>
      <div className="mono-sub" style={{ marginTop: 12 }}>
        Since {streakSince} · best 63
      </div>
    </Card>
  )
}
