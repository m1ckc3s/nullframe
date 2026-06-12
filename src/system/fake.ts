export const USER = '@nullframe'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(Math.floor(Date.now() / 864e5))

export const WEEKS = 52
export const DAYS = 7

export const contributions: number[] = (() => {
  const cells: number[] = []
  for (let w = 0; w < WEEKS; w++) {
    const heat = 0.35 + 0.5 * Math.sin((w / WEEKS) * Math.PI * 2.3 + 1) ** 2
    for (let d = 0; d < DAYS; d++) {
      const weekday = d >= 1 && d <= 5 ? 1 : 0.45
      const r = rng() * heat * weekday
      cells.push(r > 0.42 ? 4 : r > 0.3 ? 3 : r > 0.19 ? 2 : r > 0.09 ? 1 : 0)
    }
  }
  return cells
})()

export const totalContribs = contributions.reduce((s, v) => s + [0, 3, 7, 12, 19][v], 0)
export const streakDays = 41
export const streakSince = '02 MAY'

export const commitMessages = [
  'feat: glyph grid slam easing',
  'fix: seismo buffer wrap at 300',
  'chore: cap canvas DPR at 2',
  'feat: contribution glimmer pass',
  'refactor: single rAF telemetry bus',
  'fix: battery API fallback to SIM',
  'style: doto 400 hero numerals',
  'feat: command palette on ⌘K',
  'fix: pause all loops on hidden tab',
  'style: orange tip on traffic bars',
]

export const statusMessages = [
  'SYS NOMINAL · ALL CHANNELS GREEN',
  'PUSH main ← feat/glyph-grid',
  'CI GREEN · 247 TESTS · 0 FLAKY',
  'GLYPH INTERFACE · READY',
  'ZERO DROPPED FRAMES · COMPOSITE OK',
]
