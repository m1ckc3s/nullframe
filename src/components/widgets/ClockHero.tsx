import { useEffect, useRef, useState } from 'react'
import { Card } from '../Card'
import { bus } from '../../system/telemetry'
import { useTelemetry, useCtl } from '../../system/hooks'
import { statusMessages } from '../../system/fake'

const pad = (n: number) => String(n).padStart(2, '0')
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const localFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  weekday: 'long',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function localParts(ms: number) {
  const out: Record<string, string> = {}
  for (const p of localFmt.formatToParts(new Date(ms))) out[p.type] = p.value
  return out
}

function isoWeek(year: number, monthIdx: number, day: number) {
  const x = new Date(Date.UTC(year, monthIdx, day))
  x.setUTCDate(x.getUTCDate() + 4 - (x.getUTCDay() || 7))
  const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1))
  return Math.ceil(((x.getTime() - y0.getTime()) / 864e5 + 1) / 7)
}

function TypedStatus() {
  const [txt, setTxt] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    let idx = 0
    let alive = true
    let t = 0
    const type = () => {
      if (!alive) return
      const msg = statusMessages[idx]
      if (i < msg.length) {
        i++
        setTxt(msg.slice(0, i))
        setDone(false)
        t = window.setTimeout(type, 24)
      } else {
        setDone(true)
        t = window.setTimeout(erase, 2400)
      }
    }
    const erase = () => {
      if (!alive) return
      if (i > 0) {
        i = Math.max(0, i - 2)
        setTxt(statusMessages[idx].slice(0, i))
        setDone(false)
        t = window.setTimeout(erase, 12)
      } else {
        idx = (idx + 1) % statusMessages.length
        t = window.setTimeout(type, 180)
      }
    }
    type()
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])
  const sp = txt.lastIndexOf(' ')
  const head = sp === -1 ? '' : txt.slice(0, sp + 1)
  const tail = sp === -1 ? txt : txt.slice(sp + 1)
  return (
    <div className="mono-sub right status">
      {head}
      <span className="nowrap">
        {tail}
        {done && <span className="sq" />}
      </span>
    </div>
  )
}

export function ClockHero({ index }: { index: number }) {
  const snap = useTelemetry()
  const ctl = useCtl()
  const [scramble, setScramble] = useState<string | null>(null)
  const motionOffRef = useRef(ctl.motionOff)
  motionOffRef.current = ctl.motionOff

  useEffect(() => {
    let frames = 0
    let iv = 0
    const run = () => {
      if (motionOffRef.current || document.hidden) return
      frames = 0
      clearInterval(iv)
      iv = window.setInterval(() => {
        setScramble(`${(Math.random() * 10) | 0}${(Math.random() * 10) | 0}:${(Math.random() * 10) | 0}${(Math.random() * 10) | 0}`)
        if (++frames > 7) {
          clearInterval(iv)
          setScramble(null)
        }
      }, 42)
    }
    const auto = window.setInterval(run, 30000)
    const unsub = bus.on('reroll', run)
    return () => {
      clearInterval(auto)
      clearInterval(iv)
      unsub()
    }
  }, [])

  const p = localParts(snap.now)
  const hhmm = scramble ?? `${p.hour}:${p.minute}`
  const week = isoWeek(Number(p.year), MONTHS.indexOf(p.month), Number(p.day))
  const up = Math.floor((snap.now - snap.bootAt) / 1000)
  const uptime = `${pad(Math.floor(up / 3600))}:${pad(Math.floor((up % 3600) / 60))}:${pad(up % 60)}`

  return (
    <Card
      index={index}
      label={`Local time · ${TZ.replaceAll('_', ' ')}`}
      right={<>SYS.V4.0.1<br />Uptime {uptime}</>}
      className="hero"
      essential
    >
      <div className="clock-line">
        <span className="led" />
        <span className="clock">{hhmm}</span>
        <span className="clock-sec">{p.second}</span>
      </div>
      <div className="hero-foot">
        <div>
          <div className="day">{p.weekday}</div>
          <div className="mono-sub">
            {p.day} {p.month.toUpperCase()} {p.year} · WEEK {week}
          </div>
        </div>
        <TypedStatus />
      </div>
    </Card>
  )
}
