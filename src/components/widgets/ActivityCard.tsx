import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Card } from '../Card'
import { commitMessages, USER } from '../../system/fake'

type Line = { msg: string; time: string }

const pad = (n: number) => String(n).padStart(2, '0')
const stamp = () => {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function ActivityCard({ index }: { index: number }) {
  const [lines, setLines] = useState<Line[]>([])
  const [typing, setTyping] = useState('')

  useEffect(() => {
    let alive = true
    let t = 0
    let idx = 0
    const push = () => {
      if (!alive) return
      if (document.hidden) {
        t = window.setTimeout(push, 7000)
        return
      }
      const msg = commitMessages[idx % commitMessages.length]
      idx++
      const time = stamp()
      let i = 0
      const type = () => {
        if (!alive) return
        i++
        setTyping(msg.slice(0, i))
        if (i < msg.length) {
          t = window.setTimeout(type, 18)
        } else {
          setLines(ls => [{ msg, time }, ...ls].slice(0, 3))
          setTyping('')
          t = window.setTimeout(push, 6500)
        }
      }
      type()
    }
    t = window.setTimeout(push, 1200)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])

  return (
    <Card index={index} label={`Activity · ${USER}`} right="push · main" className="feed">
      <div className="feed-rows">
        {typing && (
          <div className="feed-row">
            <span>{typing}<span className="sq" /></span>
            <span className="dim">{stamp()}</span>
          </div>
        )}
        {lines.map((l, i) => (
          <motion.div
            key={l.time + l.msg}
            className="feed-row"
            style={{ opacity: 1 - i * 0.3 }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1 - i * 0.3, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span>{l.msg}</span>
            <span className="dim">{l.time}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
