import { useEffect, useRef } from 'react'
import { Card } from '../Card'
import { bus } from '../../system/telemetry'
import { useTelemetry, useBootNumber } from '../../system/hooks'

const BARS = 34

export function NetworkCard({ index }: { index: number }) {
  const snap = useTelemetry()
  const shown = useBootNumber(snap.net.downlink, 1)
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const ro = new ResizeObserver(() => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.max(1, Math.round(w * dpr))
      cv.height = Math.max(1, Math.round(h * dpr))
    })
    ro.observe(cv)
    let vis = true
    const io = new IntersectionObserver(en => {
      vis = en[0]?.isIntersecting ?? true
    })
    io.observe(cv)

    const buf = new Float32Array(BARS)
    let head = 0
    let acc = 1
    const offDraw = bus.draw((_t, dt) => {
      if (!vis || !w || !h) return
      acc += dt
      if (acc < 0.18) return
      acc = 0
      const base = Math.min(1, bus.get().net.downlink / 10)
      const burst = Math.random() < 0.07 ? 1.7 : 1
      buf[head] = Math.min(1, Math.max(0.06, base * (0.45 + Math.random() * 0.55) * burst))
      head = (head + 1) % BARS
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const gap = 3
      const bw = (w - (BARS - 1) * gap) / BARS
      for (let i = 0; i < BARS; i++) {
        const v = buf[(head + i) % BARS]
        const bh = Math.max(2, v * h)
        ctx.fillStyle = i === BARS - 1 ? '#f26522' : '#d8d8d8'
        ctx.fillRect(i * (bw + gap), h - bh, bw, bh)
      }
    })
    return () => {
      offDraw()
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <Card index={index} label="Network" tag={snap.netReal ? 'LIVE' : 'SIM'} tagAlways>
      <div className="metric">
        {shown}
        <small>MB/S</small>
      </div>
      <div className="mono-sub">
        RTT {snap.net.rtt} MS · {snap.online ? 'ONLINE' : 'OFFLINE'}
      </div>
      <div className="canvas-fill" style={{ maxHeight: 44, marginTop: 'auto' }}>
        <canvas ref={ref} />
      </div>
    </Card>
  )
}
