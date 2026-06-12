import { useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { bus } from '../system/telemetry'
import { useCtl } from '../system/hooks'

type Props = {
  index: number
  label: string
  right?: ReactNode
  tag?: 'LIVE' | 'SIM'
  tagAlways?: boolean
  className?: string
  essential?: boolean
  children: ReactNode
}

export function Card({ index, label, right, tag, tagAlways = false, className = '', essential = false, children }: Props) {
  const [sweep, setSweep] = useState(false)
  const ctl = useCtl()
  const reduced = useReducedMotion() || ctl.motionOff

  useEffect(() => {
    let timer = 0
    const unsub = bus.on('sync', () => {
      timer = window.setTimeout(() => {
        setSweep(true)
        timer = window.setTimeout(() => setSweep(false), 1100)
      }, index * 70)
    })
    return () => {
      unsub()
      clearTimeout(timer)
    }
  }, [index])

  return (
    <motion.section
      className={`card ${className} ${essential ? '' : 'dimmable'} ${sweep ? 'sweep' : ''}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.93 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26, delay: index * 0.07 }}
    >
      <span className="shine" />
      {tag && <span className={`tag ${tagAlways ? 'always' : ''}`}>{tag}</span>}
      <div className="meta-row">
        <span>{label}</span>
        {right && <span className="right">{right}</span>}
      </div>
      {children}
    </motion.section>
  )
}
