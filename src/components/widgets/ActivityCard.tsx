import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Card } from '../Card'
import { commitMessages, USER } from '../../system/fake'

type Line = { id: number; msg: string; time: string }

const KEEP = 8

const pad = (n: number) => String(n).padStart(2, '0')
const stamp = () => {
  const d = new Date()
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function ActivityCard({ index }: { index: number }) {
  const [lines, setLines] = useState<Line[]>([])
  const [typingId, setTypingId] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    let t = 0
    let idx = 0
    let id = 0
    const push = () => {
      if (!alive) return
      if (document.hidden) {
        t = window.setTimeout(push, 7000)
        return
      }
      const full = commitMessages[idx % commitMessages.length]
      idx++
      const myId = id++
      const time = stamp()
      setLines(ls => [{ id: myId, msg: '', time }, ...ls].slice(0, KEEP))
      setTypingId(myId)
      let i = 0
      const type = () => {
        if (!alive) return
        i++
        setLines(ls => ls.map(l => (l.id === myId ? { ...l, msg: full.slice(0, i) } : l)))
        if (i < full.length) {
          t = window.setTimeout(type, 18)
        } else {
          setTypingId(null)
          t = window.setTimeout(push, 3500)
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
        {lines.map((l, i) => (
          <motion.div
            key={l.id}
            className="feed-row"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: Math.max(0, 1 - i * 0.22), y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <span>
              {l.msg}
              {l.id === typingId && <span className="sq" />}
            </span>
            <span className="dim">{l.time}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
