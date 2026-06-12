import { useEffect, useRef } from 'react'
import { Card } from '../Card'
import { bus } from '../../system/telemetry'
import { useTelemetry, useBootNumber } from '../../system/hooks'

export function SeismoCard({ index }: { index: number }) {
  const snap = useTelemetry()
  const shown = useBootNumber(snap.inputRate)
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

    const N = 300
    const buf = new Float32Array(N)
    let head = 0
    let acc = 0
    const offDraw = bus.draw((t, dt) => {
      if (!vis || !w || !h) return
      acc += dt
      if (acc < 0.033) return
      acc = 0
      buf[head] = Math.min(1, Math.pow(bus.get().velocity / 1800, 0.7))
      head = (head + 1) % N
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const base = h * 0.8
      const amp = h * 0.68
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const v = buf[(head + i) % N] + Math.sin(t * 2.2 + i * 0.55) * 0.012
        const x = (i / (N - 1)) * (w - 8)
        const y = base - v * amp
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#cfcfcf'
      ctx.lineWidth = 1.4
      ctx.stroke()
      ctx.fillStyle = '#f26522'
      ctx.fillRect(w - 4, h * 0.06, 2, h * 0.88)
    })
    return () => {
      offDraw()
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <Card
      index={index}
      label="Input seismograph · CH 01"
      right={
        <span className="rec">
          <span className="led red" />
          REC
        </span>
      }
      className="seismo"
    >
      <div className="bpm">
        <span className="doto-mid">{shown}</span>
        <span className="mono-sub">EVT/MIN · pointer + keys</span>
      </div>
      <div className="canvas-fill" style={{ marginTop: 6 }}>
        <canvas ref={ref} />
      </div>
    </Card>
  )
}
