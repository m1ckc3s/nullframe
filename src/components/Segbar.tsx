type Props = { total: number; on: number; color?: 'white' | 'green' | 'orange'; baseDelay?: number }

export function Segbar({ total, on, color = 'white', baseDelay = 0.4 }: Props) {
  return (
    <div className={`segbar ${color === 'white' ? '' : color}`}>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={i < on ? 'on' : ''} style={{ animationDelay: `${baseDelay + i * 0.045}s` }} />
      ))}
    </div>
  )
}
