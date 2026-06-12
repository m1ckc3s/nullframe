import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Card } from '../Card'
import { useCtl } from '../../system/hooks'
import { contributions, totalContribs, USER, WEEKS, DAYS } from '../../system/fake'

const GAP = 3

export function ContributionsCard({ index }: { index: number }) {
  const ctl = useCtl()
  const motionOff = (useReducedMotion() ?? false) || ctl.motionOff
  const gridRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ weeks: 0, cell: 0 })

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const cell = Math.max(6, Math.floor((el.clientHeight - (DAYS - 1) * GAP) / DAYS))
      const weeks = Math.min(WEEKS, Math.max(8, Math.floor((el.clientWidth + GAP) / (cell + GAP))))
      setDims(d => (d.weeks === weeks && d.cell === cell ? d : { weeks, cell }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (motionOff) return
    const el = gridRef.current
    if (!el) return
    const iv = window.setInterval(() => {
      if (document.hidden) return
      const kids = el.children
      if (!kids.length) return
      const k = kids[(Math.random() * kids.length) | 0] as HTMLElement
      if (!/l[2-4]/.test(k.className)) return
      k.classList.add('glim')
      window.setTimeout(() => k.classList.remove('glim'), 420)
    }, 650)
    return () => clearInterval(iv)
  }, [motionOff])

  const shown = dims.weeks ? contributions.slice(-dims.weeks * DAYS) : []

  return (
    <Card index={index} label={`Contributions · ${USER}`} right={`${totalContribs.toLocaleString('en-US')} / YR`} className="contrib">
      <div
        className="contrib-grid"
        ref={gridRef}
        style={dims.weeks ? { gridTemplateColumns: `repeat(${dims.weeks}, ${dims.cell}px)`, gridAutoRows: `${dims.cell}px` } : undefined}
      >
        {shown.map((lvl, i) => {
          const week = Math.floor(i / DAYS)
          const day = i % DAYS
          return (
            <i
              key={i}
              className={lvl ? `l${lvl}` : ''}
              style={{ gridColumn: week + 1, gridRow: day + 1, animationDelay: `${0.3 + (week + day) * 0.018}s` }}
            />
          )
        })}
      </div>
      <div className="meta-row">
        <span>{dims.weeks || WEEKS} weeks</span>
        <span>Best 23 / day</span>
      </div>
    </Card>
  )
}
