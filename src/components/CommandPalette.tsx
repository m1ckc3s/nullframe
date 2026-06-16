import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { bus } from '../system/telemetry'
import { useCtl } from '../system/hooks'

export function CommandPalette() {
  const ctl = useCtl()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const cmds = useMemo(
    () => [
      { label: `Focus mode · ${ctl.focus ? 'off' : 'on'}`, run: () => ctl.setFocus(!ctl.focus) },
      { label: 'Reroll clock', run: () => bus.reroll() },
      { label: `Motion FX · ${ctl.motionOff ? 'on' : 'off'}`, run: () => ctl.setMotionOff(!ctl.motionOff) },
    ],
    [ctl],
  )
  const list = cmds.filter(c => c.label.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => inputRef.current?.focus(), [])
  useEffect(() => setSel(0), [q])

  const close = () => ctl.setPaletteOpen(false)

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel(s => Math.min(list.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel(s => Math.max(0, s - 1))
    } else if (e.key === 'Enter' && list[sel]) {
      list[sel].run()
      close()
    }
  }

  return (
    <motion.div
      className="pal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={close}
    >
      <motion.div
        className="pal"
        initial={{ opacity: 0, y: -14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        onClick={e => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="RUN COMMAND…"
          spellCheck={false}
        />
        {list.length === 0 && <div className="pal-empty">NO MATCH</div>}
        {list.map((c, i) => (
          <div
            key={c.label}
            className={`pal-row ${i === sel ? 'sel' : ''}`}
            onMouseEnter={() => setSel(i)}
            onClick={() => {
              c.run()
              close()
            }}
          >
            <span>{c.label}</span>
            <span className="dim">↵</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
