import { useRef } from 'react'

type Props = { on: boolean; label: string; onChange: (v: boolean) => void }

export function Toggle({ on, label, onChange }: Props) {
  const thumbRef = useRef<HTMLSpanElement>(null)
  function click() {
    onChange(!on)
    const dots = thumbRef.current ? (Array.from(thumbRef.current.children) as HTMLElement[]) : []
    dots.forEach(d => {
      d.style.transitionDelay = `${(Math.random() * 140) | 0}ms`
      d.style.opacity = '0'
    })
    setTimeout(() => {
      dots.forEach(d => {
        d.style.transitionDelay = `${(Math.random() * 140) | 0}ms`
        d.style.opacity = '1'
      })
      setTimeout(() => dots.forEach(d => (d.style.transitionDelay = '0ms')), 200)
    }, 160)
  }
  return (
    <button className={`toggle ${on ? 'on' : ''}`} aria-label={label} aria-pressed={on} onClick={click}>
      <span className="thumb" ref={thumbRef}>
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </button>
  )
}
