import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useCtl } from '../system/hooks'
import { play, SFX } from '../system/sound'

type Props = {
  index: number
  label: ReactNode
  right?: ReactNode
  tag?: 'LIVE' | 'SIM'
  tagAlways?: boolean
  className?: string
  essential?: boolean
  children: ReactNode
}

const HOVER = [SFX.boop, SFX.tap, SFX.focus, SFX.tick, SFX.deselect, SFX.tap, SFX.tick, SFX.boop, SFX.deselect, SFX.focus]

export function Card({ index, label, right, tag, tagAlways = false, className = '', essential = false, children }: Props) {
  const [shining, setShining] = useState(false)
  const ctl = useCtl()
  const reduced = useReducedMotion() || ctl.motionOff

  return (
    <motion.section
      className={`card ${className} ${essential ? '' : 'dimmable'}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.93 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26, delay: index * 0.07 }}
      onMouseEnter={() => {
        if (ctl.soundOn) play(HOVER[index % HOVER.length])
        if (!reduced && !shining) setShining(true)
      }}
    >
      <span className={`shine ${shining ? 'play' : ''}`} onAnimationEnd={() => setShining(false)} />
      <div className="meta-row">
        <span>{label}</span>
        {right && <span className="right">{right}</span>}
        {tag && <span key={tag} className={`tag ${tagAlways ? 'always' : ''}`}>{tag}</span>}
      </div>
      {children}
    </motion.section>
  )
}
