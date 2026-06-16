let ctx: AudioContext | undefined
let last = 0
const COOLDOWN = 120

function unlock() {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { once: true })
  window.addEventListener('keydown', unlock, { once: true })
}

type Tone = { type?: OscillatorType; from: number; to?: number; decay?: number; gain?: number; delay?: number }

function tone({ type = 'sine', from, to, decay = 0.04, gain = 0.12, delay = 0 }: Tone) {
  const at = ctx!.currentTime + delay
  const osc = ctx!.createOscillator()
  const amp = ctx!.createGain()
  osc.type = type
  osc.detune.value = (Math.random() * 2 - 1) * 20
  osc.frequency.setValueAtTime(from, at)
  if (to && to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + decay)
  amp.gain.setValueAtTime(gain, at)
  amp.gain.exponentialRampToValueAtTime(0.0001, at + decay) // exp ramp can't reach 0
  osc.connect(amp).connect(ctx!.destination)
  osc.start(at)
  osc.stop(at + decay + 0.02)
}

export function play(sound: Tone | Tone[], { cooldown = true } = {}) {
  if (!ctx || ctx.state !== 'running') return
  if (cooldown) {
    const t = performance.now()
    if (t - last < COOLDOWN) return
    last = t
  }
  for (const layer of Array.isArray(sound) ? sound : [sound]) tone(layer)
}

export const SFX = {
  tap: { from: 1300, decay: 0.02, gain: 0.14 },
  tick: { from: 1500, decay: 0.015, gain: 0.11 },
  boop: { from: 600, to: 250, decay: 0.1, gain: 0.16 },
  focus: { from: 1300, decay: 0.025, gain: 0.06 },
  deselect: { from: 1200, decay: 0.045, gain: 0.13 },
  toggleOn: [
    { from: 2093, decay: 0.016, gain: 0.15 },
    { from: 3136, decay: 0.016, gain: 0.15, delay: 0.028 },
  ],
  toggleOff: [
    { from: 3136, decay: 0.016, gain: 0.15 },
    { from: 2093, decay: 0.016, gain: 0.15, delay: 0.028 },
  ],
} satisfies Record<string, Tone | Tone[]>
