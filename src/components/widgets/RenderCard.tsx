import { Card } from '../Card'
import { useTelemetry, useBootNumber } from '../../system/hooks'

const RING_R = 50
const RING_C = 2 * Math.PI * RING_R

export function RenderCard({ index }: { index: number }) {
  const snap = useTelemetry()
  const shown = useBootNumber(snap.fps)
  const pct = Math.min(1, snap.fps / 60)

  return (
    <Card index={index} label="Render" tag="LIVE" tagAlways>
      <div className="ring-wrap">
        <svg viewBox="0 0 110 110">
          <circle className="ring-bg" cx="55" cy="55" r={RING_R} />
          <circle
            className="ring-fg"
            cx="55"
            cy="55"
            r={RING_R}
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - pct)}
          />
        </svg>
        <div className="ring-val">
          {shown}
          <small>FPS</small>
        </div>
      </div>
      <div className="meta-row" style={{ marginTop: 'auto' }}>
        <span className="nowrap">Real-time<span className="unit"> FPS</span></span>
        <span className="nowrap">{snap.frameMs.toFixed(1)}<span className="unit"> MS</span></span>
      </div>
    </Card>
  )
}
