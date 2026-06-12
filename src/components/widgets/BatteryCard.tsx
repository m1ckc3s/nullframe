import { Card } from '../Card'
import { Segbar } from '../Segbar'
import { useTelemetry, useBootNumber } from '../../system/hooks'

export function BatteryCard({ index }: { index: number }) {
  const snap = useTelemetry()
  const pct = Math.round((snap.battery?.level ?? 0.87) * 100)
  const charging = snap.battery?.charging ?? false
  const shown = useBootNumber(pct)

  return (
    <Card index={index} label="Battery" tag={snap.batteryReal ? 'LIVE' : 'SIM'} tagAlways>
      <div className="doto-val">
        {shown}
        <small>%</small>
      </div>
      <Segbar total={24} on={Math.round((pct / 100) * 24)} color="green" baseDelay={0.56} />
      <div className="mono-sub" style={{ marginTop: 12 }}>
        {charging ? 'ON AC POWER · CHARGING' : 'ON CELL · DISCHARGING'}
      </div>
    </Card>
  )
}
