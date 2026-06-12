import { Card } from '../Card'
import { Segbar } from '../Segbar'
import { useTelemetry, useBootNumber } from '../../system/hooks'

export function MemoryCard({ index }: { index: number }) {
  const snap = useTelemetry()
  const pct = Math.min(99, Math.round((snap.heapMB / snap.heapLimitMB) * 100))
  const shown = useBootNumber(snap.heapMB)

  return (
    <Card index={index} label="Memory" tag={snap.heapReal ? 'LIVE' : 'SIM'}>
      <div className="metric">
        {shown}
        <small>MB</small>
      </div>
      <div className="mono-sub">/ {(snap.heapLimitMB / 1024).toFixed(1)} GB · {pct}% heap</div>
      <Segbar total={20} on={Math.max(1, Math.round((pct / 100) * 20))} baseDelay={0.42} />
    </Card>
  )
}
